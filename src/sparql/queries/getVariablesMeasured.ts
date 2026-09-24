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
};

export const VariablesMeasured = z.array(
    z.object({
        datasets: z.coerce.number(),
        variableMeasured: z.string(),
    })
);

export type TVariablesMeasured = z.infer<typeof VariablesMeasured>;

const build = (uri: string) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}

            SELECT ?variableMeasured (COUNT(DISTINCT ?dataset) AS ?datasets)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                    ${SCHEMA}:subjectOf ?dataset .

                ?dataset ${SCHEMA}:variableMeasured ?var .
                ?var ${SCHEMA}:name ?variableMeasured .
            }
            GROUP BY ?variableMeasured
            ORDER BY DESC(?datasets)
`);

export const getVariablesMeasured: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
