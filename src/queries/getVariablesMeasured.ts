import { HYF, HYF_PREFIX, SCHEMA, SCHEMA_PREFIX } from './consts';
import { TMainstemQuery } from './types';

const build = (uri: string) => `
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}

            SELECT ?variableMeasured (COUNT(DISTINCT ?dataset) AS ?datasets)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation
                    ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem ;
                    ${SCHEMA}:subjectOf ?dataset .

                ?dataset ${SCHEMA}:variableMeasured ?var .
                ?var ${SCHEMA}:name ?variableMeasured .
            }
            GROUP BY ?variableMeasured
            ORDER BY DESC(?datasets)
`;

export const getVariablesMeasured: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
