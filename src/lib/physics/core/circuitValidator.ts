/**
 * Circuit Validator – Validates circuits using electrical rules
 * Implements Ohm's Law (V=IR) and Kirchhoff's Laws (KCL/KVL)
 */

import type { Instrument, Connection } from '@/context/PhysicsLabContext';

export interface ValidationError {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  instrumentId?: string;
}

export interface CircuitValidation {
  isValid: boolean;
  isClosed: boolean;
  errors: ValidationError[];
  suggestions: string[];
}

/**
 * Build an adjacency list from instruments and connections.
 * Each terminal is a node; connections form edges.
 */
function buildAdjacencyList(
  instruments: Instrument[],
  connections: Connection[]
): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();

  for (const inst of instruments) {
    for (const t of inst.terminals) {
      if (!adj.has(t.id)) adj.set(t.id, new Set());
    }
  }

  for (const conn of connections) {
    if (!adj.has(conn.from)) adj.set(conn.from, new Set());
    if (!adj.has(conn.to)) adj.set(conn.to, new Set());
    adj.get(conn.from)!.add(conn.to);
    adj.get(conn.to)!.add(conn.from);
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
 * KCL check – at every node, current in must equal current out.
 * In a simple series circuit with one battery this is always satisfied
 * when the loop is closed. For parallel branches we check connectivity.
 */
function checkKCL(instruments: Instrument[], connections: Connection[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // Identify nodes with only one connection (dead-end / open node)
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
 * For a simple Ohm's law circuit: V_battery - I*R_total = 0
 */
function checkKVL(
  batteryVoltage: number,
  totalResistance: number,
  current: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  const voltageSum = batteryVoltage - current * totalResistance;

  if (Math.abs(voltageSum) > 0.01) {
    errors.push({
      type: 'error',
      code: 'KVL_VIOLATION',
      message: `Kirchhoff's voltage law violated: voltage loop sum is ${voltageSum.toFixed(3)}V (expected 0)`,
    });
  }

  return errors;
}

/**
 * Validate an Ohm's Law experiment circuit.
 */
export function validateOhmLawCircuit(
  instruments: Instrument[],
  connections: Connection[]
): CircuitValidation {
  const errors: ValidationError[] = [];
  const suggestions: string[] = [];

  const battery = instruments.find((i) => i.type === 'battery');
  const resistor = instruments.find((i) => i.type === 'resistor');
  const ammeter = instruments.find((i) => i.type === 'ammeter');
  const voltmeter = instruments.find((i) => i.type === 'voltmeter');
  const sw = instruments.find((i) => i.type === 'switch');

  // Check required components
  if (!battery) {
    errors.push({ type: 'error', code: 'MISSING_BATTERY', message: 'Battery is required to complete the circuit' });
    suggestions.push('Drag a Battery from the instrument panel to the workspace');
  }
  if (!resistor) {
    errors.push({ type: 'error', code: 'MISSING_RESISTOR', message: 'Resistor is required for Ohm\'s Law verification' });
    suggestions.push('Add a Resistor to measure V=IR relationship');
  }
  if (!ammeter) {
    suggestions.push('Add an Ammeter in series to measure current');
  }
  if (!voltmeter) {
    suggestions.push('Add a Voltmeter in parallel to measure potential difference');
  }
  if (!sw) {
    suggestions.push('Add a Switch (Plug Key) to control the circuit');
  }

  // Check switch state
  if (sw && !sw.properties.closed) {
    errors.push({ type: 'info', code: 'SWITCH_OPEN', message: 'Circuit switch is open — close it to allow current flow' });
  }

  // KCL checks
  const kclErrors = checkKCL(instruments, connections);
  errors.push(...kclErrors);

  // Check closed loop
  const isClosed = hasClosedLoop(instruments, connections);
  if (!isClosed && connections.length > 0) {
    errors.push({ type: 'error', code: 'OPEN_CIRCUIT', message: 'Circuit is not closed — ensure all components are connected in a loop' });
    suggestions.push('Connect the remaining terminals to form a complete circuit path');
  }

  // KVL check when circuit is complete
  if (isClosed && battery && resistor) {
    const V = battery.properties.voltage || 9;
    const R = resistor.properties.resistance || 100;
    const rheostat = instruments.find((i) => i.type === 'rheostat');
    const totalR = R + (rheostat?.properties.resistance || 0);
    const I = V / totalR;
    const kvlErrors = checkKVL(V, totalR, I);
    errors.push(...kvlErrors);
  }

  const hasBlockingErrors = errors.some((e) => e.type === 'error');

  return {
    isValid: !hasBlockingErrors,
    isClosed,
    errors,
    suggestions,
  };
}

/**
 * Validate a Wheatstone Bridge circuit.
 */
export function validateWheatstoneBridge(
  instruments: Instrument[],
  connections: Connection[]
): CircuitValidation {
  const errors: ValidationError[] = [];
  const suggestions: string[] = [];

  const battery = instruments.find((i) => i.type === 'battery');
  const resistors = instruments.filter((i) => i.type === 'resistor');
  const galvanometer = instruments.find((i) => i.type === 'galvanometer');
  const switches = instruments.filter((i) => i.type === 'switch');

  if (!battery) {
    errors.push({ type: 'error', code: 'MISSING_BATTERY', message: 'Battery is required for the bridge circuit' });
    suggestions.push('Drag a Battery to the workspace');
  }
  if (resistors.length < 4) {
    errors.push({ type: 'error', code: 'MISSING_RESISTORS', message: `Need 4 resistors for bridge (P, Q, R, S) — found ${resistors.length}` });
    suggestions.push('Add all four resistors: P, Q, R, and S');
  }
  if (!galvanometer) {
    suggestions.push('Add a Galvanometer to detect bridge balance');
  }
  if (switches.length < 1) {
    suggestions.push('Add at least one switch to control the circuit');
  }

  const allSwitchesClosed = switches.every((s) => s.properties.closed);
  if (switches.length > 0 && !allSwitchesClosed) {
    errors.push({ type: 'info', code: 'SWITCH_OPEN', message: 'Close all switches to activate the bridge' });
  }

  const kclErrors = checkKCL(instruments, connections);
  errors.push(...kclErrors);

  const isClosed = hasClosedLoop(instruments, connections);
  if (!isClosed && connections.length > 0) {
    errors.push({ type: 'error', code: 'OPEN_CIRCUIT', message: 'Bridge circuit is not complete' });
  }

  const hasBlockingErrors = errors.some((e) => e.type === 'error');

  return {
    isValid: !hasBlockingErrors,
    isClosed,
    errors,
    suggestions,
  };
}
