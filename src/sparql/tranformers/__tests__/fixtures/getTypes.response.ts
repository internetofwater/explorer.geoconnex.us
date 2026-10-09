import { TRawGetTypes } from '@/sparql/queries/getTypes';
import { TGraphResponse } from '@/sparql/queries/types';

export const TEST_GET_TOTAL_TYPES_RESPONSE: TGraphResponse<TRawGetTypes> = {
    head: {
        vars: ['type', 'datasets'],
    },
    results: {
        bindings: [
            {
                type: {
                    type: 'literal',
                    value: 'Lake',
                },
                datasets: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#int',
                    type: 'literal',
                    value: '1691',
                },
            },
            {
                type: {
                    type: 'literal',
                    value: 'River/Stream',
                },
                datasets: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#int',
                    type: 'literal',
                    value: '103',
                },
            },
            {
                type: {
                    type: 'literal',
                    value: 'Stream',
                },
                datasets: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#int',
                    type: 'literal',
                    value: '66',
                },
            },
            {
                type: {
                    type: 'literal',
                    value: 'Facility Municipal Sewage (POTW)',
                },
                datasets: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#int',
                    type: 'literal',
                    value: '6',
                },
            },
            {
                type: {
                    type: 'literal',
                    value: 'Facility Public Water Supply (PWS)',
                },
                datasets: {
                    datatype: 'http://www.w3.org/2001/XMLSchema#int',
                    type: 'literal',
                    value: '2',
                },
            },
        ],
    },
    meta: {
        'query-time-ms': 17,
        'result-size-total': 5,
    },
};
