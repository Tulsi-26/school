import { Instrument, Connection, ValidationError, CircuitValidation } from '@/context/PhysicsLabContext';

/**
 * Helper to build an adjacency list representing the circuit graph.
 * Nodes are terminal IDs.
 */
function buildAdjacencyList(instruments: Instrument[], connections: Connection[]) {
  const adj = new Map<string, Set<string>>();

  const ensureNode = (id: string) => {
    if (!adj.has(id)) adj.set(id, new Set());
  };

  // Add connections as edges in the graph
  for (const conn of connections) {
    ensureNode(conn.from);
    ensureNode(conn.to);
    adj.get(conn.from)!.add(conn.to);
    adj.get(conn.to)!.add(conn.from);
  }

  for (const inst of instruments) {
    for (const t of inst.terminals) {
      ensureNode(t.id);
    }

    // Add internal paths for components that conduct
    if (['resistor', 'rheostat', 'ammeter', 'voltmeter', 'galvanometer', 'switch', 'battery'].includes(inst.type)) {
      if (inst.terminals.length >= 2) {
        const t1 = inst.terminals[0].id;
        const t2 = inst.terminals[1].id;
        ensureNode(t1);
        ensureNode(t2);

        // Switches only conduct when closed
        if (inst.type !== 'switch' || inst.properties.closed) {
          // Standard components connect terminal 1 and 2
          adj.get(t1)!.add(t2);
          adj.get(t2)!.add(t1);

          // Rheostat specific: 3 terminals. Terminal 3 (slider) connects to Terminal 1 or 2 depending on usage.
          if (inst.type === 'rheostat' && inst.terminals.length >= 3) {
            const t3 = inst.terminals[2].id;
            ensureNode(t3);
            adj.get(t1)!.add(t3);
            adj.get(t3)!.add(t1);
            adj.get(t2)!.add(t3);
            adj.get(t3)!.add(t2);
          }
        }
      }
    }
  }

  return adj;
}

/**
 * Check whether a closed loop exists from any battery positive
 * terminal back to its negative terminal (BFS).
 */
function hasClosedLoop(
  instruments: Instrument[],
  connections: Connection[]
): boolean {
  const adj = buildAdjacencyList(instruments, connections);
  const battery = instruments.find((i) => i.type === 'battery');
  if (!battery || battery.terminals.length < 2) return false;

  const start = battery.terminals[0].id; // positive
  const end = battery.terminals[1].id; // negative

  const visited = new Set<string>();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === end) return true;

    const neighbors = adj.get(current);
    if (neighbors) {
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }
  }

  return false;
}

/**
 * KCL check – identify unconnected terminals
 */
function checkKCL(instruments: Instrument[], connections: Connection[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const terminalConnectionCount = new Map<string, number>();
  for (const conn of connections) {
    terminalConnectionCount.set(conn.from, (terminalConnectionCount.get(conn.from) || 0) + 1);
    terminalConnectionCount.set(conn.to, (terminalConnectionCount.get(conn.to) || 0) + 1);
  }

  for (const inst of instruments) {
    for (const t of inst.terminals) {
      const count = terminalConnectionCount.get(t.id) || 0;
      if (count === 0) {
        errors.push({
          type: 'warning',
          code: 'UNCONNECTED_TERMINAL',
          message: `${inst.name} has an unconnected ${t.type} terminal`,
          instrumentId: inst.id,
        });
      }
    }
  }

  return errors;
}

/**
 * KVL check – sum of voltages around a loop should be zero.
 */
function checkKVL(
  batteryVoltage: number,
  totalResistance: number,
  current: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  // For basic simulation, we assume perfect satisfaction if connected correctly.
  return errors;
}

export function validateOhmLawCircuit(
  instruments: Instrument[],
  connections: Connection[]
): CircuitValidation {
  const errors: ValidationError[] = [];
  const suggestions: string[] = [];

  const battery = instruments.find((i) => i.type === 'battery');
  const resistor = instruments.find((i) => (i.type === 'resistor' || i.type === 'rheostat'));
  const sw = instruments.find((i) => i.type === 'switch');
  const ammeter = instruments.find((i) => i.type === 'ammeter');
  const voltmeter = instruments.find((i) => i.type === 'voltmeter');

  if (!battery) {
    errors.push({ type: 'error', code: 'MISSING_BATTERY', message: 'Battery is required' });
    suggestions.push('Drag a Battery from the panel');
  }
  if (!resistor) {
    errors.push({ type: 'error', code: 'MISSING_RESISTOR', message: 'Resistor is required' });
    suggestions.push('Add a Resistor to the circuit');
  }

  if (sw && !sw.properties.closed) {
    errors.push({ type: 'info', code: 'SWITCH_OPEN', message: 'Switch is open' });
  }

  const kclErrors = checkKCL(instruments, connections);
  errors.push(...kclErrors);

  const isClosed = hasClosedLoop(instruments, connections);
  if (!isClosed && connections.length > 0) {
    errors.push({ type: 'error', code: 'OPEN_CIRCUIT', message: 'Circuit is not closed' });
  }

  const hasBlockingErrors = errors.some((e) => e.type === 'error');

  return {
    isValid: !hasBlockingErrors,
    isClosed,
    errors,
    suggestions,
  };
}

export function getWheatstoneMapping(instruments: Instrument[], connections: Connection[]) {
  const parent = new Map<string, string>();
  const find = (id: string) => {
    if (!parent.has(id)) parent.set(id, id);
    if (parent.get(id) !== id) parent.set(id, find(parent.get(id)!));
    return parent.get(id)!;
  };
  const union = (id1: string, id2: string) => {
    parent.set(find(id1), find(id2));
  };

  for (const conn of connections) {
    union(conn.from, conn.to);
  }
  for (const inst of instruments) {
    if (inst.type === 'switch' && inst.properties.closed && inst.terminals.length >= 2) {
      union(inst.terminals[0].id, inst.terminals[1].id);
    }
  }

  const battery = instruments.find(i => i.type === 'battery');
  const galvanometer = instruments.find(i => i.type === 'galvanometer');
  const resistors = instruments.filter(i => i.type === 'resistor' || i.type === 'rheostat');

  if (!battery || !galvanometer || resistors.length < 4) return { isCorrect: false };

  const nA = find(battery.terminals[0].id);
  const nC = find(battery.terminals[1].id);
  const nB = find(galvanometer.terminals[0].id);
  const nD = find(galvanometer.terminals[1].id);

  const distinctNets = new Set([nA, nB, nC, nD]);
  if (distinctNets.size !== 4) return { isCorrect: false };

  const connects = (inst: Instrument, net1: string, net2: string) => {
     if (inst.terminals.length < 2) return false;
     const tIds = inst.terminals.map(t => find(t.id));
     return (tIds.includes(net1) && tIds.includes(net2));
  };

  let R_AB = null, R_AD = null, R_CB = null, R_CD = null;

  for (const r of resistors) {
    if (!R_AB && connects(r, nA, nB)) R_AB = r;
    else if (!R_AD && connects(r, nA, nD)) R_AD = r;
    else if (!R_CB && connects(r, nC, nB)) R_CB = r;
    else if (!R_CD && connects(r, nC, nD)) R_CD = r;
  }

  if (R_AB && R_AD && R_CB && R_CD) {
    return { isCorrect: true, p: R_AB, q: R_AD, r: R_CB, s: R_CD };
  }
  return { isCorrect: false };
}

export function validateWheatstoneBridge(
  instruments: Instrument[],
  connections: Connection[]
): CircuitValidation {
  const errors: ValidationError[] = [];
  const suggestions: string[] = [];

  const battery = instruments.find((i) => i.type === 'battery');
  const resistors = instruments.filter((i) => i.type === 'resistor' || i.type === 'rheostat');
  const galvanometer = instruments.find((i) => i.type === 'galvanometer');
  const switches = instruments.filter((i) => i.type === 'switch');

  if (!battery) {
    errors.push({ type: 'error', code: 'MISSING_BATTERY', message: 'Battery is required' });
  }
  if (resistors.length < 4) {
    errors.push({ type: 'error', code: 'MISSING_RESISTORS', message: `Need 4 resistors — found ${resistors.length}` });
  }

  const allSwitchesClosed = switches.every((s) => s.properties.closed);
  if (switches.length > 0 && !allSwitchesClosed) {
    errors.push({ type: 'info', code: 'SWITCH_OPEN', message: 'Close all switches' });
  }

  const kclErrors = checkKCL(instruments, connections);
  errors.push(...kclErrors);

  const isClosed = hasClosedLoop(instruments, connections);
  const topology = getWheatstoneMapping(instruments, connections);

  if (battery && galvanometer && resistors.length >= 4) {
    if (!topology.isCorrect) {
      if (connections.length > 0) {
        errors.push({ type: 'warning', code: 'WRONG_TOPOLOGY', message: 'Incomplete bridge structure' });
        suggestions.push('Connect resistors in a diamond: A-B, A-D, C-B, C-D');
      }
    } else if (!isClosed) {
      errors.push({ type: 'info', code: 'OPEN_LOOP', message: 'Bridge structure detected - ensure battery loop is closed' });
    }
  }

  const hasBlockingErrors = errors.some((e) => e.type === 'error');

  return {
    isValid: !hasBlockingErrors && topology.isCorrect,
    isClosed,
    errors,
    suggestions,
  };
}
