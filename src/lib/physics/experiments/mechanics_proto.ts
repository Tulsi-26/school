import { Vector2D, calculatePulleyMotion } from '../core/mechanics';

export interface MechanicsExperimentState {
    acceleration: number;
    tension: number;
    positions: {
        block1: Vector2D;
        block2: Vector2D;
    };
}

/**
 * Simulates a simple pulley system with two masses
 */
export const calculateMechanicsSimulation = (
    m1: number,
    m2: number,
    time: number // for animation
): MechanicsExperimentState => {
    const { acceleration, tension } = calculatePulleyMotion(m1, m2);

    // Calculate displacement: s = ut + 0.5at^2 (u=0)
    const displacement = 0.5 * acceleration * time * time;
    const clampedDisplacement = Math.max(-100, Math.min(100, displacement));

    // Simple vertical motion for blocks
    return {
        acceleration,
        tension,
        positions: {
            block1: { x: -20, y: 50 + (m1 > m2 ? clampedDisplacement : -clampedDisplacement) },
            block2: { x: 20, y: 50 + (m2 > m1 ? clampedDisplacement : -clampedDisplacement) }
        }
    };
};
