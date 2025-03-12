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
} from 'geojson';
import { Summary } from '@/lib/state/main/slice';
import { defaultGeoJson } from '@/lib/state/consts';

export const transformDatasets = (
    feature: Feature<Geometry, GeoJsonProperties & { datasets?: Dataset[] }>
): FeatureCollection<Geometry, Dataset> => {
    if (
        feature.properties &&
        feature.properties?.datasets &&
        (feature.properties?.datasets ?? []).length > 0
    ) {
        const features = feature.properties.datasets
            .map((dataset: Dataset) => {
                const { lat, lng } = extractLatLng(dataset.wkt);
                if (!isNaN(lat) && !isNaN(lng)) {
                    const geometry = { type: 'Point', coordinates: [lng, lat] };
                    return {
                        type: 'Feature',
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
            features: features as Feature<Geometry, Dataset>[],
        };
    }

    return defaultGeoJson as FeatureCollection<Geometry, Dataset>;
};

export const extractLatLng = (wkt: string) => {
    const coordinates = wkt.replace('POINT (', '').replace(')', '');
    const [lng, lat] = coordinates.split(' ').map(Number);
    return { lat: lat || NaN, lng: lng || NaN };
};

export const getMainstemBuffer = (
    feature: Feature<Geometry, MainstemData & { datasets: Dataset[] }>
): number => {
    if (feature.properties) {
        const drainageArea = feature.properties.outlet_drainagearea_sqkm;
        if (drainageArea < MAINSTEM_DRAINAGE_SMALL) {
            return 3;
        } else if (drainageArea < MAINSTEM_DRAINAGE_MEDIUM) {
            return 10;
        }
        // Large mainstem
        return 20;
    }
    return 0;
};

export const createSummary = (
    id: number,
    feature: Feature<Geometry, MainstemData & { datasets: Dataset[] }>
): Summary => {
    const datasets = feature.properties.datasets;
    const length = feature.properties.lengthkm;
    const name = feature.properties.name_at_outlet;
    if (datasets && datasets.length) {
        const total = datasets.length;
        const variables: string[] = [];
        const types: string[] = [];
        const techniques: string[] = [];
        datasets.forEach((dataset) => {
            const { variableMeasured, type, measurementTechnique } = dataset;

            const variable = variableMeasured.split(' / ')[0];
            if (!variables.includes(variable)) {
                variables.push(variable);
            }

            if (!types.includes(type)) {
                types.push(type);
            }

            if (!techniques.includes(measurementTechnique)) {
                techniques.push(measurementTechnique);
            }
        });

        return {
            id,
            name,
            length,
            total,
            variables: variables.join(', '),
            types: types.join(', '),
            techniques: techniques.join(', '),
        };
    } else {
        // No datasets, add placeholder to prevent additional fetches
        return {
            id,
            name,
            length,
            total: 0,
            variables: '',
            types: '',
            techniques: '',
        };
    }
};
