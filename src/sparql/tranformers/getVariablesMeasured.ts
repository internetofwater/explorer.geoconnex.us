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
        ({ variableMeasured, variableMeasuredURI, datasets }) => ({
            variableMeasured: variableMeasured.value,
            variableMeasuredURI: variableMeasuredURI.value,
            datasets: datasets.value,
        })
    );

    return VariablesMeasured.parse(types);
};
