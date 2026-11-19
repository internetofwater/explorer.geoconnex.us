import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import {
    InitialState,
    MODE,
    setLayerVisibility,
    setView,
} from '@/lib/state/main/slice';
import { useEffect, useState } from 'react';
import {
    getLayerColor,
    LayerId,
    MAP_ID,
    SubLayerId,
} from '../features/MainMap/config';
import { useMap } from '../contexts/MapContexts';
import { LngLatBoundsLike } from 'mapbox-gl';
import { MainstemData } from '../types';
import { setSelected } from '@/lib/state/mainstem/slice';

export const useModeSwitcher = () => {
    const mode = useAppSelector((s) => s.main.mode);
    const visibleLayers = useAppSelector((s) => s.main.visibleLayers);
    const selected = useAppSelector((s) => s.mainstem.selected);

    const [savedVisibleLayers, setSavedVisibleLayers] = useState<
        InitialState['visibleLayers'] | null
    >(null);
    const [savedSelected, setSavedSelected] = useState<MainstemData | null>(
        null
    );

    const dispatch = useAppDispatch();

    const { map, persistentPopup } = useMap(MAP_ID);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (persistentPopup) {
            persistentPopup.remove();
        }

        const persistRiverRunnerStyles = () => {
            if (map.getLayer(LayerId.MajorRivers)) {
                map.setPaintProperty(
                    LayerId.MajorRivers,
                    'line-color',
                    '#00A087'
                );
            }

            if (map.getLayer(LayerId.HUC2Boundaries)) {
                map.setPaintProperty(
                    LayerId.HUC2Boundaries,
                    'line-opacity',
                    0.6
                );
            }
        };

        if (mode === MODE.RiverRunner) {
            dispatch(setView('map'));

            setSavedVisibleLayers(visibleLayers);
            dispatch(
                setLayerVisibility({
                    [LayerId.MajorRivers]: true,
                    [LayerId.HUC2Boundaries]: true,
                    [LayerId.Mainstems]: false,
                    [SubLayerId.HUC2BoundaryLabels]: false,
                    [LayerId.AssociatedData]: false,
                    [SubLayerId.AssociatedDataClusterCount]: false,
                    [SubLayerId.AssociatedDataClusters]: false,
                    [SubLayerId.AssociatedDataUnclustered]: false,
                })
            );

            setSavedSelected(selected);
            dispatch(setSelected(null));

            if (map) {
                if (map.getLayer(LayerId.States)) {
                    map.setLayoutProperty(
                        LayerId.States,
                        'visibility',
                        'visible'
                    );
                }
                if (map.getLayer(LayerId.MainstemsHighlight)) {
                    map.setLayoutProperty(
                        LayerId.MainstemsHighlight,
                        'visibility',
                        'none'
                    );
                }

                if (map.getLayer(LayerId.MajorRivers)) {
                    map.setPaintProperty(
                        LayerId.MajorRivers,
                        'line-color',
                        '#00A087'
                    );
                }

                if (map.getLayer(LayerId.HUC2Boundaries)) {
                    map.setPaintProperty(
                        LayerId.HUC2Boundaries,
                        'line-opacity',
                        0.6
                    );
                }

                map.on('style.load', persistRiverRunnerStyles);
            }

            // toggle off unneeded layers
            // restrict bounds
            // enable hidden us state layer
        } else if (mode === MODE.Mainstems) {
            if (savedVisibleLayers) {
                dispatch(setLayerVisibility(savedVisibleLayers));
            }

            if (savedSelected) {
                dispatch(setSelected(savedSelected));
            }

            if (map) {
                if (map.getLayer(LayerId.States)) {
                    map.setLayoutProperty(LayerId.States, 'visibility', 'none');
                }

                if (map.getLayer(LayerId.MainstemsHighlight)) {
                    map.setLayoutProperty(
                        LayerId.MainstemsHighlight,
                        'visibility',
                        'visible'
                    );
                }

                if (map.getLayer(LayerId.MajorRivers)) {
                    map.setPaintProperty(
                        LayerId.MajorRivers,
                        'line-color',
                        getLayerColor(LayerId.MajorRivers)
                    );
                }

                if (map.getLayer(LayerId.HUC2Boundaries)) {
                    map.setPaintProperty(
                        LayerId.HUC2Boundaries,
                        'line-opacity',
                        1
                    );
                }

                const hasMaxBounds = map.getMaxBounds() !== null;
                if (hasMaxBounds) {
                    // This function accepts null and undefined but is typed poorly
                    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setmaxbounds
                    map.setMaxBounds(null as unknown as LngLatBoundsLike);
                }
            }
        }

        return () => {
            map.off('style.load', persistRiverRunnerStyles);
        };
    }, [mode, map]);
};
