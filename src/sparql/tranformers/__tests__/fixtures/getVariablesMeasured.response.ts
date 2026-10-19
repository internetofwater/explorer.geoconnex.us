import { TRawGetVariablesMeasured } from '@/sparql/queries/getVariablesMeasured';
import { TGraphResponse } from '@/sparql/queries/types';

export const TEST_GET_VARIABLES_MEASURED_RESPONSE: TGraphResponse<TRawGetVariablesMeasured> =
    {
        head: {
            vars: ['variableMeasured', 'datasets'],
        },
        results: {
            bindings: [
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Temperature, water',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '23',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Coliform',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total dissolved solids',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total hardness',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Kjeldahl nitrogen',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Kjeldahl nitrogen (Organic N & NH3)',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Nitrogen, mixed forms',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Phosphorus, mixed forms',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Sample Weight',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total solids',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total suspended solids',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total volatile solids',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '22',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total carbon',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '21',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total nonfecal coliform',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '21',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Petroleum Hydrocarbons (C6-C32 TPH)',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '21',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total fixed solids',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '21',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Heptachloro Biphenyls',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '21',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total PCBs',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '21',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Pentachloro Biphenyls',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '20',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Nitrogen/Total Phosphorus Ratio (TN:TP)',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '20',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total microcystins plus nodularins',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '19',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Temperature, air',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '19',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Dioxin TEQ, Fish',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '19',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total xylenes',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '18',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Trichloro Biphenyls',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '18',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Particulate Organic Carbon',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '18',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Particulate Nitrogen',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '18',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Tetrachloro Biphenyls',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '17',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Sulfate',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '17',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Particulate Carbon',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '17',
                    },
                },
                {
                    variableMeasured: {
                        type: 'literal',
                        value: 'Total Hexachloro Biphenyls',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '16',
                    },
                },
            ],
        },
        meta: {
            'query-time-ms': 987,
            'result-size-total': 758,
        },
    };
