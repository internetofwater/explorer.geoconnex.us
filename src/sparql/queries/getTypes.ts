import {
    HYF,
    HYF_PREFIX,
    SCHEMA,
    SCHEMA_PREFIX,
} from '@/sparql/queries/consts';
import { TMainstemQuery } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';

export type TRawGetTypes = { datasets: string; type: string };

export const Types = z.array(
    z.object({
        datasets: z.coerce.number(),
        type: z.string(),
    })
);

export type TTypes = z.infer<typeof Types>;

const build = (uri: string) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}

            SELECT ?type (COUNT(DISTINCT ?dataset) AS ?datasets)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                    ${HYF}:HydroLocationType ?type ;
                    ${SCHEMA}:subjectOf ?dataset .
            }
            GROUP BY ?type
            ORDER BY DESC(?datasets)`);

export const getTypes: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
