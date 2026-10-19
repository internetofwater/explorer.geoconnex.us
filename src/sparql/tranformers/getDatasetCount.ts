import {
    DatasetCount,
    TDatasetCount,
    TRawGetDatasetCount,
} from '@/sparql/queries/getDatasetCount';
import { TGraphResponse } from '@/sparql/queries/types';

export const parseGetDatasetCount = (
    response: TGraphResponse<TRawGetDatasetCount>
): TDatasetCount => {
    if (response.results.bindings.length !== 1) {
        throw new Error('Unable to extract dataset count from response.');
    }

    const datasetCount = {
        count: response.results.bindings[0].count.value,
    };

    return DatasetCount.parse(datasetCount);
};
