import { Ray, LensProperties, traceRayThroughLens } from '../core/optics';

export interface OpticsExperimentState {
    rays: Ray[];
    lenses: LensProperties[];
    results: {
        imagePosition: number | null;
        magnification: number;
    };
}

/**
 * Simulates a simple lens setup
 */
export const calculateOpticsSimulation = (
    objectPosition: number, // cm from center
    lensFocalLength: number,
    lensType: 'convex' | 'concave'
): OpticsExperimentState => {
    const u = -objectPosition; // object distance
    const f = lensType === 'convex' ? lensFocalLength : -lensFocalLength;

    // Lens formula: 1/v - 1/u = 1/f => 1/v = 1/f + 1/u
    const v = (f * u) / (f + u);
    const magnification = v / u;

    // Create a few rays for visualization
    const rays: Ray[] = [
        // Ray through center
        { origin: { x: objectPosition - 100, y: 0 }, angle: Math.atan2(0, 100) },
        // Ray parallel to axis
        { origin: { x: objectPosition - 100, y: 10 }, angle: 0 }
    ];

    return {
        rays,
        lenses: [{ position: { x: 0, y: 0 }, focalLength: f, type: lensType }],
        results: {
            imagePosition: v,
            magnification
        }
    };
};
