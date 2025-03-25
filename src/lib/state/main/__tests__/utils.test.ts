import { transformDatasets, extractLatLng } from '@/lib/state/utils';
import { Dataset } from '@/app/types';
import {
    Feature,
    FeatureCollection,
    GeoJsonProperties,
    Geometry,
    Point,
} from 'geojson';
import { defaultGeoJson } from '@/lib/state/consts';

describe('utils', () => {
    describe('extractLatLng', () => {
        test('should extract latitude and longitude from WKT string', () => {
            const wkt = 'POINT (30 10)';
            const { lat, lng } = extractLatLng(wkt);
            expect(lat).toBe(10);
            expect(lng).toBe(30);
        });

        test('should handle invalid WKT string', () => {
            const wkt = 'INVALID';
            const { lat, lng } = extractLatLng(wkt);
            expect(lat).toBeNaN();
            expect(lng).toBeNaN();
        });
    });

    describe('transformDatasets', () => {
        test('should transform datasets correctly', () => {
            const feature: Feature<
                Geometry,
                GeoJsonProperties & { datasets: Dataset[] }
            > = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [30, 10],
                },
                properties: {
                    datasets: [
                        {
                            datasetDescription: 'Test Description',
                            distributionFormat: 'CSV',
                            distributionName: 'Test Distribution',
                            distributionURL: 'http://example.com',
                            measurementTechnique: 'Test Technique',
                            monitoringLocation: 'Test Location',
                            siteName: 'Test Site',
                            temporalCoverage: '2020-01-01/2021-01-01',
                            type: 'Test Type',
                            url: 'http://example.com',
                            variableMeasured: 'Test Variable',
                            variableUnit: 'Test Unit',
                            wkt: 'POINT (30 10)',
                        },
                    ],
                },
            };

            const expected: FeatureCollection<Point, Dataset> = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [30, 10],
                        },
                        id: 0,
                        properties: {
                            datasetDescription: 'Test Description',
                            distributionFormat: 'CSV',
                            distributionName: 'Test Distribution',
                            distributionURL: 'http://example.com',
                            measurementTechnique: 'Test Technique',
                            monitoringLocation: 'Test Location',
                            siteName: 'Test Site',
                            temporalCoverage: '2020-01-01/2021-01-01',
                            type: 'Test Type',
                            url: 'http://example.com',
                            variableMeasured: 'Test Variable',
                            variableUnit: 'Test Unit',
                            wkt: 'POINT (30 10)',
                        },
                    },
                ],
            };

            const result = transformDatasets(feature);
            expect(result).toEqual(expected);
        });

        test('should return defaultGeoJson if no datasets are present', () => {
            const feature: Feature<
                Geometry,
                GeoJsonProperties & { datasets?: Dataset[] }
            > = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [30, 10],
                },
                properties: {},
            };

            const result = transformDatasets(feature);
            expect(result).toEqual(defaultGeoJson);
        });
    });
});
