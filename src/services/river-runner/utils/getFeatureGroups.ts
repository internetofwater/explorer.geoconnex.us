import {
    TNLDIVAAFeatureCollection,
    TRiverProperties,
} from '@/services/river-runner/types';

export const getFeatureGroups = (
    flowlinesData: TNLDIVAAFeatureCollection
): TRiverProperties[] => {
    const featurePoints = flowlinesData.features.filter(
        (feature) => feature.properties.feature_id
    );
    const featureNames = featurePoints.map(
        (feature) => feature.properties.feature_id
    );
    let uniqueFeatureNames = featureNames.filter(
        (item, i, ar) => ar.indexOf(item) === i
    );
    const fullDistance = flowlinesData.features[0].properties.pathlength;

    const featureLookup = new Map(
        flowlinesData.features
            .filter((f) => f.properties.feature_id)
            .map((f, index) => [f.properties.feature_id, { feature: f, index }])
    );

    // SL: This fixes a rare, but frustrating bug, where because I don't sample each flowline for VAA data, and because...
    // I assume once a feature starts that it continues until the next unique feature, this function gets confused by...
    // Long rivers sandwiching small unnames features, like the snake river in Idaho, and thinks that the small feature interruption
    // Is the new main feature until it hits the next unique feature name. This is sort of difficult to explain, but just trust that it's necessary.
    uniqueFeatureNames = uniqueFeatureNames.filter((name, i) => {
        if (i === 0) {
            return true;
        } else {
            const entry = featureLookup.get(name);

            if (!entry) {
                return false;
            }

            const { feature, index } = entry;

            const sandwichOccurence = featurePoints
                .slice(index)
                .findIndex(
                    (point) =>
                        point.properties.feature_id ===
                        uniqueFeatureNames[i - 1]
                );
            const surroundingFeatureData = featurePoints
                .slice(index)
                .find(
                    (point) =>
                        point.properties.feature_id ===
                        uniqueFeatureNames[i - 1]
                );

            if (
                sandwichOccurence > 0 &&
                surroundingFeatureData &&
                feature &&
                surroundingFeatureData.properties.streamlvl ===
                    feature.properties.streamlvl
            ) {
                return false;
            } else {
                return true;
            }
        }
    });

    let riverProperties: TRiverProperties[] = uniqueFeatureNames.map((f, i) => {
        const entry = featureLookup.get(f);

        if (!entry) {
            return {
                feature_data_index: -1,
                progress: null,
                name: null,
                distance_from_destination: null,
                index: i,
                stream_level: null,
                active: false,
            };
        }

        const { feature, index } = entry;

        if (
            !feature ||
            !fullDistance ||
            feature.properties.pathlength === null ||
            feature.properties.streamlvl === null
        ) {
            return {
                feature_data_index: index,
                progress: null,
                name: null,
                distance_from_destination: null,
                index: i,
                stream_level: null,
                active: false,
            };
        }

        return {
            feature_data_index: index,
            index: i,
            progress:
                fullDistance === -999
                    ? index / flowlinesData.features.length
                    : (fullDistance - feature.properties.pathlength) /
                      fullDistance,
            name: feature.properties.feature_name,
            distance_from_destination:
                feature.properties.pathlength === -9999
                    ? 0
                    : feature.properties.pathlength,
            stream_level: feature.properties.streamlvl,
            active: false,
        };
    });

    // SL: Because I'm not sampling every flowline, sometimes I get weird results at the end of the flowpath where, for example, there's a flowline
    // that's part of the Mississippi Delta, but isn't technically isn't grouped under the Mississippi river, and it considers it the last step
    // Here, I'm going to treat anyting with streamlevel 1 (which means it's a terminal feature) as the last feature in the sequence, but add an
    // exception case for paths that stop at inland lakes, just in case their last feature isn't encoded as stream level 1
    let trueStopFeatureIndex = riverProperties.findIndex(
        (feature) => feature.stream_level === 1
    );
    if (trueStopFeatureIndex === -1) {
        trueStopFeatureIndex = riverProperties.length - 1;
    }
    riverProperties = riverProperties.slice(0, trueStopFeatureIndex + 1);

    riverProperties = riverProperties.map((p, i) => {
        const next = riverProperties[i + 1];

        const coordinates = flowlinesData.features
            .slice(p.feature_data_index, next?.feature_data_index)
            .flatMap((feature) => feature.geometry.coordinates);

        if (!next) {
            return {
                ...p,
                length_km: Math.round(p.distance_from_destination ?? 0),
                stop_point: null,
                feature_data: [
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates,
                        },
                    },
                ],
            };
        }

        return {
            ...p,
            length_km: Math.round(
                (p.distance_from_destination ?? 0) -
                    (next.distance_from_destination ?? 0)
            ),
            stop_point: next.progress,
            feature_data: [
                {
                    geometry: {
                        type: 'LineString',
                        coordinates,
                    },
                },
            ],
        };
    });

    return riverProperties;
};
