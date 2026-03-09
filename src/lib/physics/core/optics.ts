/**
 * Core Geometric Optics Engine
 * Handles ray tracing, image formation, and focal calculations
 */

export interface Point {
    x: number;
    y: number;
}

export interface Ray {
    origin: Point;
    angle: number; // in radians
}

export interface LensProperties {
    focalLength: number;
    position: Point;
    type: 'convex' | 'concave';
}

/**
 * Calculates the image position using the lens formula: 1/f = 1/v - 1/u
 * u = object distance (usually negative)
 * v = image distance
 * f = focal length
 */
export const calculateImagePosition = (u: number, f: number): number | null => {
    if (u === -f) return null; // Image at infinity
    return (f * u) / (f + u);
};

/**
 * Traces a ray through a single lens
 */
export const traceRayThroughLens = (ray: Ray, lens: LensProperties): Ray | null => {
    // 1. Calculate intersection with lens plane (assuming vertical lens)
    if (Math.abs(Math.cos(ray.angle)) < 0.001) return null; // Ray parallel to lens

    const dx = lens.position.x - ray.origin.x;

    // Only trace forward
    if (dx * Math.cos(ray.angle) < 0) return null;

    const dy = dx * Math.tan(ray.angle);
    const intersection: Point = {
        x: lens.position.x,
        y: ray.origin.y + dy
    };

    // 2. Apply lens redirection using thin lens approximation
    // The change in slope (tan(angle)) is -y/f
    const initialSlope = Math.tan(ray.angle);
    const yFromCenter = intersection.y - lens.position.y;
    const finalSlope = initialSlope - (yFromCenter / lens.focalLength);

    return {
        origin: intersection,
        angle: Math.atan(finalSlope)
    };
};

/**
 * Traces a ray through multiple optical components
 */
export const traceRayThroughComponents = (ray: Ray, components: LensProperties[]): Ray[] => {
    const sortedComponents = [...components].sort((a, b) => a.position.x - b.position.x);
    const path: Ray[] = [ray];
    let currentRay = ray;

    for (const comp of sortedComponents) {
        if (comp.position.x > currentRay.origin.x) {
            const nextRay = traceRayThroughLens(currentRay, comp);
            if (nextRay) {
                path.push(nextRay);
                currentRay = nextRay;
            }
        }
    }

    return path;
};
