/**
 * Core Mechanics Engine
 * Handles vector calculations, force diagrams, and rigid body motion
 */

export interface Vector2D {
    x: number;
    y: number;
}

export interface Force {
    magnitude: number;
    angle: number; // in radians
    pointOfApplication: Vector2D;
}

/**
 * Calculates the resultant of multiple forces
 */
export const calculateResultantForce = (forces: Force[]): Vector2D => {
    return forces.reduce(
        (acc, f) => ({
            x: acc.x + f.magnitude * Math.cos(f.angle),
            y: acc.y + f.magnitude * Math.sin(f.angle)
        }),
        { x: 0, y: 0 }
    );
};

/**
 * Calculates acceleration based on Newton's Second Law: F = ma
 */
export const calculateAcceleration = (force: Vector2D, mass: number): Vector2D => {
    if (mass <= 0) return { x: 0, y: 0 };
    return {
        x: force.x / mass,
        y: force.y / mass
    };
};

/**
 * Simplified Pulley System Logic
 * T = (2 * m1 * m2 * g) / (m1 + m2)
 * a = (m1 - m2)g / (m1 + m2)
 */
export const calculatePulleyMotion = (m1: number, m2: number, g = 9.81) => {
    const totalMass = m1 + m2;
    if (totalMass === 0) return { acceleration: 0, tension: 0 };

    const acceleration = (Math.abs(m1 - m2) * g) / totalMass;
    const tension = (2 * m1 * m2 * g) / totalMass;

    return { acceleration, tension };
};
