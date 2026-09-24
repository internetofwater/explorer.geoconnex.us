import { TVariablesMeasured } from '@/sparql/queries/getVariablesMeasured';

export const isVariablesMeasured = (
    obj: unknown
): obj is TVariablesMeasured => {
    return (
        Array.isArray(obj) && (obj.length === 0 || 'variableMeasured' in obj[0])
    );
};
