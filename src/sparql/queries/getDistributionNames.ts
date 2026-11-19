import { VIEW_PREFIX } from '@/sparql/queries/consts';
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

// Reads from the `explorer-distribution-counts` QLever materialized view
const build = (uri: string, options: TBasicOptions = { prefix: true }) =>
    format(`
            ${options.prefix !== false ? VIEW_PREFIX : ''}

            SELECT ?distributionName ?datasets
            WHERE {
                SERVICE view:explorer-distribution-counts {
                    [
                        view:column-mainstem <${uri}> ;
                        view:column-distributionName ?distributionName ;
                        view:column-datasets ?datasets
                    ]
                }
            }
            ORDER BY DESC(?datasets)`);

export const getDistributionNames: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
