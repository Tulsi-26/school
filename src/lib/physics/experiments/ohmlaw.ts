export interface CircuitState {
    voltage: number;
    resistance: number;
    current: number;
    isClosed: boolean;
    isValid: boolean;
    v?: number;
    i?: number;
    r?: number;
    rheostatR?: number;
    hint?: string;
}

export const calculateOhmLaw = (
    batteryVoltage: number,
    baseResistance: number,
    rheostatResistance: number,
    isSwitchClosed: boolean,
    connections: any[],
    instruments: any[]
): CircuitState => {
    if (!isSwitchClosed) {
        return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: false, isValid: false, hint: "Switch is open." };
    }

    if (connections.length < 5) {
        return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Circuit is incomplete. Connect all components." };
    }

    // Graph Construction
    const adjList = new Map<string, string[]>(); // terminalId -> connected terminalIds

    const ensureNode = (id: string) => {
        if (!adjList.has(id)) adjList.set(id, []);
    };

    // Add edges for explicit wire connections
    connections.forEach(conn => {
        ensureNode(conn.from);
        ensureNode(conn.to);
        adjList.get(conn.from)!.push(conn.to);
        adjList.get(conn.to)!.push(conn.from);
    });

    // Add edges for internal instrument connections (from t1 to t2 inside the component)
    const instrumentMap = new Map<string, any>();
    instruments.forEach(inst => {
        instrumentMap.set(inst.id, inst);

        // Only components that allow current to flow through them should have internal edges
        if (['resistor', 'ammeter', 'switch', 'galvanometer'].includes(inst.type)) {
            if (inst.terminals && inst.terminals.length >= 2) {
                const t1 = inst.terminals[0].id;
                const t2 = inst.terminals[1].id;
                ensureNode(t1);
                ensureNode(t2);

                // For switches, only allow internal path if closed
                if (inst.type !== 'switch' || inst.properties.closed) {
                    adjList.get(t1)!.push(t2);
                    adjList.get(t2)!.push(t1);
                }
            }
        } else if (inst.type === 'rheostat') {
            if (inst.terminals && inst.terminals.length >= 3) {
                const t1 = inst.terminals[0].id; // End A
                const t2 = inst.terminals[1].id; // End B
                const t3 = inst.terminals[2].id; // Slider

                ensureNode(t1);
                ensureNode(t2);
                ensureNode(t3);

                // Internal paths between all terminals for a rheostat
                adjList.get(t1)!.push(t2, t3);
                adjList.get(t2)!.push(t1, t3);
                adjList.get(t3)!.push(t1, t2);
            }
        }
    });

    // Find battery terminals
    const battery = instruments.find(i => i.type === 'battery');
    if (!battery) return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Battery is missing." };

    const batPositive = battery.terminals.find((t: any) => t.type === 'positive')?.id || battery.terminals[0]?.id;
    const batNegative = battery.terminals.find((t: any) => t.type === 'negative')?.id || battery.terminals[1]?.id;

    if (!batPositive || !batNegative || !adjList.has(batPositive)) {
        return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Battery not connected properly." };
    }

    // Pathfinding (BFS) from battery positive to battery negative
    const visited = new Set<string>();
    const queue: { current: string, path: string[] }[] = [{ current: batPositive, path: [batPositive] }];
    let validPathFound = false;
    let foundPath: string[] = [];

    while (queue.length > 0) {
        const { current, path } = queue.shift()!;

        if (current === batNegative && path.length > 2) { // path must go through something
            validPathFound = true;
            foundPath = path;
            break; // take first valid path (simplification)
        }

        if (visited.has(current)) continue;
        visited.add(current);

        const neighbors = adjList.get(current) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push({ current: neighbor, path: [...path, neighbor] });
            }
        }
    }

    if (!validPathFound) {
        return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Circuit is completely broken. No path back to the battery." };
    }

    // Analyze components in the path (excluding voltmeter, which should be parallel)
    const componentsInPath = new Set<string>();
    foundPath.forEach(termId => {
        instruments.forEach(inst => {
            if (inst.terminals.some((t: any) => t.id === termId)) {
                componentsInPath.add(inst.type);
            }
        });
    });

    if (!componentsInPath.has('resistor') && !componentsInPath.has('rheostat')) {
        return { voltage: 0, resistance: 0, current: Infinity, isClosed: true, isValid: false, hint: "Short circuit detected! Connect a resistor to prevent damage." };
    }

    if (!componentsInPath.has('ammeter')) {
        return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Ammeter is missing or bypassed." };
    }

    if (componentsInPath.has('voltmeter')) {
        return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Voltmeter is connected in series. It must be in parallel across the resistor." };
    }

    // Check voltmeter is in parallel specifically across the resistor
    const voltmeter = instruments.find(i => i.type === 'voltmeter');
    const resistor = instruments.find(i => i.type === 'resistor');
    let isVoltmeterCorrect = false;

    if (voltmeter && resistor) {
        const vmT1 = voltmeter.terminals[0]?.id;
        const vmT2 = voltmeter.terminals[1]?.id;
        const resT1 = resistor.terminals[0]?.id;
        const resT2 = resistor.terminals[1]?.id;

        // Check if there is a direct wire connection between VM terminals and Resistor terminals
        const checkConnection = (tA: string, tB: string) => {
            return connections.some(c =>
                (c.from === tA && c.to === tB) ||
                (c.from === tB && c.to === tA)
            );
        };

        if ((checkConnection(vmT1, resT1) || checkConnection(vmT1, resT2)) &&
            (checkConnection(vmT2, resT1) || checkConnection(vmT2, resT2))) {
            isVoltmeterCorrect = true;
        }
    }

    if (!isVoltmeterCorrect) {
        if (!voltmeter) {
            return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Voltmeter is missing." };
        }
        return { voltage: 0, resistance: baseResistance + rheostatResistance, current: 0, isClosed: true, isValid: false, hint: "Voltmeter must be connected in parallel directly across the resistor." };
    }

    // If we reach here, circuit is correct enough for simulation
    
    // Dynamic rheostat resistance based on connected terminals
    let effectiveRheostatR = 0;
    const rheostat = instruments.find(i => i.type === 'rheostat');
    if (rheostat && rheostat.terminals.length >= 3) {
        const t1 = rheostat.terminals[0].id; // End A
        const t2 = rheostat.terminals[1].id; // End B
        const t3 = rheostat.terminals[2].id; // Slider

        const inPath = (tid: string) => foundPath.includes(tid);
        const currentR = rheostat.properties.resistance || 0;
        const maxR = rheostat.properties.maxResistance || 100;

        if (inPath(t1) && inPath(t3)) {
            effectiveRheostatR = currentR;
        } else if (inPath(t2) && inPath(t3)) {
            effectiveRheostatR = maxR - currentR;
        } else if (inPath(t1) && inPath(t2)) {
            effectiveRheostatR = maxR;
        } else {
            // Default to the provided value if path detection is ambiguous
            effectiveRheostatR = rheostatResistance;
        }
    } else {
        effectiveRheostatR = rheostatResistance;
    }

    const totalRes = baseResistance + effectiveRheostatR;
    const current = totalRes > 0 ? batteryVoltage / totalRes : 0;
    const voltageAcrossResistor = current * baseResistance;

    return {
        voltage: voltageAcrossResistor,
        resistance: totalRes,
        current: current,
        v: voltageAcrossResistor,
        i: current,
        r: totalRes,
        rheostatR: effectiveRheostatR,
        isClosed: true,
        isValid: true,
    };
};
