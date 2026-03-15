export interface WheatstoneBridgeState {
    isBalanced: boolean;
    galvanometerReading: number;
    isValid: boolean;
    isClosed: boolean;
}

export const calculateWheatstoneBridge = (
    p: number,
    q: number,
    r: number,
    s: number,
    voltage: number,
    isSwitchClosed: boolean,
    connections: any[]
): WheatstoneBridgeState => {
    const isValid = connections.length >= 8; // Bridge needs more connections

    if (!isSwitchClosed || !isValid) {
        return { isBalanced: false, galvanometerReading: 0, isValid, isClosed: isSwitchClosed };
    }

    // Ig = V * (PS - RQ) / [G(P+Q)(R+S) + RS(P+Q) + PQ(R+S)]
    // Simple check for balance: P/Q = R/S
    const balanceError = (p * s) - (r * q);
    const isBalanced = Math.abs(balanceError) < 0.01;
    const galvanometerReading = balanceError / 100; // Simplified scale

    return {
        isBalanced,
        galvanometerReading,
        isValid,
        isClosed: true,
    };
};
