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

export const DATASET_LIMIT = 100_000;

type SparqlUriBinding = {
    type: 'uri';
    value: string;
};

type SparqlLiteralBinding =
    | {
          value: string;
          language: string;
          datatype: {
              value: string;
          };
          direction: string;
      }
    | { type: 'literal'; value: string };

export type TRawGetDatasetsUnit = {
    mainstem: SparqlUriBinding;
    monitoringLocation: SparqlUriBinding;
    datasetDescription: SparqlLiteralBinding;
    type: SparqlLiteralBinding;
    siteName: SparqlLiteralBinding;
    variableMeasured: SparqlLiteralBinding;
    variableUnit: SparqlLiteralBinding;
    temporalCoverage: SparqlLiteralBinding;
    distributionName: SparqlLiteralBinding;
    wkt: SparqlLiteralBinding;
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

const build = (uri: string, options: TQueryOptions = {}) =>
    format(`
            ${HYF_PREFIX}
            ${SCHEMA_PREFIX}
            ${GEO_PREFIX}

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
            }
            LIMIT ${DATASET_LIMIT}`);

export const getDatasets: TMainstemQuery = Object.assign(build, {
    example: () =>
        build('https://geoconnex.us/ref/mainstems/1', {
            variables: ['Temperature, water', 'pH'],
            types: ['Well', 'Stream'],
        }),
});
