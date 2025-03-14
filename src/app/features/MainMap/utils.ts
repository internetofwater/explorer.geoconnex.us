import {
    GeoJSONFeature,
    GeoJSONSource,
    LngLat,
    LngLatBoundsLike,
    Map,
    Popup,
} from 'mapbox-gl';
import { CLUSTER_TRANSITION_ZOOM, SourceId, SubLayerId } from './config';
import { Feature, LineString, Point } from 'geojson';
import * as turf from '@turf/turf';

export const calculateSpiderfiedPositionsConcentricCircle = (
    count: number
): [number, number][] => {
    const leavesSeparation = 75; // Separation between points in each circle
    const baseOffset = [0, 0]; // Base offset
    const points: [number, number][] = []; // Array to store positions

    let circleIndex = 0;
    let pointsInCurrentCircle = 10; // Points in the current circle
    let pointsPlaced = 0; // Total points placed so far

    while (pointsPlaced < count) {
        const radius = leavesSeparation * (circleIndex + 1); // Radius for the current circle
        const theta = (2 * Math.PI) / pointsInCurrentCircle; // Angle between each point in the circle

        for (
            let i = 0;
            i < pointsInCurrentCircle && pointsPlaced < count;
            i += 1
        ) {
            const angle = theta * i; // Current angle for the point

            const x = radius * Math.cos(angle) + baseOffset[0]; // X-coordinate of the point
            const y = radius * Math.sin(angle) + baseOffset[1]; // Y-coordinate of the point
            points.push([x, y]); // Add the point to the array

            pointsPlaced += 1; // Increment the total points placed
        }

        circleIndex += 1; // Move to the next circle
        pointsInCurrentCircle += 10; // Increase the number of points in the next circle
    }

    return points;
};
export const calculateSpiderfiedPositionsCircle = (
    count: number
): [number, number][] => {
    const leavesSeparation = 75; // Separation between points
    const leavesOffset = [0, 0]; // Base offset
    const points: [number, number][] = []; // Array to store positions
    const theta = (2 * Math.PI) / count; // Angle between each point
    let angle = theta;

    for (let i = 0; i < count; i += 1) {
        angle = theta * i; // Current angle for the point
        const x = leavesSeparation * Math.cos(angle) + leavesOffset[0]; // X-coordinate of the point
        const y = leavesSeparation * Math.sin(angle) + leavesOffset[1]; // Y-coordinate of the point
        points.push([x, y]); // Add the point to the array
    }
    return points;
};

export const calculateSpiderfiedPositions = (
    count: number
): [number, number][] => {
    const legLengthStart = 100; // Initial leg length of the spiral
    const legLengthFactor = 100; // Factor for increasing the leg length
    const leavesSeparation = 200; // Separation between points
    const leavesOffset = [0, 0]; // Base offset
    const points: [number, number][] = []; // Array to store positions
    let legLength = legLengthStart; // Current leg length
    let angle = 0; // Initial angle

    for (let i = 0; i < count; i += 1) {
        angle += leavesSeparation / legLength + i * 0.0005; // Increment the angle
        const x = legLength * Math.cos(angle) + leavesOffset[0]; // X-coordinate of the point
        const y = legLength * Math.sin(angle) + leavesOffset[1]; // Y-coordinate of the point
        points.push([x, y]); // Add the point to the array

        legLength += (Math.PI * 2 * legLengthFactor) / angle; // Increase the leg length
    }

    return points;
};

export const spiderfyClusters = async (
    map: Map,
    source: GeoJSONSource,
    features: GeoJSONFeature[]
): Promise<void> => {
    const totalLeaves: GeoJSON.GeoJSON = {
        type: 'FeatureCollection',
        features: [],
    };

    const promises = features.map((feature) => {
        return new Promise<Feature<Point>[] | null>((resolve, reject) => {
            if (!feature.properties) {
                return resolve(null);
            }
            const clusterId = feature.properties.cluster_id as number;
            const coordinates = (feature.geometry as Point).coordinates as [
                number,
                number
            ];
            const lngLat = {
                lng: coordinates[0],
                lat: coordinates[1],
            } as LngLat;

            source.getClusterLeaves(
                clusterId,
                Infinity,
                0,
                (error, features) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!features) return resolve(null);
                    if (features.length > 0) {
                        const _features = features.slice(0, 60);

                        const spiderfiedPositions =
                            _features.length <= 10
                                ? calculateSpiderfiedPositionsCircle(
                                      _features.length
                                  )
                                : calculateSpiderfiedPositionsConcentricCircle(
                                      _features.length
                                  );

                        const updatedFeatures = _features.map(
                            (feature, index) =>
                                ({
                                    ...feature,
                                    properties: {
                                        ...feature.properties,
                                        iconOffset: spiderfiedPositions[index],
                                        isNotFiltered: 1,
                                    },
                                    geometry: {
                                        ...feature.geometry,
                                        type: 'Point',
                                        coordinates: [lngLat.lng, lngLat.lat],
                                    },
                                } as Feature<Point>)
                        );

                        return resolve(updatedFeatures);
                    }
                    resolve(null);
                }
            );
        });
    });

    try {
        const results = await Promise.all(promises);
        results.forEach((result) => {
            if (result) {
                totalLeaves.features = totalLeaves.features.concat(result);
            }
        });
        const spiderfySource = map.getSource(
            SourceId.Spiderify
        ) as GeoJSONSource;
        spiderfySource.setData(totalLeaves);

        map.setPaintProperty(
            SubLayerId.AssociatedDataClusters,
            'circle-opacity',
            ['step', ['zoom'], 1, CLUSTER_TRANSITION_ZOOM, 0]
        );
        map.setPaintProperty(
            SubLayerId.AssociatedDataClusterCount,
            'text-opacity',
            ['step', ['zoom'], 1, CLUSTER_TRANSITION_ZOOM, 0]
        );
    } catch (error) {
        console.error('Error processing cluster leaves:', error);
    }
};

export const deletePointsSpiderfy = (map: Map) => {
    if (!map) return;
    const spiderfySource = map.getSource(SourceId.Spiderify) as GeoJSONSource;
    if (!spiderfySource) return;
    spiderfySource.setData({
        type: 'FeatureCollection',
        features: [],
    });
    map.setPaintProperty(
        SubLayerId.AssociatedDataClusters,
        'circle-opacity',
        1
    );
    map.setPaintProperty(
        SubLayerId.AssociatedDataClusterCount,
        'text-opacity',
        1
    );
};

// No longer in user
export const zoomToMainStem = (map: Map, id: number | null) => {
    if (!id) {
        return;
    }

    const features = map.queryRenderedFeatures({
        layers: [
            SubLayerId.MainstemsSmall,
            SubLayerId.MainstemsMedium,
            SubLayerId.MainstemsLarge,
        ],
        filter: ['==', 'id', String(id)],
    }) as Feature<LineString>[];

    if (features.length) {
        // Combine composite features
        const featureCollection = turf.featureCollection<LineString>([
            ...features,
        ]);
        const combined = turf.combine(featureCollection);
        const bbox = turf.bbox(combined) as LngLatBoundsLike;
        map.fitBounds(bbox);
    }
};

export const hasPeristentPopupOpenToThisItem = (
    popUp: Popup,
    itemId: string
) => {
    return popUp.isOpen() && popUp._content?.innerHTML.includes(itemId);
};
