export interface CircuitState {
    voltage: number;
    resistance: number;
    current: number;
    isClosed: boolean;
    isValid: boolean;
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
    const totalResistance = baseResistance + rheostatResistance;

    if (!isSwitchClosed) {
        return { voltage: 0, resistance: totalResistance, current: 0, isClosed: false, isValid: false, hint: "Switch is open." };
    }

    if (connections.length < 5) {
        return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Circuit is incomplete. Connect all components." };
    }

    // Graph Construction
    const adjList = new Map<string, string[]>(); // terminalId -> connected terminalIds

    // Add edges for explicit wire connections
    connections.forEach(conn => {
        if (!adjList.has(conn.from)) adjList.set(conn.from, []);
        if (!adjList.has(conn.to)) adjList.set(conn.to, []);
        adjList.get(conn.from)!.push(conn.to);
        adjList.get(conn.to)!.push(conn.from);
    });

    // Add edges for internal instrument connections (from t1 to t2 inside the component)
    const instrumentMap = new Map<string, any>();
    instruments.forEach(inst => {
        instrumentMap.set(inst.id, inst);
        if (inst.terminals && inst.terminals.length >= 2) {
            const t1 = inst.terminals[0].id;
            const t2 = inst.terminals[1].id;
            if (!adjList.has(t1)) adjList.set(t1, []);
            if (!adjList.has(t2)) adjList.set(t2, []);
            // Internal path (only if closed for switches, but we already handled open switches)
            adjList.get(t1)!.push(t2);
            adjList.get(t2)!.push(t1);
        }
    });

    // Find battery terminals
    const battery = instruments.find(i => i.type === 'battery');
    if (!battery) return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Battery is missing." };

    const batPositive = battery.terminals.find((t: any) => t.type === 'positive')?.id;
    const batNegative = battery.terminals.find((t: any) => t.type === 'negative')?.id;

    if (!batPositive || !batNegative || !adjList.has(batPositive)) {
        return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Battery not connected properly." };
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
        return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Circuit is completely broken. No path back to the battery." };
    }

    // Analyze components in the path
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
        return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Ammeter is missing or bypassed." };
    }

    if (componentsInPath.has('voltmeter')) {
        return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Voltmeter is connected in series. It must be in parallel across the resistor." };
    }

    // Check voltmeter is in parallel specifically across the resistor
    const voltmeter = instruments.find(i => i.type === 'voltmeter');
    const resistor = instruments.find(i => i.type === 'resistor');
    let isVoltmeterCorrect = false;

    if (voltmeter && resistor) {
        // A simple check: Voltmeter terminals should be directly connected to the Resistor's terminals
        const vmT1 = voltmeter.terminals[0]?.id;
        const vmT2 = voltmeter.terminals[1]?.id;
        const resT1 = resistor.terminals[0]?.id;
        const resT2 = resistor.terminals[1]?.id;

        const vmT1Neighbors = adjList.get(vmT1) || [];
        const vmT2Neighbors = adjList.get(vmT2) || [];

        if ((vmT1Neighbors.includes(resT1) || vmT1Neighbors.includes(resT2)) &&
            (vmT2Neighbors.includes(resT1) || vmT2Neighbors.includes(resT2))) {
            isVoltmeterCorrect = true;
        }
    }

    if (!isVoltmeterCorrect) {
        if (!voltmeter) {
            return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Voltmeter is missing." };
        }
        return { voltage: 0, resistance: totalResistance, current: 0, isClosed: true, isValid: false, hint: "Voltmeter must be connected in parallel directly across the resistor." };
    }

    // If we reach here, circuit is correct enough for simulation
    const current = batteryVoltage / totalResistance;
    const voltageAcrossResistor = current * baseResistance;

    return {
        voltage: voltageAcrossResistor,
        resistance: totalResistance,
        current: current,
        isClosed: true,
        isValid: true,
    };
};
