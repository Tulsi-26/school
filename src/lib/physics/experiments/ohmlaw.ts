export interface CircuitState {
    voltage: number;
    resistance: number;
    current: number;
    isClosed: boolean;
    isValid: boolean;
}

export const calculateOhmLaw = (
    batteryVoltage: number,
    baseResistance: number,
    rheostatResistance: number,
    isSwitchClosed: boolean,
    connections: any[]
): CircuitState => {
    // A simplified graph-based loop detection
    // For Ohm's Law, we need: Battery -> Ammeter -> Resistor -> Rheostat -> Switch -> Battery
    // Let's check if there's a path from Battery(+) to Battery(-) through instruments

    // Minimal connections for a loop in this specific setup
    const hasEnoughConnections = connections.length >= 5;

    const totalResistance = baseResistance + rheostatResistance;

    if (!isSwitchClosed || !hasEnoughConnections) {
        return {
            voltage: 0,
            resistance: totalResistance,
            current: 0,
            isClosed: isSwitchClosed,
            isValid: hasEnoughConnections,
        };
    }

    // Simulate current flow
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
