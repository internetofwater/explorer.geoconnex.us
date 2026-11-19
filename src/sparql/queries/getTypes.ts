import { VIEW_PREFIX } from '@/sparql/queries/consts';
import { TBasicOptions, TMainstemQuery } from '@/sparql/queries/types';
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

// Reads from the `explorer-type-counts` QLever materialized view
const build = (uri: string, options: TBasicOptions = { prefix: true }) =>
    format(`
            ${options.prefix !== false ? VIEW_PREFIX : ''}

            SELECT ?type ?datasets
            WHERE {
                SERVICE view:explorer-type-counts {
                    [
                        view:column-mainstem <${uri}> ;
                        view:column-type ?type ;
                        view:column-datasets ?datasets
                    ]
                }
            }
            ORDER BY DESC(?datasets)`);

export const getTypes: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
