import { HYF, HYF_PREFIX, SCHEMA, SCHEMA_PREFIX } from '@/queries/consts';
import { TMainstemQuery } from '@/queries/types';
import { format } from '@/queries/utils/format';

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
