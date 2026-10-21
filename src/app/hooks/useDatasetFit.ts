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

            if (datasetCollection.features.length > 0) {
                const bounds = bbox(datasetCollection) as LngLatBoundsLike;

                // Mock the camera to keep camera bounds in line with user visible bounds
                const easingOptions = map.cameraForBounds(bounds, {
                    padding: {
                        top: 180,
                        left: 180,
                        right: 60,
                        bottom: 60,
                    },
                });

                if (easingOptions) {
                    map.easeTo(easingOptions);
                }
            }
        }
    }, [request]);
};
