import { parseGetTotalSites } from '@/sparql/tranformers/getTotalSites';
import { TEST_GET_TOTAL_SITES_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getTotalSites.response';

describe('parseGetTotalSites', () => {
    it('should parse the total site count', () => {
        expect(parseGetTotalSites(TEST_GET_TOTAL_SITES_RESPONSE)).toEqual({
            count: 40,
        });
    });

    it('should coerce count to a number', () => {
        const result = parseGetTotalSites(TEST_GET_TOTAL_SITES_RESPONSE);

        expect(typeof result.count).toBe('number');
    });

    it('should throw when no bindings are returned', () => {
        const response = {
            ...TEST_GET_TOTAL_SITES_RESPONSE,
            results: {
                bindings: [],
            },
        };

        expect(() => parseGetTotalSites(response)).toThrow(
            'Unable to extract total sites from response.'
        );
    });

    it('should throw when multiple bindings are returned', () => {
        const binding = TEST_GET_TOTAL_SITES_RESPONSE.results.bindings[0];

        const response = {
            ...TEST_GET_TOTAL_SITES_RESPONSE,
            results: {
                bindings: [binding, binding],
            },
        };

        expect(() => parseGetTotalSites(response)).toThrow(
            'Unable to extract total sites from response.'
        );
    });
});
