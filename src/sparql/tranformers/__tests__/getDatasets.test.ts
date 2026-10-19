import { parseGetDatasets } from '@/sparql/tranformers/getDatasets';
import { TEST_GET_DATASETS_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getDatasets.response';

describe('parseGetDatasets', () => {
    it('should parse datasets', () => {
        const result = parseGetDatasets(
            TEST_GET_DATASETS_RESPONSE.results.bindings as any
        );

        expect(result).toHaveLength(3);

        expect(result[0]).toEqual({
            monitoringLocation:
                'https://geoconnex.us/wqp/NWIS/USGS-OR/USGS-433855123045210',
            datasetDescription:
                'Total volatile solids measurements at COAST FORK WILLAMETTE RIVER HYPORHEIC FLOW 0, OR',
            type: 'Well: Hyporheic-zone well',
            siteName: 'Total volatile solids',
            variableMeasured: 'Total Coliform',
            variableUnit: 'Undefined',
            temporalCoverage: '2002-01-01/2002-12-31',
            distributionName: 'USGS Oregon Water Science Center',
            wkt: 'POINT(-123.082298 43.648455)',
        });
    });

    it('should parse all dataset records', () => {
        const result = parseGetDatasets(
            TEST_GET_DATASETS_RESPONSE.results.bindings as any
        );

        expect(result).toHaveLength(
            TEST_GET_DATASETS_RESPONSE.results.bindings.length
        );

        result.forEach((dataset) => {
            expect(typeof dataset.monitoringLocation).toBe('string');
            expect(typeof dataset.datasetDescription).toBe('string');
            expect(typeof dataset.type).toBe('string');
            expect(typeof dataset.siteName).toBe('string');
            expect(typeof dataset.variableMeasured).toBe('string');
            expect(typeof dataset.variableUnit).toBe('string');
            expect(typeof dataset.temporalCoverage).toBe('string');
            expect(typeof dataset.distributionName).toBe('string');
            expect(typeof dataset.wkt).toBe('string');
        });
    });

    it('should return an empty array when no datasets are returned', () => {
        expect(parseGetDatasets([])).toEqual([]);
    });
});
