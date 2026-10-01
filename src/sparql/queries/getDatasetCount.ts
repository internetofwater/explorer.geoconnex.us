import {
    GEO,
    GEO_PREFIX,
    HYF,
    HYF_PREFIX,
    SCHEMA,
    SCHEMA_PREFIX,
} from '@/sparql/queries/consts';
import { TMainstemQuery, TQueryOptions } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';
import { getQueryOptions } from '@/sparql/queries/utils/getQueryOptions';

export type TRawGetDatasetCount = { count: string };

export const DatasetCount = z.object({
    count: z.coerce.number(),
});

export type TDatasetCount = z.infer<typeof DatasetCount>;

const build = (uri: string, options: TQueryOptions = {}) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}
            ${GEO_PREFIX}

            SELECT (COUNT(DISTINCT ?dataset) AS ?count)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation ${HYF}:HydroLocationType ?type .
                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                    ${SCHEMA}:subjectOf ?dataset .
                ?monitoringLocation ${GEO}:hasGeometry/${GEO}:asWKT ?wkt .

                ?dataset ${SCHEMA}:url ?url .
                ?dataset ${SCHEMA}:distribution ?distribution .
                ?dataset ${SCHEMA}:variableMeasured ?var .
                
                ?var ${SCHEMA}:name ?variableMeasured .
                    
                ${getQueryOptions(options)}
            }`);

export const getDatasetCount: TMainstemQuery = Object.assign(build, {
    example: () =>
        build('https://geoconnex.us/ref/mainstems/1', {
            variables: ['Temperature, water', 'pH'],
            types: ['Well', 'Stream'],
        }),
});
