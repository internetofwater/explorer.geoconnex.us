import { GEO_PREFIX, HYF_PREFIX, SCHEMA_PREFIX } from '@/sparql/queries/consts';
import { TMainstemQuery, TQueryOptions } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';
import { factoryService } from '@/services/init/init';

export type TRawGetDatasetCount = { count: string };

export const DatasetCount = z.object({
    count: z.coerce.number(),
});

export type TDatasetCount = z.infer<typeof DatasetCount>;

const build = (uri: string, options: TQueryOptions = { prefix: true }) =>
    format(`
            ${
                options.prefix !== false
                    ? `
                ${HYF_PREFIX}
                ${SCHEMA_PREFIX}
                ${GEO_PREFIX}`
                    : ''
            }
          
            SELECT (COUNT(*) AS ?count)
            WHERE {
                {
                    ${factoryService.createGetDatasets(uri, { ...options, prefix: false, limit: undefined })}
                }
            }`);

export const getDatasetCount: TMainstemQuery = Object.assign(build, {
    example: () =>
        build('https://geoconnex.us/ref/mainstems/1', {
            variables: ['Temperature, water', 'pH'],
            types: ['Well', 'Stream'],
        }),
});
