import { Position } from 'geojson';
import { TStoppingFeature } from '@/services/river-runner/types';
import { distanceToPolygon } from '@/services/river-runner/utils/distanceToPolygon';

export const determineStoppingFeature = ({
    destinationPoint,
    stoppingFeatures,
}: {
    destinationPoint: Position;
    stoppingFeatures: TStoppingFeature[];
}): string | undefined => {
    let minDistance = 10000000;
    let closestFeature: TStoppingFeature | null = null;
    let oceanDistance = null;

    // SL: Find the distance from each polygon in the stop feature dataset
    for (const feature of stoppingFeatures) {
        const featureDistance = distanceToPolygon({
            point: destinationPoint,
            targetPolygon: feature,
        });

        if (featureDistance < minDistance) {
            minDistance = featureDistance;
            closestFeature = feature;
        }

        if (feature.properties.stop_feature_type === 'ocean') {
            oceanDistance = featureDistance;
        }
    }

    // SL: If the closest feature in the stop feature set is more than 10 km away, this is landing on an unidentified inland water feature
    if (
        minDistance > 10000 &&
        closestFeature &&
        closestFeature.properties.stop_feature_type !== 'ocean'
    ) {
        return 'Inland Water Feature';
    }
    // SL: Sometimes there's a large inlet/bay that creates artificial distance between the destination point and my imperfect ocean shapefile polygon
    // It may then think that another feature, like a lake is the "stop feature", (this happens in the Alabama gulf, for example).
    // We're going to say that if the ocean is within 50km of the stop point, it's very likely the true end point
    else if (
        (closestFeature &&
            closestFeature.properties.stop_feature_type === 'ocean') ||
        (oceanDistance && oceanDistance < 50000)
    ) {
        if (
            closestFeature &&
            closestFeature.properties.stop_feature_name === 'San Francisco Bay'
        ) {
            return 'San Francisco Bay';
        } else if (
            closestFeature &&
            closestFeature.properties.stop_feature_name === 'Delaware Bay'
        ) {
            return 'Delaware Bay';
        }

        // SL: Gulf of Mexico: lng < -82 && lat < 31
        // Chesapeake Bay: -75.6 > lng > -77.68 && 39.61 > lat > 37.79
        // Delaware Bay: -74.87 > lng > -75.54 && 39.53 > lat > 38.77
        // Otherwise split by Texas, basically, between Atlantic/Pacific
        return destinationPoint[0] < -82 && destinationPoint[1] < 31
            ? 'Gulf of Mexico'
            : destinationPoint[0] < -75.6330075 &&
                destinationPoint[0] > -77.684621 &&
                destinationPoint[1] > 37.793247 &&
                destinationPoint[1] < 39.61332
              ? 'Chesapeake Bay'
              : destinationPoint[0] < -74.872 &&
                  destinationPoint[0] > -75.542 &&
                  destinationPoint[1] > 38.771 &&
                  destinationPoint[1] < 39.525
                ? 'Delaware Bay'
                : destinationPoint[0] > -100
                  ? 'Atlantic Ocean'
                  : 'Pacific Ocean';
    } else if (closestFeature) {
        return closestFeature.properties.stop_feature_name;
    }
};
