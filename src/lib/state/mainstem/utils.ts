import { MainstemData, Dataset } from '@/app/types';
import { Feature, Geometry } from 'geojson';
import { TMainstemRequest } from './types';

type FetchDatasetsSuccess = Feature<
    Geometry,
    Omit<MainstemData, 'id'> & { datasets?: Dataset[] }
>;
type FetchDatasetsNotFound = {
    code: string;
    type: string;
    description: string;
};

export const isFetchDatasetsSuccess = (
    payload: FetchDatasetsSuccess | FetchDatasetsNotFound
): payload is FetchDatasetsSuccess => {
    return Boolean(payload && (payload as FetchDatasetsSuccess).properties);
};

export const getDefaultRequest = (): TMainstemRequest => ({
    id: 'default',
    variableMeasuredURIs: [],
});
