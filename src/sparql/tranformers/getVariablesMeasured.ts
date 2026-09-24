import { TGraphResponse } from '@/sparql/queries/types';
import {
    TRawGetVariablesMeasured,
    TVariablesMeasured,
    VariablesMeasured,
} from '@/sparql/queries/getVariablesMeasured';

export const parseGetVariablesMeasured = (
    response: TGraphResponse<TRawGetVariablesMeasured>
): TVariablesMeasured => {
    const types = response.results.bindings.map(
        ({ variableMeasured, datasets }) => ({
            variableMeasured: variableMeasured.value,
            datasets: datasets.value,
        })
    );

    return VariablesMeasured.parse(types);
};
