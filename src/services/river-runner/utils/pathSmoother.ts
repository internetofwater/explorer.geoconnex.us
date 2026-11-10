import { Position } from 'geojson';

export const pathSmoother = (
    coordinatePath: Position[],
    smoothingCoefficient: number = 1,
    preserveStart: number = 2,
    preserveEnd: number = 1
) => {
    const smoothedCoordinatePath = coordinatePath.map((coordinate, index) => {
        const coordinateGroup = coordinatePath.slice(
            Math.max(0, index - smoothingCoefficient),
            index + 1 + smoothingCoefficient
        );
        const lng =
            coordinateGroup.map((d) => d[0]).reduce((a, b) => a + b, 0) /
            coordinateGroup.length;
        const lat =
            coordinateGroup.map((d) => d[1]).reduce((a, b) => a + b, 0) /
            coordinateGroup.length;

        return [lng, lat];
    });

    if (coordinatePath.length <= 3) {
        return coordinatePath;
    }

    return [
        ...coordinatePath.slice(0, preserveStart),
        ...smoothedCoordinatePath.slice(preserveStart, -preserveEnd),
        ...coordinatePath.slice(-preserveEnd),
    ];
};
