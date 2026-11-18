import {
    HYF,
    HYF_PREFIX,
    SCHEMA,
    SCHEMA_PREFIX,
} from '@/sparql/queries/consts';
import { TBasicOptions, TMainstemQuery } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';

export type TRawGetDistributionNames = {
    datasets: string;
    distributionName: string;
};

export const DistributionNames = z.array(
    z.object({
        datasets: z.coerce.number(),
        distributionName: z.string(),
    })
);

export type TDistributionNames = z.infer<typeof DistributionNames>;

const build = (uri: string, options: TBasicOptions = { prefix: true }) =>
    // Tuned for QLever on the Geoconnex dataset: dedupe (dataset, provider)
    // pairs before resolving provider names, so the large schema:name join
    // runs on fewer rows
    format(`
            ${
                options.prefix !== false
                    ? `
                ${HYF_PREFIX}
                ${SCHEMA_PREFIX}`
                    : ''
            }

            SELECT ?distributionName (COUNT(DISTINCT ?dataset) AS ?datasets)
            WHERE {
                {
                    SELECT DISTINCT ?dataset ?provider
                    WHERE {
                        VALUES ?mainstem { <${uri}> }
                        ?monitoringLocation
                            ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                            ${HYF}:HydroLocationType ?type ;
                            ${SCHEMA}:subjectOf ?dataset ;
                            ${SCHEMA}:provider ?provider .

                        ?dataset ${SCHEMA}:variableMeasured ?variableMeasured .
                    }
                }
                ?provider ${SCHEMA}:name ?distributionName .
            }
            GROUP BY ?distributionName
            ORDER BY DESC(?datasets)
`);

export const getDistributionNames: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
