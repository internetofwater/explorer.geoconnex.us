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
import { getQueryOptions } from '@/sparql/queries/utils/getQueryOptions';
import * as z from 'zod';
import { ApiLiteralBinding, ApiUriBinding } from '@/sparql/types/generics';

export const DATASET_LIMIT = 100_000;

export type TRawGetDatasetsUnit = {
    mainstem: ApiUriBinding;
    monitoringLocation: ApiUriBinding;
    datasetDescription: ApiLiteralBinding<string>;
    type: ApiLiteralBinding<string>;
    siteName: ApiLiteralBinding<string>;
    variableMeasured: ApiLiteralBinding<string>;
    variableUnit: ApiLiteralBinding<string>;
    temporalCoverage: ApiLiteralBinding<string>;
    distributionName: ApiLiteralBinding<string>;
    wkt: ApiLiteralBinding<string>;
};

export type TRawGetDatasets = Array<TRawGetDatasetsUnit>;

export const Datasets = z.array(
    z.object({
        monitoringLocation: z.string(),
        datasetDescription: z.string(),
        type: z.string(),
        siteName: z.string(),
        variableMeasured: z.string(),
        variableUnit: z.string(),
        temporalCoverage: z.string(),
        distributionName: z.string(),
        wkt: z.string(),
    })
);

export type TDatasets = z.infer<typeof Datasets>;

// Filters run in a subquery so attribute lookups only touch filtered rows.
// Lookups like description, WKT and unit are large joins since nearly every feature has
// them, so doing that after the variable/type filters skips rows that would be discarded.
const build = (uri: string, options: TQueryOptions = { prefix: true }) =>
    format(`
         ${
             options.prefix !== false
                 ? `
                ${HYF_PREFIX}
                ${SCHEMA_PREFIX}
                ${GEO_PREFIX}`
                 : ''
         }

            SELECT DISTINCT 
                ?mainstem 
                ?monitoringLocation 
                ?datasetDescription 
                ?type 
                ?siteName
                ?variableMeasured
                ?variableUnit
                ?temporalCoverage 
                ?distributionName 
                ?wkt
            WHERE {
                {
                    SELECT
                        ?mainstem
                        ?monitoringLocation
                        ?type
                        ?dataset
                        ?var
                        ?variableMeasured
                        ?distributionName
                    WHERE {
                        VALUES ?mainstem { <${uri}> }
                        ?monitoringLocation ${HYF}:referencedPosition/${HYF}:HY_IndirectPosition/${HYF}:linearElement ?mainstem .
                        ?monitoringLocation ${HYF}:HydroLocationType ?type .
                        ?monitoringLocation ${SCHEMA}:subjectOf ?dataset .
                        ?dataset ${SCHEMA}:variableMeasured ?var .
                        ?var ${SCHEMA}:name ?variableMeasured .
                        ?monitoringLocation ${SCHEMA}:provider/${SCHEMA}:name ?distributionName .

                        ${getQueryOptions(options)}
                    }
                }
                ?monitoringLocation ${GEO}:hasGeometry/${GEO}:asWKT ?wkt .
                ?dataset ${SCHEMA}:description ?datasetDescription .
                ?dataset ${SCHEMA}:temporalCoverage ?temporalCoverage .
                ?dataset ${SCHEMA}:name ?siteName .
                ?var ${SCHEMA}:unitText ?variableUnit .
            }

            ${options.limit ? `LIMIT ${options.limit}` : ''}`);

export const getDatasets: TMainstemQuery = Object.assign(build, {
    example: () =>
        build('https://geoconnex.us/ref/mainstems/1', {
            variables: ['Temperature, water', 'pH'],
            types: ['Well', 'Stream'],
        }),
});
