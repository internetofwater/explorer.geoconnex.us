import {
    HYF,
    HYF_PREFIX,
    SCHEMA,
    SCHEMA_PREFIX,
} from '@/sparql/queries/consts';
import { TMainstemQuery } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';

export type TRawGetVariablesMeasured = {
    datasets: string;
    variableMeasured: string;
    variableMeasuredURI: string;
};

export const VariablesMeasured = z.array(
    z.object({
        datasets: z.coerce.number(),
        variableMeasured: z.string(),
        variableMeasuredURI: z.string(),
    })
);

export type TVariablesMeasured = z.infer<typeof VariablesMeasured>;

// This field is used to query elsewhere, keeping naming consistent
export const VARIABLE_MEASURED_URI = 'variableMeasuredURI';

const build = (uri: string) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}

            SELECT ?variableMeasuredURI ?variableMeasured (COUNT(DISTINCT ?dataset) AS ?datasets)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                    ${SCHEMA}:subjectOf ?dataset .

                ?dataset ${SCHEMA}:variableMeasured ?${VARIABLE_MEASURED_URI} .
                ?${VARIABLE_MEASURED_URI} ${SCHEMA}:name ?variableMeasured .
            }
            GROUP BY ?${VARIABLE_MEASURED_URI} ?variableMeasured
            ORDER BY DESC(?datasets)
`);

export const getVariablesMeasured: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
