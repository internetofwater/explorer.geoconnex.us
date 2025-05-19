import { BasemapId, Basemaps } from '@/app/components/Map/types';

export const basemaps: Basemaps = {
    [BasemapId.Standard]: 'mapbox://styles/mapbox/standard',
    [BasemapId.Streets]: 'mapbox://styles/mapbox/streets-v12',
    [BasemapId.Light]: 'mapbox://styles/mapbox/light-v11',
    [BasemapId.Dark]: 'mapbox://styles/mapbox/dark-v11',
    [BasemapId.Satellite]: 'mapbox://styles/mapbox/satellite-v9',
    [BasemapId.SatelliteStreets]:
        'mapbox://styles/mapbox/satellite-streets-v12',
};
