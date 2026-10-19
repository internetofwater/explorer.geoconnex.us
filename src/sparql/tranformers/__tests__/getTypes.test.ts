import { parseGetTypes } from '@/sparql/tranformers/getTypes';
import { TEST_GET_TOTAL_TYPES_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getTypes.response';

describe('parseGetTypes', () => {
    it('should parse types', () => {
        const result = parseGetTypes(TEST_GET_TOTAL_TYPES_RESPONSE);

        expect(result).toHaveLength(5);

        expect(result[0]).toEqual({
            type: 'Lake',
            datasets: 1691,
        });

        expect(result[1]).toEqual({
            type: 'River/Stream',
            datasets: 103,
        });

        expect(result.at(-1)).toEqual({
            type: 'Facility Public Water Supply (PWS)',
            datasets: 2,
        });
    });

    it('should coerce dataset counts to numbers', () => {
        const result = parseGetTypes(TEST_GET_TOTAL_TYPES_RESPONSE);

        expect(typeof result[0].datasets).toBe('number');
        expect(result[0].datasets).toBe(1691);
    });

    it('should return an empty array when no bindings are returned', () => {
        const response = {
            ...TEST_GET_TOTAL_TYPES_RESPONSE,
            results: {
                bindings: [],
            },
        };

        expect(parseGetTypes(response)).toEqual([]);
    });

    it('should throw when datasets cannot be coerced to a number', () => {
        const response = JSON.parse(
            JSON.stringify(TEST_GET_TOTAL_TYPES_RESPONSE)
        );

        response.results.bindings[0].datasets.value = 'not-a-number';

        expect(() => parseGetTypes(response)).toThrow();
    });
});
