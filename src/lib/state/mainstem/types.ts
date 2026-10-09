import type { MainstemData } from '@/app/types';
import type { TDatasetCount } from '@/sparql/queries/getDatasetCount';
import { TDistributionNames } from '@/sparql/queries/getDistributionNames';
import type { TTotalSites } from '@/sparql/queries/getTotalSites';
import type { TTypes } from '@/sparql/queries/getTypes';
import type { TVariablesMeasured } from '@/sparql/queries/getVariablesMeasured';
import type { LngLatBoundsLike } from 'mapbox-gl';

export type TMainstemMetrics = {
    id: string;
    name: string;
    length: number;
    datasetCount: TDatasetCount;
    totalSites: TTotalSites;
    variables: TVariablesMeasured;
    distributionNames: TDistributionNames;
    types: TTypes;
};

export type TMainstemRequest = {
    id: string;
    variables: string[];
    types: string[];
    distributionNames: string[];
};

export type TInitialState = {
    target: MainstemData | null;
    selected: MainstemData | null;
    request: TMainstemRequest;
    bbox: LngLatBoundsLike | null;
    metrics: TMainstemMetrics | null;
};

export const initialState: TInitialState = {
    target: null,
    selected: null,
    request: {
        id: 'default',
        variables: [],
        types: [],
        distributionNames: [],
    },
    bbox: null,
    metrics: null,
};
