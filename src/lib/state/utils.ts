import {
    MAINSTEM_DRAINAGE_MEDIUM,
    MAINSTEM_DRAINAGE_SMALL,
} from '@/app/features/MainMap/config';
import { Dataset, MainstemData } from '@/app/types';
import {
    Feature,
    FeatureCollection,
    GeoJsonProperties,
    Geometry,
    Point,
} from 'geojson';
import { Summary, SummaryData } from '@/lib/state/main/slice';
import { defaultGeoJson } from '@/lib/state/consts';
import { Map } from 'mapbox-gl';
import * as turf from '@turf/turf';

export const transformDatasets = (
    feature: Feature<Geometry, GeoJsonProperties & { datasets?: Dataset[] }>
): FeatureCollection<Point, Dataset> => {
    if (
        feature.properties &&
        feature.properties?.datasets &&
        (feature.properties?.datasets ?? []).length > 0
    ) {
        const features = feature.properties.datasets
            .map((dataset: Dataset, index) => {
                const { lat, lng } = extractLatLng(dataset.wkt);
                if (!isNaN(lat) && !isNaN(lng)) {
                    const geometry = { type: 'Point', coordinates: [lng, lat] };
                    return {
                        type: 'Feature',
                        id: index,
                        geometry,
                        properties: {
                            ...dataset,
                        },
                    };
                } else {
                    console.log('Error in dataset: ', dataset);
                    console.log(
                        'Unable to extract lat lng from wkt: ',
                        dataset.wkt
                    );
                }
            })
            .filter((feature) => feature);

        return {
            type: 'FeatureCollection',
            features: features as Feature<Point, Dataset>[],
        };
    }

    return defaultGeoJson as FeatureCollection<Point, Dataset>;
};

export const extractLatLng = (wkt: string) => {
    const coordinates = wkt.replace('POINT (', '').replace(')', '');
    const [lng, lat] = coordinates.split(' ').map(Number);
    return { lat: lat || NaN, lng: lng || NaN };
};

export const getMainstemBuffer = (drainageArea: number): number => {
    if (drainageArea < MAINSTEM_DRAINAGE_SMALL) {
        return 3;
    } else if (drainageArea < MAINSTEM_DRAINAGE_MEDIUM) {
        return 10;
    }
    // Large mainstem
    return 20;
};

const sortObjectByCount = (
    obj: Record<string, number>
): Record<string, number> => {
    return Object.fromEntries(
        Object.entries(obj).sort(([, a], [, b]) => b - a)
    );
};

export const createSummary = (
    id: string,
    data: MainstemData & { datasets: Dataset[] }
): Summary => {
    const datasets = data.datasets;
    const length = data.lengthkm;
    const name = data.name_at_outlet;

    if (datasets && datasets.length) {
        const totalDatasets = datasets.length;
        const variables: SummaryData = {};
        const types: SummaryData = {};
        const techniques: SummaryData = {};
        const wkts = new Set<string>();

        datasets.forEach((dataset) => {
            const { variableMeasured, type, measurementTechnique, wkt } =
                dataset;

            const variable = variableMeasured.split(' / ')[0];
            variables[variable] = (variables[variable] || 0) + 1;

            types[type] = (types[type] || 0) + 1;

            techniques[measurementTechnique] =
                (techniques[measurementTechnique] || 0) + 1;

            wkts.add(wkt); // No need to count each site
        });

        return {
            id,
            name,
            length,
            totalDatasets,
            totalSites: wkts.size,
            variables: sortObjectByCount(variables),
            types: sortObjectByCount(types),
            techniques: sortObjectByCount(techniques),
        };
    } else {
        // No datasets, placeholder to prevent additional fetches
        return {
            id,
            name,
            length,
            totalDatasets: 0,
            totalSites: 0,
            variables: {},
            types: {},
            techniques: {},
        };
    }
};

export const getDatasetsInBounds = (
    map: Map,
    datasets: FeatureCollection<Point, Dataset>
): FeatureCollection<Point, Dataset> => {
    const bounds = map.getBounds();
    if (bounds) {
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();
        const southEast = bounds.getSouthEast();
        const northWest = bounds.getNorthWest();

        const bbox = turf.polygon([
            [
                [northEast.lng, northEast.lat],
                [northWest.lng, northWest.lat],
                [southWest.lng, southWest.lat],
                [southEast.lng, southEast.lat],
                [northEast.lng, northEast.lat],
            ],
        ]);

        const contained = turf.pointsWithinPolygon(datasets, bbox);

        return contained as FeatureCollection<Point, Dataset>;
    }
    return datasets;
};

export const createFilters = (
    datasets: Dataset[]
): {
    distributionNames: string[];
    siteNames: string[];
    types: string[];
    variables: string[];
} => {
    const distributionNames: string[] = [];
    const siteNames: string[] = [];
    const variables: string[] = [];
    const types: string[] = [];
    datasets.forEach((dataset) => {
        if (!distributionNames.includes(dataset.distributionName)) {
            distributionNames.push(dataset.distributionName);
        }
        if (!siteNames.includes(dataset.siteName)) {
            siteNames.push(dataset.siteName);
        }

        if (!types.includes(dataset.type)) {
            types.push(dataset.type);
        }

        const variable = dataset.variableMeasured.split(' / ')[0];
        if (!variables.includes(variable)) {
            variables.push(variable);
        }
    });

    return {
        distributionNames,
        siteNames,
        types,
        variables,
    };
};
