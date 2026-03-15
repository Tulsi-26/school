export interface WheatstoneBridgeState {
    isBalanced: boolean;
    galvanometerReading: number;
    isValid: boolean;
    isClosed: boolean;
    p?: number;
    q?: number;
    r?: number;
    s?: number;
}

export const calculateWheatstoneBridge = (
    p: number,
    q: number,
    r: number,
    s: number,
    voltage: number,
    isSwitchClosed: boolean,
    isValidTopology: boolean
): WheatstoneBridgeState => {
    if (!isSwitchClosed || !isValidTopology) {
        return { isBalanced: false, galvanometerReading: 0, isValid: isValidTopology, isClosed: isSwitchClosed, p, q, r, s };
    }

    // Ig = V * (PS - RQ) / [G(P+Q)(R+S) + RS(P+Q) + PQ(R+S)]
    // Simple check for balance: P/Q = R/S
    const balanceError = (p * s) - (r * q);
    const isBalanced = Math.abs(balanceError) < 0.01;
    const galvanometerReading = isBalanced ? 0 : (balanceError / 100); // Simplified scale

    return {
        isBalanced,
        galvanometerReading,
        isValid: isValidTopology,
        isClosed: true,
        p,
        q,
        r,
        s,
    };
};
