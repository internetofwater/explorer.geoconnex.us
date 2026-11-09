import {
    booleanPointInPolygon,
    Coord,
    pointToLineDistance,
    polygonToLine,
} from '@turf/turf';
import {
    Feature,
    LineString,
    MultiLineString,
    MultiPolygon,
    Polygon,
    Position,
} from 'geojson';

type PolygonLike = Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon;

const removeRedundantCoords = <
    T extends Position[] | Position[][] = Position[],
>(
    coords: T
): T => {
    const cleaned = coords.filter(
        (coord, i) =>
            i === 0 ||
            coord[0] !== coords[i - 1][0] ||
            coord[1] !== coords[i - 1][1]
    );
    return cleaned as T;
};

const getGeometry = (polygon: PolygonLike): Polygon | MultiPolygon =>
    polygon.type === 'Feature' ? polygon.geometry : polygon;

// SL: Returns distance in meters (negative values for points inside) from a point to the edges of a polygon
// This function comes from here: https://github.com/Turfjs/turf/issues/1743
export const distanceToPolygon = ({
    point,
    targetPolygon,
}: {
    point: Coord;
    targetPolygon: PolygonLike;
}): number => {
    const safePolygon = structuredClone(targetPolygon);

    const polygon = getGeometry(safePolygon);

    let distance: number;

    if (polygon.type === 'MultiPolygon') {
        distance = polygon.coordinates
            .map((coords) =>
                distanceToPolygon({
                    point,
                    targetPolygon: {
                        type: 'Polygon',
                        coordinates: coords,
                    },
                })
            )
            .reduce((smallest, current) =>
                current < smallest ? current : smallest
            );
    } else {
        if (polygon.coordinates.length > 1) {
            const [exteriorDistance, ...interiorDistances] =
                polygon.coordinates.map((coords) =>
                    distanceToPolygon({
                        point,
                        targetPolygon: {
                            type: 'Polygon',
                            coordinates: [coords],
                        },
                    })
                );

            if (exteriorDistance < 0) {
                const smallestInteriorDistance =
                    interiorDistances.length > 0
                        ? Math.min(...interiorDistances)
                        : Infinity;

                if (smallestInteriorDistance < 0) {
                    distance = smallestInteriorDistance * -1;
                } else {
                    distance =
                        smallestInteriorDistance < exteriorDistance * -1
                            ? smallestInteriorDistance * -1
                            : exteriorDistance;
                }
            } else {
                distance = exteriorDistance;
            }
        } else {
            const lineFeature = polygonToLine(polygon) as
                Feature<LineString> | Feature<MultiLineString>;

            if (lineFeature.geometry.type === 'LineString') {
                lineFeature.geometry.coordinates = removeRedundantCoords(
                    lineFeature.geometry.coordinates
                );
            }

            // Note: this type conversion may cause unexpected behaviors
            // TODO:
            distance =
                pointToLineDistance(point, lineFeature as Feature<LineString>) *
                1000;

            if (booleanPointInPolygon(point, polygon)) {
                distance *= -1;
            }
        }
    }

    return distance;
};
