'use client';
import Map from '@/app/components/Map';
import React, { useEffect, useRef, useState } from 'react';
import {
    layerDefinitions,
    sourceConfigs,
    MAP_ID,
    SubLayerId,
    getLayerColor,
    LayerId,
    SourceId,
    BASEMAP,
    CLUSTER_TRANSITION_ZOOM,
    MAINSTEMS_SELECTED_COLOR,
    MAINSTEMS_SEARCH_COLOR,
    MAINSTEM_OPACITY_EXPRESSION,
    MAINSTEM_SMALL_LINE_WIDTH,
    MAINSTEM_MEDIUM_LINE_WIDTH,
    MAINSTEM_LARGE_LINE_WIDTH,
    MAINSTEM_VISIBLE_ZOOM,
} from '@/app/features/MainMap/config';
import { useMap } from '@/app/contexts/MapContexts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import {
    ExpressionSpecification,
    GeoJSONSource,
    LngLatBoundsLike,
    MapMouseEvent,
} from 'mapbox-gl';
import {
    fetchDatasets,
    getFilteredDatasets,
    reset,
    setFilter,
    setLayerVisibility,
    setLoading,
    setMapMoved,
    setSelectedMainstem,
    setSelectedMainstemBBOX,
} from '@/lib/state/main/slice';
import {
    createSummaryPoints,
    deleteSummaryPoints,
} from '@/app/features/MainMap/utils';
import * as turf from '@turf/turf';
import { MainstemData } from '@/app/types';
import debounce from 'lodash.debounce';

const INITIAL_CENTER: [number, number] = [-98.5795, 39.8282];
const INITIAL_ZOOM = 4;

type Props = {
    accessToken: string;
};
export const MainMap: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { map, persistentPopup, hoverPopup } = useMap(MAP_ID);
    const dispatch: AppDispatch = useDispatch();

    const {
        searchResultIds,
        visibleLayers,
        hoverId,
        selectedMainstem,
        selectedMainstemBBOX,
        loading,
    } = useSelector((state: RootState) => state.main);

    const selectedMainstemId = selectedMainstem?.id ?? null;

    const datasets = useSelector(getFilteredDatasets);

    const [reloadFlag, setReloadFlag] = useState(0);

    const previousClusterIds = useRef('');
    const isMounted = useRef(true);

    const handleMapMove = () => {
        if (isMounted.current) {
            dispatch(setMapMoved(Math.random()));
        }
    };

    const handleDatasetFetch = async (mainstemData: MainstemData) => {
        if (isMounted.current) {
            dispatch(
                setLoading({
                    item: 'datasets',
                    loading: true,
                })
            );
            dispatch(setSelectedMainstem(mainstemData));
            await dispatch(fetchDatasets(mainstemData.id));
            dispatch(
                setLoading({
                    item: 'datasets',
                    loading: false,
                })
            );
        }
    };

    const createSummaryLayer = () => {
        if (!map) {
            return;
        }

        const zoom = map.getZoom();
        if (zoom >= CLUSTER_TRANSITION_ZOOM) {
            const features = map.queryRenderedFeatures({
                layers: [SubLayerId.AssociatedDataClusters],
            });
            // Get unique ids
            const uniqueIds = new Set<number>(
                features.map(
                    (feature) => feature.properties!.cluster_id as number
                )
            );
            // Sort and convert to string
            const clusterIds = Array.from(uniqueIds).sort().join();
            // Check ids to prevent repeated spiderfy
            if (features.length && clusterIds !== previousClusterIds.current) {
                previousClusterIds.current = clusterIds;
                const source = map.getSource(
                    SourceId.AssociatedData
                ) as GeoJSONSource;

                createSummaryPoints(map, source, features).catch(
                    (error: ErrorEvent) =>
                        console.error(
                            'Unable to spiderify clusters: ',
                            clusterIds,
                            ', Error: ',
                            error
                        )
                );
            }
        }
    };

    const debouncedHandleMapMove = debounce(handleMapMove, 150);
    const debouncedCreateSummaryLayer = debounce(createSummaryLayer, 150);

    useEffect(() => {
        return () => {
            isMounted.current = false;
            debouncedHandleMapMove.cancel();
            debouncedCreateSummaryLayer.cancel();
        };
    }, []);

    useEffect(() => {
        if (!map) {
            return;
        }
        const handleInitialZoom = () => {
            const zoom = map.getZoom();
            if (zoom >= MAINSTEM_VISIBLE_ZOOM) {
                dispatch(
                    setLayerVisibility({
                        [SubLayerId.MainstemsSmall]: true,
                        [SubLayerId.MainstemsMedium]: true,
                        [SubLayerId.MainstemsLarge]: true,
                        [LayerId.MajorRivers]: false,
                    })
                );

                // Remove this listener after
                map.off('zoom', handleInitialZoom);
            }
        };

        map.on('zoom', handleInitialZoom);

        map.on('zoom', debouncedCreateSummaryLayer);

        map.on('drag', debouncedCreateSummaryLayer);

        map.loadImage('/dot-marker.png', (error, image) => {
            if (error) throw error;
            if (!image) {
                throw new Error('Image not found: dot-marker.png');
            }
            map.addImage('observation-point', image);
        });
        map.loadImage('/dot-marker-alt.png', (error, image) => {
            if (error) throw error;
            if (!image) {
                throw new Error('Image not found: dot-marker-alt.png');
            }
            map.addImage('observation-point-center', image);
        });

        map.on('error', function (e) {
            console.error('ERROR: ', e);
        });

        map.on(
            'click',
            [
                SubLayerId.MainstemsSmall,
                SubLayerId.MainstemsMedium,
                SubLayerId.MainstemsLarge,
            ],
            (e) => {
                const zoom = map.getZoom();
                if (zoom >= MAINSTEM_VISIBLE_ZOOM) {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: [
                            SubLayerId.MainstemsSmall,
                            SubLayerId.MainstemsMedium,
                            SubLayerId.MainstemsLarge,
                        ],
                    });

                    if (features.length) {
                        const feature = features[0];
                        if (feature.properties) {
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            window.history.replaceState(
                                {},
                                '',
                                `/mainstems/${feature.properties.id}`
                            );
                            void handleDatasetFetch(
                                feature.properties as MainstemData
                            );
                        }
                    }
                }
            }
        );
        map.on(
            'click',
            [
                LayerId.SummaryPoints,
                SubLayerId.SummaryPointsSiteName,
                SubLayerId.SummaryPointsTotal,
            ],
            (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: [LayerId.SummaryPoints],
                });

                if (features.length) {
                    const feature = features[0];
                    if (feature.properties) {
                        // eslint-disable-line @typescript-eslint/no-floating-promises
                        const siteNamesString = feature.properties
                            .siteNames as string;
                        const siteNames = siteNamesString.split(', ');
                        dispatch(setFilter({ siteNames }));
                    }
                }
            }
        );

        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: [
                    SubLayerId.MainstemsSmall,
                    SubLayerId.MainstemsMedium,
                    SubLayerId.MainstemsLarge,
                    SubLayerId.AssociatedDataClusters,
                    SubLayerId.AssociatedDataClusterCount,
                    LayerId.SummaryPoints,
                    // SubLayerId.AssociatedDataUnclustered,
                ],
            });
            const zoom = map.getZoom();
            if (!features.length || zoom < MAINSTEM_VISIBLE_ZOOM) {
                window.history.replaceState({}, '', '');
                deleteSummaryPoints(map);
                dispatch(reset());
            }
        });

        // Allow the user to zoom into a boundary once from page load
        const HUC2BoundaryClickListener = (e: MapMouseEvent) => {
            const feature = map.queryRenderedFeatures(e.point, {
                layers: [SubLayerId.HUC2BoundaryFill],
            })?.[0];
            if (feature) {
                const bbox = turf.bbox(feature) as LngLatBoundsLike;
                map.fitBounds(bbox);
            }
        };

        map.on('click', SubLayerId.HUC2BoundaryFill, HUC2BoundaryClickListener);

        map.on('moveend', debouncedHandleMapMove);
        map.on('zoomend', debouncedHandleMapMove);

        // Temp hack to force Vector Tile layers to reload without breaking cache
        map.on('style.load', () => {
            setReloadFlag(Math.random());
            if (!map.hasImage('observation-point')) {
                map.loadImage('dot-marker.png', (error, image) => {
                    if (error) throw error;
                    if (!image) {
                        throw new Error('Image not found: dot-marker.png');
                    }
                    map.addImage('observation-point', image);
                });
            }
            if (!map.hasImage('observation-point-center')) {
                map.loadImage('dot-marker-alt.png', (error, image) => {
                    if (error) throw error;
                    if (!image) {
                        throw new Error('Image not found: dot-marker.png');
                    }
                    map.addImage('observation-point-center', image);
                });
            }
        });
    }, [map]);

    useEffect(() => {
        if (!map || !persistentPopup || !hoverPopup) {
            return;
        }

        map.on('zoom', () => {
            const zoom = map.getZoom();
            if (zoom < CLUSTER_TRANSITION_ZOOM) {
                persistentPopup.remove();
            }
        });
    }, [map]);

    useEffect(() => {
        if (!map) {
            return;
        }
        // If actively searching
        if (searchResultIds.length) {
            const opacityExpression: ExpressionSpecification = [
                'case',
                ['in', ['get', 'id'], ['literal', searchResultIds]],
                1,
                0.3, // Not In List
            ];
            map.setPaintProperty(
                SubLayerId.MainstemsSmall,
                'line-opacity',
                opacityExpression
            );
            map.setPaintProperty(
                SubLayerId.MainstemsMedium,
                'line-opacity',
                opacityExpression
            );
            map.setPaintProperty(
                SubLayerId.MainstemsLarge,
                'line-opacity',
                opacityExpression
            );
            // Otherwise reset to original expression
        } else {
            map.setPaintProperty(
                SubLayerId.MainstemsSmall,
                'line-opacity',
                MAINSTEM_OPACITY_EXPRESSION
            );
            map.setPaintProperty(
                SubLayerId.MainstemsMedium,
                'line-opacity',
                MAINSTEM_OPACITY_EXPRESSION
            );
            map.setPaintProperty(
                SubLayerId.MainstemsLarge,
                'line-opacity',
                MAINSTEM_OPACITY_EXPRESSION
            );
        }

        map.setPaintProperty(SubLayerId.MainstemsSmall, 'line-color', [
            'case',
            ['==', ['get', 'id'], hoverId],
            MAINSTEMS_SELECTED_COLOR,
            ['==', ['get', 'id'], selectedMainstemId],
            MAINSTEMS_SELECTED_COLOR,
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            MAINSTEMS_SEARCH_COLOR,
            getLayerColor(SubLayerId.MainstemsSmall), // Not In List
        ]);

        map.setPaintProperty(SubLayerId.MainstemsMedium, 'line-color', [
            'case',
            ['==', ['get', 'id'], hoverId],
            MAINSTEMS_SELECTED_COLOR,
            ['==', ['get', 'id'], selectedMainstemId],
            MAINSTEMS_SELECTED_COLOR,
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            MAINSTEMS_SEARCH_COLOR,
            getLayerColor(SubLayerId.MainstemsMedium), // Not In List
        ]);

        map.setPaintProperty(SubLayerId.MainstemsLarge, 'line-color', [
            'case',
            ['==', ['get', 'id'], hoverId],
            MAINSTEMS_SELECTED_COLOR,
            ['==', ['get', 'id'], selectedMainstemId],
            MAINSTEMS_SELECTED_COLOR,
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            MAINSTEMS_SEARCH_COLOR,
            getLayerColor(SubLayerId.MainstemsLarge), // Not In List
        ]);

        map.setPaintProperty(SubLayerId.MainstemsSmall, 'line-blur', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            1,
            0,
        ]);

        map.setPaintProperty(SubLayerId.MainstemsMedium, 'line-blur', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            1,
            0,
        ]);

        map.setPaintProperty(SubLayerId.MainstemsLarge, 'line-blur', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            1,
            0,
        ]);

        map.setPaintProperty(SubLayerId.MainstemsSmall, 'line-width', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            4,
            MAINSTEM_SMALL_LINE_WIDTH,
        ]);

        map.setPaintProperty(SubLayerId.MainstemsMedium, 'line-width', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            4,
            MAINSTEM_MEDIUM_LINE_WIDTH,
        ]);

        map.setPaintProperty(SubLayerId.MainstemsLarge, 'line-width', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            4,
            MAINSTEM_LARGE_LINE_WIDTH,
        ]);

        // Allow selected feature in highlight layer
        if (selectedMainstemId) {
            map.setFilter(LayerId.MainstemsHighlight, [
                '==',
                ['get', 'id'],
                selectedMainstemId,
            ]);
        } else {
            map.setFilter(LayerId.MainstemsHighlight, [
                '==',
                ['get', 'id'],
                null,
            ]);
        }
    }, [searchResultIds, selectedMainstemId, hoverId]);

    useEffect(() => {
        if (!map || !datasets) {
            return;
        }

        if (!(loading.item === 'datasets' && loading.loading)) {
            dispatch(
                setLoading({
                    item: 'rendering',
                    loading: true,
                })
            );
        }
        const clusterSource = map.getSource(
            SourceId.AssociatedData
        ) as GeoJSONSource;

        if (clusterSource) {
            clusterSource.setData(datasets);
            const zoom = map.getZoom();
            // Listen for the 'idle' event to ensure the source has updated
            map.once('idle', () => {
                // There has been an update to filters, reflect this in declustered points
                if (zoom >= CLUSTER_TRANSITION_ZOOM) {
                    const features = map.queryRenderedFeatures({
                        layers: [SubLayerId.AssociatedDataClusters],
                    });
                    // Get unique ids
                    const uniqueIds = new Set<number>(
                        features.map(
                            (feature) =>
                                feature.properties!.cluster_id as number
                        )
                    );
                    // Sort and convert to string
                    const clusterIds = Array.from(uniqueIds).sort().join();
                    // Check ids to prevent repeated spiderfy
                    if (features.length) {
                        createSummaryPoints(map, clusterSource, features).catch(
                            (error: ErrorEvent) =>
                                console.error(
                                    'Unable to spiderify clusters: ',
                                    clusterIds,
                                    ', Error: ',
                                    error
                                )
                        );
                    }
                }
                if (!(loading.item === 'datasets' && loading.loading)) {
                    dispatch(
                        setLoading({
                            item: 'rendering',
                            loading: false,
                        })
                    );
                }
            });
        }
    }, [datasets]);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (selectedMainstemBBOX) {
            dispatch(
                setLoading({
                    item: 'datasets',
                    loading: true,
                })
            );
            map.fitBounds(selectedMainstemBBOX);

            const handleMoveEnd = () => {
                // Give a slight delay to allow move events to process
                const loadEndTimeout = setTimeout(() => {
                    dispatch(
                        setLoading({
                            item: 'datasets',
                            loading: false,
                        })
                    );
                }, 250);

                return () => clearTimeout(loadEndTimeout);
            };

            map.once('moveend', handleMoveEnd);
            dispatch(setSelectedMainstemBBOX(null));
        }
    }, [selectedMainstemBBOX]);

    useEffect(() => {
        if (!map) {
            return;
        }

        Object.entries(visibleLayers).forEach(([layerId, visible]) => {
            if (map.getLayer(layerId)) {
                const newVisibility = visible ? 'visible' : 'none';

                map?.setLayoutProperty(layerId, 'visibility', newVisibility);
            }
        });
    }, [reloadFlag, visibleLayers]);

    return (
        <>
            <Map
                accessToken={accessToken}
                id={MAP_ID}
                sources={sourceConfigs}
                layers={layerDefinitions}
                options={{
                    style: BASEMAP,
                    center: INITIAL_CENTER,
                    zoom: INITIAL_ZOOM,
                    maxZoom: 20,
                }}
                controls={{
                    scaleControl: true,
                    navigationControl: true,
                }}
            />
        </>
    );
};

export default MainMap;
