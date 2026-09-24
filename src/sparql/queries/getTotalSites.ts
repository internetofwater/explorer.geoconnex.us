import {
    GEO,
    GEO_PREFIX,
    HYF,
    HYF_PREFIX,
    SCHEMA_PREFIX,
} from '@/sparql/queries/consts';
import { TMainstemQuery } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';

export type TRawGetTotalSites = { count: string };

export const TotalSites = z.object({
    count: z.coerce.number(),
});

export type TTotalSites = z.infer<typeof TotalSites>;

const build = (uri: string) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}
            ${GEO_PREFIX}

            SELECT (COUNT(DISTINCT STR(?wkt)) AS ?count)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem .
                ?monitoringLocation ${GEO}:hasGeometry/${GEO}:asWKT ?wkt .
            }`);

export const getTotalSites: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
