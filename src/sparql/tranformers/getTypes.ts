import { TGraphResponse } from '@/sparql/queries/types';
import { TRawGetTypes, TTypes, Types } from '../queries/getTypes';

export const parseGetTypes = (
    response: TGraphResponse<TRawGetTypes>
): TTypes => {
    const types = response.results.bindings.map(({ type, datasets }) => ({
        type: type.value,
        datasets: datasets.value,
    }));

    return Types.parse(types);
};
