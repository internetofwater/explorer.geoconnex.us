'use client';
import Map from '@/app/components/Map';
import React, { useEffect, useRef, useState } from 'react';
import {
    layerDefinitions,
    sourceConfigs,
    MAP_ID,
    SubLayerId,
    LayerId,
    SourceId,
    BASEMAP,
    MAINSTEMS_SELECTED_COLOR,
    MAINSTEMS_SEARCH_COLOR,
} from '@/app/features/MainMap/config';
import { useMap } from '@/app/contexts/MapContexts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/state/store';
import {
    ExpressionSpecification,
    GeoJSONSource,
    LngLatBoundsLike,
    MapMouseEvent,
    Map as MapboxGLMap,
} from 'mapbox-gl';
import {
    getFilteredDatasets,
    setFilter,
    setLayerVisibility,
    setMapMoved,
} from '@/lib/state/main/slice';
import { createSummaryPoints } from '@/app/features/MainMap/utils';
import * as turf from '@turf/turf';
import { MainstemData } from '@/app/types';
import debounce from 'lodash.debounce';
import { loadingManager } from '@/managers/init';
import { LoadingType } from '@/lib/state/loading/types';
import { useAppSelector } from '@/lib/state/hooks';
import { setBBox, setTarget } from '@/lib/state/mainstem/slice';
import { useDatasetFit } from '@/app/hooks/useDatasetFit';
import { Feature, Point } from 'geojson';
import {
    CLUSTER_TRANSITION_ZOOM,
    MAINSTEM_COLOR_EXPRESSION,
    MAINSTEM_OPACITY_EXPRESSION,
    MAINSTEM_VISIBLE_ZOOM,
    MAINSTEM_WIDTH_EXPRESSION,
} from './consts';

const INITIAL_CENTER: [number, number] = [-98.5795, 39.8282];
const INITIAL_ZOOM = 4;

type Props = {
    accessToken: string;
};

/**
 * This component renders the main map for the application, allowing users to interact with all layers defined in config.tsx.
 * It handles all map events that interact with redux state, including clicks on mainstem and updates to the data in the cluster layer.
 *
 * Props:
 * - accessToken: string - The access token for the map service.
 *
 * @component
 */
export const MainMap: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { map, persistentPopup, hoverPopup } = useMap(MAP_ID);
    const dispatch: AppDispatch = useDispatch();

    const {
        searchResultIds,
        visibleLayers,
        hoverId,
        selectedBasemap,
        geocoderResult,
    } = useAppSelector((state) => state.main);

    const selected = useAppSelector((state) => state.mainstem.selected);
    const bbox = useAppSelector((state) => state.mainstem.bbox);

    const selectedMainstemId = selected?.id ?? null;

    const datasets = useSelector(getFilteredDatasets);

    useDatasetFit(map);

    const [reloadFlag, setReloadFlag] = useState(0);

    const previousClusterIds = useRef('');
    const isMounted = useRef(true);

    const handleMapMove = () => {
        if (isMounted.current) {
            dispatch(setMapMoved(Date.now()));
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
                const source = map.getSource<GeoJSONSource>(
                    SourceId.AssociatedData
                );

                if (source) {
                    const loadingInstance = loadingManager.add(
                        'Creating summary points',
                        LoadingType.SummaryPoints
                    );
                    createSummaryPoints(map, source, features)
                        .catch((error: ErrorEvent) =>
                            console.error(
                                'Unable to create summary points for clusters: ',
                                clusterIds,
                                ', Error: ',
                                error
                            )
                        )
                        .finally(() => {
                            loadingManager.remove(loadingInstance);
                        });
                }
            }
        }
    };

    const waitForClusters = (
        map: MapboxGLMap,
        sourceId: string
    ): Promise<Feature[]> =>
        new Promise((resolve) => {
            const check = () => {
                const features = map
                    .querySourceFeatures(sourceId)
                    .filter((f) => f.properties?.cluster);

                if (features.length > 0) {
                    resolve(features);
                    return;
                }

                map.once('render', check);
            };

            check();
        });

    const loadDatasets = () => {
        if (!map || !datasets) {
            return;
        }

        const loadingInstance = loadingManager.add(
            'Updating dataset cluster layer',
            LoadingType.Rendering
        );

        const clusterSource = map.getSource<GeoJSONSource>(
            SourceId.AssociatedData
        );

        if (clusterSource) {
            clusterSource.setData(datasets);
            clusterSource.setData(datasets);
            void waitForClusters(map, SourceId.AssociatedData)
                .then((features) => {
                    const loadingInstance = loadingManager.add(
                        'Creating summary points',
                        LoadingType.SummaryPoints
                    );
                    createSummaryPoints(
                        map,
                        clusterSource,
                        features as Feature<Point>[]
                    )
                        .catch((error: ErrorEvent) =>
                            console.error(
                                'Unable to create summary points, Error: ',
                                error
                            )
                        )
                        .finally(() => {
                            // Summary points instance
                            loadingManager.remove(loadingInstance);
                        });
                })
                .finally(() => {
                    // Cluster source update instance
                    loadingManager.remove(loadingInstance);
                });
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
                        [LayerId.Mainstems]: true,
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

        map.on('click', [LayerId.Mainstems, SubLayerId.MainstemsGhost], (e) => {
            const zoom = map.getZoom();
            if (
                zoom >= MAINSTEM_VISIBLE_ZOOM &&
                !e.originalEvent.defaultPrevented
            ) {
                e.originalEvent.preventDefault();
                e.originalEvent.cancelBubble = true;

                const features = map.queryRenderedFeatures(e.point, {
                    layers: [LayerId.Mainstems, SubLayerId.MainstemsGhost],
                });

                if (features.length) {
                    const feature = features[0];
                    if (feature.properties) {
                        window.history.replaceState(
                            {},
                            '',
                            `/mainstems/${feature.properties.id}`
                        );
                        dispatch(setTarget(feature.properties as MainstemData));
                    }
                }
            }
        });
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

        // map.on('click', (e) => {
        //     const features = map.queryRenderedFeatures(e.point, {
        //         layers: [
        //             SubLayerId.MainstemsSmall,
        //             SubLayerId.MainstemsMedium,
        //             SubLayerId.MainstemsLarge,
        //             SubLayerId.AssociatedDataClusters,
        //             SubLayerId.AssociatedDataClusterCount,
        //             LayerId.SummaryPoints,
        //         ],
        //     });
        //     const zoom = map.getZoom();

        //     if (!features.length || zoom < MAINSTEM_VISIBLE_ZOOM) {
        //         window.history.replaceState({}, '', window.location.origin);
        //         deleteSummaryPoints(map);
        //         dispatch(reset());
        //         dispatch(mainstemReset());
        //     }
        // });

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
            setReloadFlag(Date.now());
            if (!map.hasImage('observation-point')) {
                map.loadImage('/dot-marker.png', (error, image) => {
                    if (error) throw error;
                    if (!image) {
                        throw new Error('Image not found: dot-marker.png');
                    }
                    map.addImage('observation-point', image);
                });
            }
            if (!map.hasImage('observation-point-center')) {
                map.loadImage('/dot-marker-alt.png', (error, image) => {
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
                LayerId.Mainstems,
                'line-opacity',
                opacityExpression
            );
            // Otherwise reset to original expression
        } else {
            map.setPaintProperty(
                LayerId.Mainstems,
                'line-opacity',
                MAINSTEM_OPACITY_EXPRESSION
            );
        }

        map.setPaintProperty(LayerId.Mainstems, 'line-color', [
            'case',
            ['==', ['get', 'id'], hoverId],
            MAINSTEMS_SELECTED_COLOR,
            ['==', ['get', 'id'], selectedMainstemId],
            MAINSTEMS_SELECTED_COLOR,
            ['in', ['get', 'id'], ['literal', searchResultIds]],
            MAINSTEMS_SEARCH_COLOR,
            MAINSTEM_COLOR_EXPRESSION,
        ]);

        map.setPaintProperty(LayerId.Mainstems, 'line-blur', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            1,
            0,
        ]);

        map.setPaintProperty(LayerId.Mainstems, 'line-width', [
            'case',
            ['==', ['get', 'id'], selectedMainstemId],
            4,
            MAINSTEM_WIDTH_EXPRESSION,
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
    }, [searchResultIds, selectedMainstemId, hoverId, reloadFlag]);

    useEffect(() => {
        loadDatasets();
    }, [reloadFlag, datasets]);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (bbox) {
            const loadingInstance = loadingManager.add(
                'Fitting map instance to mainstem',
                LoadingType.Rendering
            );

            map.fitBounds(bbox);

            const handleMoveEnd = () => {
                // Give a slight delay to allow move events to process
                const loadEndTimeout = setTimeout(() => {
                    loadingManager.remove(loadingInstance);
                }, 250);

                return () => clearTimeout(loadEndTimeout);
            };

            map.once('moveend', handleMoveEnd);
            dispatch(setBBox(null));
        }
    }, [bbox]);

    useEffect(() => {
        if (!map) {
            return;
        }

        map.setStyle(selectedBasemap);
    }, [selectedBasemap]);

    useEffect(() => {
        if (!map) {
            return;
        }

        Object.entries(visibleLayers).forEach(([layerId, visible]) => {
            if (map.getLayer(layerId)) {
                const newVisibility = visible ? 'visible' : 'none';

                map.setLayoutProperty(layerId, 'visibility', newVisibility);
                if ([LayerId.Mainstems].includes(layerId as LayerId)) {
                    const ghostLayerId = layerId + '-ghost';
                    map.setLayoutProperty(
                        ghostLayerId,
                        'visibility',
                        newVisibility
                    );
                }
            }
        });
    }, [reloadFlag, visibleLayers]);

    useEffect(() => {
        if (!map) {
            return;
        }

        const source = map.getSource(SourceId.GeocoderResult) as GeoJSONSource;

        if (!source) {
            return;
        }

        const feature = geocoderResult?.feature;

        source.setData({
            type: 'FeatureCollection',
            features: feature ? [feature] : [],
        });
    }, [map, geocoderResult, reloadFlag]);

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
