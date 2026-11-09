import { bearing, destination, point } from '@turf/turf';
import { Position } from 'geojson';

export const bearingBetween = (
    coordinate1: Position,
    coordinate2: Position
) => {
    const point1 = point(coordinate1);
    const point2 = point(coordinate2);

    return bearing(point1, point2);
};

export const findArtificialCameraPoint = ({
    distanceGap,
    originPoint,
    targetPoint,
}: {
    distanceGap: number;
    originPoint: Position;
    targetPoint: Position;
}): Position => {
    const bearing = bearingBetween(targetPoint, originPoint);
    return destination(targetPoint, distanceGap, bearing).geometry.coordinates;
};
