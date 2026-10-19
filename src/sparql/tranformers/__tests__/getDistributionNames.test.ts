import { parseGetDistributionNames } from '@/sparql/tranformers/getDistributionNames';
import { TEST_GET_DISTRIBUTION_NAMES } from '@/sparql/tranformers/__tests__/fixtures/getDistributionNames.response';

describe('parseGetDistributionNames', () => {
    it('should parse distribution names', () => {
        const result = parseGetDistributionNames(TEST_GET_DISTRIBUTION_NAMES);

        expect(result).toHaveLength(7);

        expect(result[0]).toEqual({
            distributionName:
                'Department of Environmental Quality - State of Oregon',
            datasets: 1198,
        });

        expect(result[1]).toEqual({
            distributionName: 'EPA National Aquatic Resources Survey (NARS)',
            datasets: 543,
        });

        expect(result.at(-1)).toEqual({
            distributionName: 'North American Lake Management Society',
            datasets: 4,
        });
    });

    it('should coerce dataset counts to numbers', () => {
        const result = parseGetDistributionNames(TEST_GET_DISTRIBUTION_NAMES);

        expect(typeof result[0].datasets).toBe('number');
        expect(result[0].datasets).toBe(1198);
    });

    it('should return an empty array when no bindings are returned', () => {
        const response = {
            ...TEST_GET_DISTRIBUTION_NAMES,
            results: {
                bindings: [],
            },
        };

        expect(parseGetDistributionNames(response)).toEqual([]);
    });

    it('should throw when datasets cannot be coerced to a number', () => {
        const response = JSON.parse(
            JSON.stringify(TEST_GET_DISTRIBUTION_NAMES)
        );

        response.results.bindings[0].datasets.value = 'not-a-number';

        expect(() => parseGetDistributionNames(response)).toThrow();
    });
});
