import { TEST_GET_DATASET_COUNT_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getDatasetCount.response';
import { parseGetDatasetCount } from '@/sparql/tranformers/getDatasetCount';

describe('parseGetDatasetCount', () => {
    it('should parse the dataset count', () => {
        const result = parseGetDatasetCount(TEST_GET_DATASET_COUNT_RESPONSE);

        expect(result).toEqual({
            count: 32336,
        });
    });

    it('should throw when no bindings are returned', () => {
        expect(() =>
            parseGetDatasetCount({
                ...TEST_GET_DATASET_COUNT_RESPONSE,
                results: {
                    bindings: [],
                },
            })
        ).toThrow('Unable to extract dataset count from response.');
    });

    it('should throw when more than one binding is returned', () => {
        expect(() =>
            parseGetDatasetCount({
                ...TEST_GET_DATASET_COUNT_RESPONSE,
                results: {
                    bindings: [
                        TEST_GET_DATASET_COUNT_RESPONSE.results.bindings[0],
                        TEST_GET_DATASET_COUNT_RESPONSE.results.bindings[0],
                    ],
                },
            })
        ).toThrow('Unable to extract dataset count from response.');
    });
});
