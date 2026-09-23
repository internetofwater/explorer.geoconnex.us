import {
    GEO,
    GEO_PREFIX,
    HYF,
    HYF_PREFIX,
    SCHEMA,
    SCHEMA_PREFIX,
} from '@/queries/consts';
import { TMainstemQuery } from '@/queries/types';
import { format } from '@/queries/utils/format';

const build = (uri: string) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}
            ${GEO_PREFIX}

            SELECT DISTINCT ?mainstem ?datasets
            WHERE {
                VALUES ?mainstem { <${uri}> }
                ?monitoringLocation ${HYF}:HydroLocationType ?type .
                ?monitoringLocation ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem .
                ?monitoringLocation ${SCHEMA}:subjectOf ?dataset .
                ?monitoringLocation ${GEO}:hasGeometry/${GEO}:asWKT ?wkt .
                ?dataset ${SCHEMA}:variableMeasured ?var .
                ?dataset ${SCHEMA}:url ?url .
                ?dataset ${SCHEMA}:distribution ?distribution .
                ?dataset ${SCHEMA}:description ?datasetDescription .
                ?dataset ${SCHEMA}:temporalCoverage ?temporalCoverage .
                ?dataset ${SCHEMA}:name ?siteName .
                ?var ${SCHEMA}:name ?variableMeasured .
                ?var ${SCHEMA}:unitText ?variableUnit .
                ?var ${SCHEMA}:measurementTechnique ?measurementTechnique .
                ?distribution ${SCHEMA}:name ?distributionName .
                ?distribution ${SCHEMA}:contentUrl ?distributionURL .
                ?distribution ${SCHEMA}:encodingFormat ?distributionFormat .
                BIND(CONCAT(
                    '{"monitoringLocation":"', STR(?monitoringLocation),
                    '","siteName":"', STR(?siteName),
                    '","datasetDescription":"', STR(?datasetDescription),
                    '","type":"', STR(?type),
                    '","url":"', STR(?url),
                    '","variableMeasured":"', STR(?variableMeasured),
                    '","variableUnit":"', STR(?variableUnit),
                    '","measurementTechnique":"', STR(?measurementTechnique),
                    '","temporalCoverage":"', STR(?temporalCoverage),
                    '","distributionName":"', STR(?distributionName),
                    '","distributionURL":"', STR(?distributionURL),
                    '","distributionFormat":"', STR(?distributionFormat),
                    '","wkt":"', STR(?wkt), '"}'
                ) AS ?datasets)
            }`);

export const getDatasets: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
