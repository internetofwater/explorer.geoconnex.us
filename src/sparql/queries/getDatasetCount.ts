import {
    HYF,
    HYF_PREFIX,
    SCHEMA,
    SCHEMA_PREFIX,
} from '@/sparql/queries/consts';
import { TMainstemQuery, TOptions } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';
import { getQueryOptions } from './utils/getQueryOptions';

export type TRawGetDatasetCount = { count: string };

export const DatasetCount = z.object({
    count: z.coerce.number(),
});

export type TDatasetCount = z.infer<typeof DatasetCount>;

const build = (uri: string, options: TOptions = {}) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}

            SELECT (COUNT(DISTINCT ?dataset) AS ?count)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                    ${SCHEMA}:subjectOf ?dataset .
                    
            ${getQueryOptions(options)}
            }`);

export const getDatasetCount: TMainstemQuery = Object.assign(build, {
    example: () =>
        build('https://geoconnex.us/ref/mainstems/1', {
            variableMeasuredURIs: ['test1', 'test2'],
        }),
});
