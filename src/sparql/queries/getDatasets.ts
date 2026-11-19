import { VIEW_PREFIX } from '@/sparql/queries/consts';
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

// Reads from the `explorer-datasets` QLever materialized view instead of joining raw triples at query time.
const build = (uri: string, options: TQueryOptions = { prefix: true }) =>
    format(`
            ${options.prefix !== false ? VIEW_PREFIX : ''}

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
                ${getQueryOptions(options)}
                SERVICE view:explorer-datasets {
                    [
                        view:column-mainstem ?mainstem ;
                        view:column-type ?type ;
                        view:column-variableMeasured ?variableMeasured ;
                        view:column-monitoringLocation ?monitoringLocation ;
                        view:column-datasetDescription ?datasetDescription ;
                        view:column-siteName ?siteName ;
                        view:column-variableUnit ?variableUnit ;
                        view:column-temporalCoverage ?temporalCoverage ;
                        view:column-distributionName ?distributionName ;
                        view:column-wkt ?wkt
                    ]
                }
            }

            ${options.limit ? `LIMIT ${options.limit}` : ''}`);

export const getDatasets: TMainstemQuery = Object.assign(build, {
    example: () =>
        build('https://geoconnex.us/ref/mainstems/1', {
            variables: ['Temperature, water', 'pH'],
            types: ['Well', 'Stream'],
        }),
});
