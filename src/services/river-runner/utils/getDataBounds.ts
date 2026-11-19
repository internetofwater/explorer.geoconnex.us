import { Position } from 'geojson';
import { LngLatBoundsLike } from 'mapbox-gl';

// Note: this once allowed geometry and coordinates, removed geometry option
// Use type assertion/exploration to reimplement this if needed
export const getDataBounds = (coordinatePath: Position[]): LngLatBoundsLike => {
    const bounds: LngLatBoundsLike = coordinatePath.reduce(
        ([min, max], [x, y]) => [
            [Math.min(min[0], x), Math.min(min[1], y)],
            [Math.max(max[0], x), Math.max(max[1], y)],
        ],
        [
            [Infinity, Infinity],
            [-Infinity, -Infinity],
        ]
    );

    return bounds;
};
