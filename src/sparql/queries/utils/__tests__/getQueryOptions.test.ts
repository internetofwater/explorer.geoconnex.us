import { getQueryOptions } from '@/sparql/queries/utils/getQueryOptions';

describe('getQueryOptions', () => {
    it('should return an empty string when no options are provided', () => {
        expect(getQueryOptions({})).toContain('');
    });

    it('should generate variables filter', () => {
        const result = getQueryOptions({
            variables: ['Temperature', 'pH'],
        });

        expect(result).toContain('VALUES ?variableMeasured');

        expect(result).toContain('"Temperature"');
        expect(result).toContain('"pH"');
    });

    it('should generate types filter', () => {
        const result = getQueryOptions({
            types: ['Lake', 'Stream'],
        });

        expect(result).toContain('VALUES ?type');

        expect(result).toContain('"Lake"');
        expect(result).toContain('"Stream"');
    });

    it('should generate distribution name filter', () => {
        const result = getQueryOptions({
            distributionNames: ['USGS', 'EPA'],
        });

        expect(result).toContain('VALUES ?distributionName');

        expect(result).toContain('"USGS"');
        expect(result).toContain('"EPA"');
    });

    it('should generate all filters', () => {
        const result = getQueryOptions({
            variables: ['Temperature'],
            types: ['Lake'],
            distributionNames: ['USGS'],
        });

        expect(result).toContain('VALUES ?variableMeasured');
        expect(result).toContain('VALUES ?type');
        expect(result).toContain('VALUES ?distributionName');
    });

    it('should ignore empty arrays', () => {
        const result = getQueryOptions({
            variables: [],
            types: [],
            distributionNames: [],
        });

        expect(result).not.toContain('VALUES ?variableMeasured');
        expect(result).not.toContain('VALUES ?type');
        expect(result).not.toContain('VALUES ?distributionName');
    });

    it('should generate the expected SPARQL fragment', () => {
        const result = getQueryOptions({
            variables: ['Temperature', 'pH'],
            types: ['Lake'],
            distributionNames: ['USGS'],
        });

        expect(result.replace(/\s+/g, ' ').trim()).toBe(
            'VALUES ?variableMeasured { "Temperature" "pH" } VALUES ?type { "Lake" } VALUES ?distributionName { "USGS" }'
        );
    });
});
