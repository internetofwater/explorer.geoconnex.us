import { VIEW_PREFIX } from '@/sparql/queries/consts';
import { TBasicOptions, TMainstemQuery } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';

export type TRawGetTotalSites = { count: string };

export const TotalSites = z.object({
    count: z.coerce.number(),
});

export type TTotalSites = z.infer<typeof TotalSites>;

// Reads from the `explorer-site-counts` QLever materialized view.
// SUM over the (at most one) row so a mainstem without sites still returns 0.
const build = (uri: string, options: TBasicOptions = { prefix: true }) =>
    format(`
            ${options.prefix !== false ? VIEW_PREFIX : ''}

            SELECT (SUM(?sites) AS ?count)
            WHERE {
                SERVICE view:explorer-site-counts {
                    [
                        view:column-mainstem <${uri}> ;
                        view:column-count ?sites
                    ]
                }
            }`);

export const getTotalSites: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
