import { TRawGetDistributionNames } from '@/sparql/queries/getDistributionNames';
import { TGraphResponse } from '@/sparql/queries/types';

export const TEST_GET_DISTRIBUTION_NAMES: TGraphResponse<TRawGetDistributionNames> =
    {
        head: {
            vars: ['distributionName', 'datasets'],
        },
        results: {
            bindings: [
                {
                    distributionName: {
                        type: 'literal',
                        value: 'Department of Environmental Quality - State of Oregon',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '1198',
                    },
                },
                {
                    distributionName: {
                        type: 'literal',
                        value: 'EPA National Aquatic Resources Survey (NARS)',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '543',
                    },
                },
                {
                    distributionName: {
                        type: 'literal',
                        value: 'Adventure Scientists (Volunteer)*',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '45',
                    },
                },
                {
                    distributionName: {
                        type: 'literal',
                        value: 'USGS Oregon Water Science Center',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '39',
                    },
                },
                {
                    distributionName: {
                        type: 'literal',
                        value: 'U.S. Geological Survey',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '13',
                    },
                },
                {
                    distributionName: {
                        type: 'literal',
                        value: 'USDA FS AREMP - Aquatic and Riparian Effectiveness Monitoring Program',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '12',
                    },
                },
                {
                    distributionName: {
                        type: 'literal',
                        value: 'North American Lake Management Society',
                    },
                    datasets: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '4',
                    },
                },
            ],
        },
        meta: {
            'query-time-ms': 56,
            'result-size-total': 7,
        },
    };
