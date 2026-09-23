import { HYF, HYF_PREFIX, SCHEMA, SCHEMA_PREFIX } from '@/queries/consts';
import { TMainstemQuery } from '@/queries/types';
import { format } from '@/queries/utils/format';

const build = (uri: string) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}

            SELECT (COUNT(DISTINCT ?dataset) AS ?count)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                    ${SCHEMA}:subjectOf ?dataset .
            }`);

export const getDatasetCount: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
