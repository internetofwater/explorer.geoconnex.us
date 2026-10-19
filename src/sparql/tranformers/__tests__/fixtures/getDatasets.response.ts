import {
    TRawGetDatasets,
    TRawGetDatasetsUnit,
} from '@/sparql/queries/getDatasets';
import { TGraphResponse } from '@/sparql/queries/types';

export const TEST_GET_DATASETS_RESPONSE: TGraphResponse<{
    mainstem: string;
    monitoringLocation: string;
    datasetDescription: string;
    type: string;
    siteName: string;
    variableMeasured: string;
    variableUnit: string;
    temporalCoverage: string;
    distributionName: string;
    wkt: string;
}> = {
    head: {
        vars: [
            'mainstem',
            'monitoringLocation',
            'datasetDescription',
            'type',
            'siteName',
            'variableMeasured',
            'variableUnit',
            'temporalCoverage',
            'distributionName',
            'wkt',
        ],
    },
    results: {
        bindings: [
            {
                mainstem: {
                    type: 'uri',
                    value: 'https://geoconnex.us/ref/mainstems/1435309',
                },
                monitoringLocation: {
                    type: 'uri',
                    value: 'https://geoconnex.us/wqp/NWIS/USGS-OR/USGS-433855123045210',
                },
                datasetDescription: {
                    type: 'literal',
                    value: 'Total volatile solids measurements at COAST FORK WILLAMETTE RIVER HYPORHEIC FLOW 0, OR',
                },
                type: {
                    type: 'literal',
                    value: 'Well: Hyporheic-zone well',
                },
                siteName: {
                    type: 'literal',
                    value: 'Total volatile solids',
                },
                variableMeasured: {
                    type: 'literal',
                    value: 'Total Coliform',
                },
                variableUnit: {
                    type: 'literal',
                    value: 'Undefined',
                },
                temporalCoverage: {
                    type: 'literal',
                    value: '2002-01-01/2002-12-31',
                },
                distributionName: {
                    type: 'literal',
                    value: 'USGS Oregon Water Science Center',
                },
                wkt: {
                    datatype: 'http://www.opengis.net/ont/geosparql#wktLiteral',
                    type: 'literal',
                    value: 'POINT(-123.082298 43.648455)',
                },
            },
            {
                mainstem: {
                    type: 'uri',
                    value: 'https://geoconnex.us/ref/mainstems/1435309',
                },
                monitoringLocation: {
                    type: 'uri',
                    value: 'https://geoconnex.us/wqp/NWIS/USGS-OR/USGS-433855123045211',
                },
                datasetDescription: {
                    type: 'literal',
                    value: 'Total volatile solids measurements at COAST FORK WILLAMETTE RIVER HYPORHEIC FLOW 1, OR',
                },
                type: {
                    type: 'literal',
                    value: 'Well: Hyporheic-zone well',
                },
                siteName: {
                    type: 'literal',
                    value: 'Total volatile solids',
                },
                variableMeasured: {
                    type: 'literal',
                    value: 'Total Coliform',
                },
                variableUnit: {
                    type: 'literal',
                    value: 'Undefined',
                },
                temporalCoverage: {
                    type: 'literal',
                    value: '2002-01-01/2002-12-31',
                },
                distributionName: {
                    type: 'literal',
                    value: 'USGS Oregon Water Science Center',
                },
                wkt: {
                    datatype: 'http://www.opengis.net/ont/geosparql#wktLiteral',
                    type: 'literal',
                    value: 'POINT(-123.082298 43.648455)',
                },
            },
            {
                mainstem: {
                    type: 'uri',
                    value: 'https://geoconnex.us/ref/mainstems/1435309',
                },
                monitoringLocation: {
                    type: 'uri',
                    value: 'https://geoconnex.us/wqp/NWIS/USGS-OR/USGS-433855123045212',
                },
                datasetDescription: {
                    type: 'literal',
                    value: 'Total volatile solids measurements at COAST FORK WILLAMETTE RIVER HYPORHEIC FLOW 2, OR',
                },
                type: {
                    type: 'literal',
                    value: 'Well: Hyporheic-zone well',
                },
                siteName: {
                    type: 'literal',
                    value: 'Total volatile solids',
                },
                variableMeasured: {
                    type: 'literal',
                    value: 'Total Coliform',
                },
                variableUnit: {
                    type: 'literal',
                    value: 'Undefined',
                },
                temporalCoverage: {
                    type: 'literal',
                    value: '2002-01-01/2002-12-31',
                },
                distributionName: {
                    type: 'literal',
                    value: 'USGS Oregon Water Science Center',
                },
                wkt: {
                    datatype: 'http://www.opengis.net/ont/geosparql#wktLiteral',
                    type: 'literal',
                    value: 'POINT(-123.082298 43.648455)',
                },
            },
        ],
    },
    meta: {
        'query-time-ms': 3386,
        'result-size-total': 86,
    },
};
