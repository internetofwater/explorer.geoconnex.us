import { GeoJSONFeature, GeoJSONSource, Map, Popup } from 'mapbox-gl';
import { SourceId } from '@/app/features/MainMap/config';
import { Feature, FeatureCollection, Point } from 'geojson';
import * as turf from '@turf/turf';
import { Dataset } from '@/app/types';

/**
 * Checks if the persistent popup is open to a specific item.
 *
 * @param {Popup} popUp - The Mapbox popup instance.
 * @param {string} itemId - The ID of the item to check.
 * @returns {boolean} True if the popup is open to the specified item, false otherwise.
 */
export const hasPeristentPopupOpenToThisItem = (
    popUp: Popup,
    itemId: string
) => {
    return popUp.isOpen() && popUp._content?.innerHTML.includes(itemId);
};

/**
 * Aggregates colocated datasets and creates a single point representing a summary of the data.
 *
 * @param {FeatureCollection<Point, Dataset>} datasets - The feature collection of datasets.
 * @returns {FeatureCollection<Point, { totalDatasets: number; siteNames: string }>} The summarized feature collection.
 */
export const summarizePoints = (
    datasets: FeatureCollection<Point, Dataset>
): FeatureCollection<Point, { totalDatasets: number; siteNames: string }> => {
    const groupedPoints = datasets.features.reduce(
        (acc: Record<string, Feature<Point, Dataset>[]>, feature) => {
            const coordinates = feature.geometry.coordinates;
            // Reduce precision to aggregate points that are roughly colocated
            const key = `${coordinates[0].toFixed(4)},${coordinates[1].toFixed(
                4
            )}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(feature);
            return acc;
        },
        {} as Record<string, Feature<Point, Dataset>[]>
    );

    const summarizedPoints = Object.keys(groupedPoints).map((key) => {
        const datasetPoints = groupedPoints[key];
        const siteNamesSet = new Set<string>();

        datasetPoints.forEach((feature) => {
            const { siteName } = feature.properties;
            siteNamesSet.add(siteName);
        });

        let siteNames = '';
        if (siteNamesSet.size > 3) {
            siteNames =
                Array.from(siteNamesSet).slice(0, 3).join(', ') +
                ` + ${siteNamesSet.size - 3} more`;
        } else {
            siteNames = Array.from(siteNamesSet).join(', ');
        }

        return turf.point(datasetPoints[0].geometry.coordinates, {
            totalDatasets: datasetPoints.length,
            siteNames,
        });
    });

    return turf.featureCollection(summarizedPoints);
};

/**
 * Gets all datasets from currently rendered clusters and creates summary points.
 *
 * @param {Map} map - The Mapbox map instance.
 * @param {GeoJSONSource} source - The GeoJSON source instance.
 * @param {GeoJSONFeature[]} features - Array of GeoJSON features.
 * @returns {Promise<void>} A promise that resolves when the summary points are created.
 */
export const createSummaryPoints = async (
    map: Map,
    source: GeoJSONSource,
    features: GeoJSONFeature[]
): Promise<void> => {
    const datasets: FeatureCollection<Point, Dataset> = {
        type: 'FeatureCollection',
        features: [],
    };

    const promises = features.map((feature) => {
        return new Promise<Feature<Point, Dataset>[] | null>(
            (resolve, reject) => {
                if (!feature.properties) {
                    return resolve(null);
                }
                const clusterId = feature.properties.cluster_id as number;

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
                            return resolve(
                                features as Feature<Point, Dataset>[]
                            );
                        }
                        resolve(null);
                    }
                );
            }
        );
    });

    try {
        const results = await Promise.all(promises);
        results.forEach((result) => {
            if (result) {
                datasets.features = datasets.features.concat(result);
            }
        });
        const summarizedPoints = summarizePoints(datasets);
        const summarySource = map.getSource(
            SourceId.SummaryPoints
        ) as GeoJSONSource;
        summarySource.setData(summarizedPoints);
    } catch (error) {
        console.error('Error processing cluster leaves:', error);
    }
};

/**
 * Deletes summary points from the map.
 *
 * @param {Map} map - The Mapbox map instance.
 */
export const deleteSummaryPoints = (map: Map) => {
    if (!map) return;
    const summarySource = map.getSource(
        SourceId.SummaryPoints
    ) as GeoJSONSource;
    if (!summarySource) return;
    summarySource.setData({
        type: 'FeatureCollection',
        features: [],
    });
};
