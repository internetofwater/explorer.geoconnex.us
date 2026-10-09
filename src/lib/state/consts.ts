import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export const defaultGeoJson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [],
};

// Determines the number of datasets included in each batch loaded from the stream
export const BATCH_SIZE = 50000;
