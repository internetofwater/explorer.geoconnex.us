import {
    GEO,
    GEO_PREFIX,
    HYF,
    HYF_PREFIX,
    SCHEMA,
    SCHEMA_PREFIX,
} from '@/sparql/queries/consts';
import { TMainstemQuery, TQueryOptions } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';
import { getQueryOptions } from '@/sparql/queries/utils/getQueryOptions';

export type TRawGetDatasetCount = { count: string };

export const DatasetCount = z.object({
    count: z.coerce.number(),
});

export type TDatasetCount = z.infer<typeof DatasetCount>;

const build = (uri: string, options: TQueryOptions = {}) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}
            ${GEO_PREFIX}

            SELECT (COUNT(DISTINCT ?dataset) AS ?count)
            WHERE {
                VALUES ?mainstem { <${uri}> }

                ?monitoringLocation ${HYF}:HydroLocationType ?type .
                ?monitoringLocation ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem .
                ?monitoringLocation ${SCHEMA}:subjectOf ?dataset .
                ?monitoringLocation ${GEO}:hasGeometry/${GEO}:asWKT ?wkt .
                ?monitoringLocation ${SCHEMA}:provider/${SCHEMA}:name ?distributionName .
                ?dataset ${SCHEMA}:variableMeasured ?var .
                ?dataset ${SCHEMA}:description ?datasetDescription .
                ?dataset ${SCHEMA}:temporalCoverage ?temporalCoverage .
                ?dataset ${SCHEMA}:name ?siteName .
                ?var ${SCHEMA}:name ?variableMeasured .
                ?var ${SCHEMA}:unitText ?variableUnit .
                    
                ${getQueryOptions(options)}
            }`);

export const getDatasetCount: TMainstemQuery = Object.assign(build, {
    example: () =>
        build('https://geoconnex.us/ref/mainstems/1', {
            variables: ['Temperature, water', 'pH'],
            types: ['Well', 'Stream'],
        }),
});
