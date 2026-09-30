import { useAppSelector } from '@/lib/state/hooks';
import store from '@/lib/state/store';
import { bbox } from '@turf/turf';
import { LngLatBoundsLike, Map } from 'mapbox-gl';
import { useEffect } from 'react';

export const useDatasetFit = (map: Map | null) => {
    const request = useAppSelector((state) => state.mainstem.request);
    const selected = useAppSelector((state) => state.mainstem.selected);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (selected && selected.id === request.id) {
            const datasetCollection = store.getState().main.datasets;
            const bounds = bbox(datasetCollection) as LngLatBoundsLike;

            map.fitBounds(bounds, {
                padding: {
                    top: 20,
                    left: 40,
                    right: 20,
                    bottom: 20,
                },
            });
        }
    }, [request]);
};
