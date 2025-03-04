import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export const defaultGeoJson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [],
};
