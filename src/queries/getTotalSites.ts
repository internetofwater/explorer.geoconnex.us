import {
    GEO,
    GEO_PREFIX,
    HYF,
    HYF_PREFIX,
    SCHEMA_PREFIX,
} from '@/queries/consts';
import { TMainstemQuery } from '@/queries/types';
import { format } from '@/queries/utils/format';

const build = (uri: string) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}
            ${GEO_PREFIX}

            SELECT (COUNT(DISTINCT STR(?wkt)) AS ?totalSites)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem .
                ?monitoringLocation ${GEO}:hasGeometry/${GEO}:asWKT ?wkt .
            }`);

export const getTotalSites: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
