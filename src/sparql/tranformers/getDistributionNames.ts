import { TGraphResponse } from '@/sparql/queries/types';
import {
    DistributionNames,
    TDistributionNames,
    TRawGetDistributionNames,
} from '@/sparql/queries/getDistributionNames';

export const parseGetDistributionNames = (
    response: TGraphResponse<TRawGetDistributionNames>
): TDistributionNames => {
    const types = response.results.bindings.map(
        ({ distributionName, datasets }) => ({
            distributionName: distributionName.value,
            datasets: datasets.value,
        })
    );

    return DistributionNames.parse(types);
};
