import { TGraphResponse } from '@/sparql/queries/types';
import {
    TotalSites,
    TRawGetTotalSites,
    TTotalSites,
} from '@/sparql/queries/getTotalSites';

export const parseGetTotalSites = (
    response: TGraphResponse<TRawGetTotalSites>
): TTotalSites => {
    if (response.results.bindings.length !== 1) {
        throw new Error('Unable to extract total sites from response.');
    }

    const result = {
        count: response.results.bindings[0].count.value,
    };

    return TotalSites.parse(result);
};
