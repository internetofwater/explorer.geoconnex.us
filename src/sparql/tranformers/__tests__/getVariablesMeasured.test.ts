import { parseGetVariablesMeasured } from '@/sparql/tranformers/getVariablesMeasured';
import { TEST_GET_VARIABLES_MEASURED_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getVariablesMeasured.response';

describe('parseGetVariablesMeasured', () => {
    it('should parse variables measured response', () => {
        const result = parseGetVariablesMeasured(
            TEST_GET_VARIABLES_MEASURED_RESPONSE
        );

        expect(result).toHaveLength(
            TEST_GET_VARIABLES_MEASURED_RESPONSE.results.bindings.length
        );

        expect(result[0]).toEqual({
            variableMeasured: 'Temperature, water',
            datasets: 23,
        });
    });

    it('should throw when datasets is not coercible to a number', () => {
        const response = JSON.parse(
            JSON.stringify(TEST_GET_VARIABLES_MEASURED_RESPONSE)
        );
        response.results.bindings[0].datasets.value = 'not-a-number';

        expect(() => parseGetVariablesMeasured(response)).toThrow();
    });
});
