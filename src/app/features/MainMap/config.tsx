import {
    BasemapId,
    CustomListenerFunction,
    LayerType,
    MainLayerDefinition,
    SourceConfig,
    Sources,
} from '@/app/components/Map/types';
import { Feature, LineString, Point } from 'geojson';
import {
    DataDrivenPropertyValueSpecification,
    ExpressionSpecification,
    GeoJSONSource,
    LayerSpecification,
    Map,
    Popup,
} from 'mapbox-gl';
import { defaultGeoJson } from '@/lib/state/utils';
import {
    hasPeristentPopupOpenToThisItem,
    spiderfyClusters,
} from '@/app/features/MainMap/utils';
import { basemaps } from '@/app/components/Map/consts';

export const MAP_ID = 'main';

export const BASEMAP = basemaps[BasemapId.Dark];

export enum SourceId {
    Mainstems = 'mainstems',
    MajorRivers = 'major-rivers-source',
    HUC2Boundaries = 'hu02',
    AssociatedData = 'associated-data-source',
    Spiderify = 'spiderify',
}

export enum LayerId {
    Mainstems = 'mainstems-layer',
    HUC2Boundaries = 'huc-2-boundaries',
    MajorRivers = 'major-rivers',
    AssociatedData = 'associated-data',
    SpiderifyPoints = 'spiferified-clusters',
    MainstemsHighlight = 'mainstems-highlight',
}

export enum SubLayerId {
    MainstemsSmall = 'mainstems-small',
    MainstemsMedium = 'mainstems-medium',
    MainstemsLarge = 'mainstems-large',
    HUC2BoundaryLabels = 'huc-2-boundaries-labels',
    HUC2BoundaryFill = 'huc-2-boundaries-Fill',
    AssociatedDataClusters = 'associated-data-clusters',
    AssociatedDataClusterCount = 'associated-data-cluster-count',
    AssociatedDataUnclustered = 'associated-data-unclustered-point',
}
export const allLayerIds = [
    ...Object.values(LayerId),
    ...Object.values(SubLayerId),
];

export const CLUSTER_TRANSITION_ZOOM = 14;
export const MAINSTEM_DRAINAGE_SMALL = 160;
export const MAINSTEM_DRAINAGE_MEDIUM = 1600;
export const MAINSTEM_SMALL_LINE_WIDTH = 3;
export const MAINSTEM_MEDIUM_LINE_WIDTH = 4;
export const MAINSTEM_LARGE_LINE_WIDTH = 6;

export const MAINSTEM_OPACITY_EXPRESSION: ExpressionSpecification = [
    'step',
    ['zoom'],
    0.3,
    6,
    0.8,
];

/**********************************************************************
 * Define the various datasources this map will use
 **********************************************************************/
export const sourceConfigs: SourceConfig[] = [
    {
        id: SourceId.Mainstems,
        type: Sources.VectorTile,
        definition: {
            type: 'vector',
            tiles: [
                `https://reference.geoconnex.us/collections/mainstems/tiles/WebMercatorQuad/{z}/{x}/{y}?f=mvt`,
            ],
            minzoom: 0,

            maxzoom: 10,
            tileSize: 512,
            bounds: [-124.707777, 25.190876, -67.05824, 49.376613],
        },
    },
    {
        id: SourceId.AssociatedData,
        type: Sources.GeoJSON,
        definition: {
            type: 'geojson',
            data: defaultGeoJson,
            cluster: true,
            clusterMaxZoom: 20, // Max zoom to cluster points on
            clusterRadius: 50,
        },
    },
    {
        id: SourceId.HUC2Boundaries,
        type: Sources.VectorTile,
        definition: {
            type: 'vector',
            tiles: [
                `https://reference.geoconnex.us/collections/hu02/tiles/WebMercatorQuad/{z}/{x}/{y}?f=mvt`,
            ],
            minzoom: 0,

            maxzoom: 10,
            tileSize: 512,
            bounds: [-179.229468, -14.42442, 179.856484, 71.439451],
        },
    },
    {
        id: SourceId.Spiderify,
        type: Sources.GeoJSON,
        definition: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [],
            },
            cluster: false,
        },
    },
];

/**********************************************************************
 * Create helper functions to group layer logic
 **********************************************************************/

export const getLayerName = (layerId: LayerId | SubLayerId): string => {
    switch (layerId) {
        case LayerId.Mainstems:
            return 'Mainstems'; // TODO determine if names are accurate
        case SubLayerId.MainstemsSmall:
            return 'Small'; // TODO determine if names are accurate
        case SubLayerId.MainstemsMedium:
            return 'Medium'; // TODO determine if names are accurate
        case SubLayerId.MainstemsLarge:
            return 'Large'; // TODO determine if names are accurate
        case LayerId.MajorRivers:
            return 'Major Rivers'; // TODO determine if names are accurate
        case LayerId.HUC2Boundaries:
            return 'HUC2 Boundaries'; // TODO determine if names are accurate
        case SubLayerId.HUC2BoundaryLabels:
            return 'Labels'; // TODO determine if names are accurate
        case SubLayerId.HUC2BoundaryFill:
            return 'HUC2 Boundaries'; // TODO determine if names are accurate
        case LayerId.AssociatedData:
            return 'Associated Data'; // TODO determine if names are accurate
        case SubLayerId.AssociatedDataClusters:
            return 'Dataset Clusters';
        default:
            return '';
    }
};

export const MAINSTEMS_SEARCH_COLOR = '#FAC60F';
export const MAINSTEMS_SELECTED_COLOR = '#F500FF';

// Define the palette in a shared location
export const getLayerColor = (
    id: LayerId | SubLayerId
): DataDrivenPropertyValueSpecification<string> => {
    switch (id) {
        case LayerId.Mainstems:
            return '#7A9939';
        case SubLayerId.MainstemsSmall:
            return '#00BFFF';
        case SubLayerId.MainstemsMedium:
            return '#30D5C8';
        case SubLayerId.MainstemsLarge:
            return '#6A8DFF';
        case LayerId.MajorRivers:
            return '#536663';
        case LayerId.HUC2Boundaries:
            return '#FFF';
        case LayerId.AssociatedData:
            return ''; // Special case, no parent layer def
        case SubLayerId.AssociatedDataClusters:
            return [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                5,
                '#f1f075',
                10,
                '#f28cb1',
            ];
        case SubLayerId.AssociatedDataClusterCount:
            return '#000';
        case SubLayerId.AssociatedDataUnclustered:
            return '#11b4da';
        case LayerId.SpiderifyPoints:
            return '#46AB9D';
        default:
            return '#FFF';
    }
};

// Group layer and sublayer configurations together
export const getLayerConfig = (
    id: LayerId | SubLayerId
): null | LayerSpecification => {
    switch (id) {
        case LayerId.Mainstems:
            return null;
        case SubLayerId.MainstemsSmall:
            return {
                id: SubLayerId.MainstemsSmall,
                type: LayerType.Line,
                source: SourceId.Mainstems,
                'source-layer': SourceId.Mainstems,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    visibility: 'none',
                },
                filter: [
                    '<',
                    ['get', 'outlet_drainagearea_sqkm'],
                    MAINSTEM_DRAINAGE_SMALL,
                ],
                paint: {
                    'line-opacity': MAINSTEM_OPACITY_EXPRESSION,
                    'line-color': getLayerColor(SubLayerId.MainstemsSmall),
                    'line-width': MAINSTEM_SMALL_LINE_WIDTH,
                },
            };
        case SubLayerId.MainstemsMedium:
            return {
                id: SubLayerId.MainstemsMedium,
                type: LayerType.Line,
                source: SourceId.Mainstems,
                'source-layer': SourceId.Mainstems,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    visibility: 'none',
                },
                filter: [
                    'all',
                    [
                        '>=',
                        ['get', 'outlet_drainagearea_sqkm'],
                        MAINSTEM_DRAINAGE_SMALL,
                    ],
                    [
                        '<',
                        ['get', 'outlet_drainagearea_sqkm'],
                        MAINSTEM_DRAINAGE_MEDIUM,
                    ],
                ],
                paint: {
                    'line-opacity': MAINSTEM_OPACITY_EXPRESSION,
                    'line-color': getLayerColor(SubLayerId.MainstemsMedium),
                    'line-width': MAINSTEM_MEDIUM_LINE_WIDTH,
                },
            };
        case SubLayerId.MainstemsLarge:
            return {
                id: SubLayerId.MainstemsLarge,
                type: LayerType.Line,
                source: SourceId.Mainstems,
                'source-layer': SourceId.Mainstems,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    visibility: 'none',
                },
                filter: [
                    '>=',
                    ['get', 'outlet_drainagearea_sqkm'],
                    MAINSTEM_DRAINAGE_MEDIUM,
                ],
                paint: {
                    'line-opacity': MAINSTEM_OPACITY_EXPRESSION,
                    'line-color': getLayerColor(SubLayerId.MainstemsLarge),
                    'line-width': MAINSTEM_LARGE_LINE_WIDTH,
                },
            };
        case LayerId.MainstemsHighlight:
            return {
                id: LayerId.MainstemsHighlight,
                type: LayerType.Line,
                source: SourceId.Mainstems,
                'source-layer': SourceId.Mainstems,
                // Filter all features out by default
                filter: ['==', ['get', 'id'], null],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                    visibility: 'visible',
                },
                paint: {
                    'line-width': 12,
                    'line-blur': 3,
                    'line-color': MAINSTEMS_SELECTED_COLOR,
                },
            };
        case LayerId.MajorRivers:
            return {
                id: LayerId.MajorRivers,
                type: LayerType.Line,
                source: SourceId.Mainstems,
                'source-layer': SourceId.Mainstems,
                filter: ['>=', ['get', 'outlet_drainagearea_sqkm'], 50000],
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': ['step', ['zoom'], 0.6, 7, 0.1],
                    'line-color': getLayerColor(LayerId.MajorRivers),
                    'line-width': 4,
                },
            };
        case LayerId.HUC2Boundaries:
            return {
                id: LayerId.HUC2Boundaries,
                type: LayerType.Line,
                source: SourceId.HUC2Boundaries,
                'source-layer': SourceId.HUC2Boundaries,
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                },
                paint: {
                    'line-opacity': ['step', ['zoom'], 0.8, 7, 0.1],
                    'line-color': getLayerColor(LayerId.HUC2Boundaries),
                    'line-width': 2,
                },
            };
        case SubLayerId.HUC2BoundaryLabels:
            return {
                id: SubLayerId.HUC2BoundaryLabels,
                type: LayerType.Symbol,
                source: SourceId.HUC2Boundaries,
                'source-layer': SourceId.HUC2Boundaries,
                layout: {
                    'text-field': ['get', 'NAME'],
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-radial-offset': 0.25,

                    'text-size': 18,
                    'text-justify': 'auto',
                },
                paint: {
                    'text-color': getLayerColor(LayerId.HUC2Boundaries),
                    'text-opacity': 0,
                },
            };
        case SubLayerId.HUC2BoundaryFill:
            return {
                id: SubLayerId.HUC2BoundaryFill,
                type: LayerType.Fill,
                source: SourceId.HUC2Boundaries,
                'source-layer': SourceId.HUC2Boundaries,
                paint: {
                    'fill-color': '#000',
                    'fill-opacity': 0,
                },
            };
        case LayerId.AssociatedData:
            return null;
        case SubLayerId.AssociatedDataClusters:
            return {
                id: SubLayerId.AssociatedDataClusters,
                type: LayerType.Circle,
                source: SourceId.AssociatedData,
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': getLayerColor(
                        SubLayerId.AssociatedDataClusters
                    ),
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        5,
                        30,
                        10,
                        40,
                    ],
                },
            };
        case SubLayerId.AssociatedDataClusterCount:
            return {
                id: SubLayerId.AssociatedDataClusterCount,
                type: LayerType.Symbol,
                source: SourceId.AssociatedData,
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                    'text-size': 12,
                },
                paint: {
                    'text-color': getLayerColor(
                        SubLayerId.AssociatedDataClusterCount
                    ),
                },
            };
        case SubLayerId.AssociatedDataUnclustered:
            return {
                id: SubLayerId.AssociatedDataUnclustered,
                type: LayerType.Circle,
                source: SourceId.AssociatedData,
                paint: {
                    'circle-color': getLayerColor(
                        SubLayerId.AssociatedDataUnclustered
                    ),
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                    'circle-opacity': [
                        'step',
                        ['zoom'],
                        0,
                        CLUSTER_TRANSITION_ZOOM,
                        1,
                    ],
                    'circle-stroke-opacity': [
                        'step',
                        ['zoom'],
                        0,
                        CLUSTER_TRANSITION_ZOOM,
                        1,
                    ],
                },
            };
        case LayerId.SpiderifyPoints:
            return {
                id: LayerId.SpiderifyPoints,
                type: LayerType.Symbol,
                source: SourceId.Spiderify,
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'icon-color': getLayerColor(LayerId.SpiderifyPoints),
                    'icon-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        CLUSTER_TRANSITION_ZOOM,
                        0,
                        CLUSTER_TRANSITION_ZOOM + 0.01,
                        ['get', 'isNotFiltered'],
                    ],
                },
                layout: {
                    'icon-image': 'observation-point',
                    'icon-size': 1,
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    'icon-offset': ['get', 'iconOffset'],
                },
            };
        default:
            return null;
    }
};

let hoverOnCluster = false;

// Define and hover functions with curry-ed map and popup objects
export const getLayerHoverFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.MainstemsSmall:
                return (e) => {
                    if (!hoverOnCluster) {
                        map.getCanvas().style.cursor = 'pointer';

                        const feature = e.features?.[0];
                        if (feature && feature.properties) {
                            const html = `<strong style="color:black;">${feature.properties.name_at_outlet}</strong>`;
                            hoverPopup
                                .setLngLat(e.lngLat)
                                .setHTML(html)
                                .addTo(map);
                        }
                    }
                };
            case SubLayerId.MainstemsMedium:
                return (e) => {
                    if (!hoverOnCluster) {
                        map.getCanvas().style.cursor = 'pointer';

                        const feature = e.features?.[0];
                        if (feature && feature.properties) {
                            const html = `<strong style="color:black;">${feature.properties.name_at_outlet}</strong>`;

                            hoverPopup
                                .setLngLat(e.lngLat)
                                .setHTML(html)
                                .addTo(map);
                        }
                    }
                };
            case SubLayerId.MainstemsLarge:
                return (e) => {
                    if (!hoverOnCluster) {
                        map.getCanvas().style.cursor = 'pointer';

                        const feature = e.features?.[0];
                        if (feature && feature.properties) {
                            const html = `<strong style="color:black;">${feature.properties.name_at_outlet}</strong>`;

                            hoverPopup
                                .setLngLat(e.lngLat)
                                .setHTML(html)
                                .addTo(map);
                        }
                    }
                };

            case LayerId.SpiderifyPoints:
                return (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features?.[0] as
                        | Feature<Point>
                        | undefined;
                    if (feature && feature.properties) {
                        const itemId = feature.properties.distributionURL;
                        if (
                            !hasPeristentPopupOpenToThisItem(
                                persistentPopup,
                                itemId
                            )
                        ) {
                            hoverPopup.remove();
                            const variableMeasured =
                                feature.properties.variableMeasured.split(
                                    ' / '
                                )[0];
                            const offset: [number, number] = JSON.parse(
                                feature.properties.iconOffset
                            );
                            const coordinates = feature.geometry
                                .coordinates as [number, number];
                            const html = `<span style="color: black;"> 
                                <h6 style="font-weight:bold;">${feature.properties.siteName}</h6>
                                <div style="display:flex;">
                                    <strong>Type:</strong>&nbsp;<p>${variableMeasured} in ${feature.properties.variableUnit}</p>
                                </div>
                              </span>`;

                            hoverPopup
                                .setLngLat(coordinates)
                                .setOffset(offset)
                                .setHTML(html)
                                .addTo(map);
                        }
                    }
                };
            case SubLayerId.AssociatedDataClusters:
                return () => {
                    hoverOnCluster = true;
                    map.getCanvas().style.cursor = 'pointer';
                };
            case SubLayerId.HUC2BoundaryFill:
                return (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features?.[0] as
                        | Feature<LineString>
                        | undefined;
                    const zoom = map.getZoom();
                    if (feature && feature.properties && zoom < 7) {
                        const name = feature.properties.NAME;
                        map.setPaintProperty(
                            SubLayerId.HUC2BoundaryLabels,
                            'text-opacity',
                            ['case', ['==', ['get', 'NAME'], name], 1, 0]
                        );
                    }
                };
            default:
                return (e) => {
                    console.log('Hover Event Triggered: ', e);
                    console.log('The map: ', map);
                    console.log('Available Popups: ');
                    console.log('Hover: ', hoverPopup);
                    console.log('Persistent: ', persistentPopup);

                    map.getCanvas().style.cursor = 'pointer';
                };
        }
    };
};

export const getLayerCustomHoverExitFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.AssociatedDataClusters:
                return () => {
                    hoverOnCluster = false;
                };
            case LayerId.SpiderifyPoints:
                return () => {
                    map.getCanvas().style.cursor = '';
                    hoverPopup.remove();
                    // Remove offset from shared object
                    hoverPopup.setOffset(0);
                };
            case SubLayerId.HUC2BoundaryFill:
                return () => {
                    map.getCanvas().style.cursor = '';
                    map.setPaintProperty(
                        SubLayerId.HUC2BoundaryLabels,
                        'text-opacity',
                        0
                    );
                };
            default:
                return (e) => {
                    console.log('Hover Exit Event Triggered: ', e);
                    console.log('The map: ', map);
                    console.log('Available Popups: ');
                    console.log('Hover: ', hoverPopup);
                    console.log('Persistent: ', persistentPopup);
                };
        }
    };
};

// Mousemove functions, handle changes when moving between features in the same layer
export const getLayerMouseMoveFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.HUC2BoundaryFill:
                return (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features?.[0] as
                        | Feature<LineString>
                        | undefined;
                    const zoom = map.getZoom();
                    if (feature && feature.properties && zoom < 6) {
                        const name = feature.properties.NAME;
                        map.setPaintProperty(
                            SubLayerId.HUC2BoundaryLabels,
                            'text-opacity',
                            ['case', ['==', ['get', 'NAME'], name], 1, 0]
                        );
                    }
                };
            case LayerId.SpiderifyPoints:
                return (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features?.[0] as
                        | Feature<Point>
                        | undefined;
                    if (feature && feature.properties) {
                        const itemId = feature.properties.distributionURL;
                        if (
                            !hasPeristentPopupOpenToThisItem(
                                persistentPopup,
                                itemId
                            )
                        ) {
                            hoverPopup.remove();
                            const variableMeasured =
                                feature.properties.variableMeasured.split(
                                    ' / '
                                )[0];
                            const offset: [number, number] = JSON.parse(
                                feature.properties.iconOffset
                            );
                            const coordinates = feature.geometry
                                .coordinates as [number, number];
                            const html = `<span style="color: black;"> 
                                            <h6 style="font-weight:bold;">${feature.properties.siteName}</h6>
                                            <div style="display:flex;">
                                                <strong>Type:</strong>&nbsp;<p>${variableMeasured} in ${feature.properties.variableUnit}</p>
                                        </div>
                                        </span>`;

                            hoverPopup
                                .setLngLat(coordinates)
                                .setOffset(offset)
                                .setHTML(html)
                                .addTo(map);
                        }
                    }
                };
            default:
                return (e) => {
                    console.log('Hover Exit Event Triggered: ', e);
                    console.log('The map: ', map);
                    console.log('Available Popups: ');
                    console.log('Hover: ', hoverPopup);
                    console.log('Persistent: ', persistentPopup);
                };
        }
    };
};

// Click handlers
export const getLayerClickFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.AssociatedDataClusters:
                return (e) => {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: [SubLayerId.AssociatedDataClusters],
                    });

                    const feature = features?.[0];
                    if (feature && feature.properties) {
                        const clusterId = feature.properties.cluster_id;
                        const source = map.getSource(
                            SourceId.AssociatedData
                        ) as GeoJSONSource;
                        if (!clusterId || !source) {
                            return;
                        }

                        source?.getClusterExpansionZoom(
                            clusterId,
                            (err, zoom) => {
                                if (err) return;
                                const coordinates = (feature.geometry as Point)
                                    .coordinates as [number, number];

                                if (zoom) {
                                    if (zoom > CLUSTER_TRANSITION_ZOOM) {
                                        spiderfyClusters(map, source, [
                                            feature,
                                        ]);
                                    }
                                    map.easeTo({
                                        center: coordinates,
                                        zoom: zoom,
                                        duration: 1000,
                                    });
                                }
                            }
                        );
                    }
                };
            default:
                return (e) => {
                    console.log('Click Event Triggered: ', e);
                    console.log('The map: ', map);
                    console.log('Available Popups: ');
                    console.log('Hover: ', hoverPopup);
                    console.log('Persistent: ', persistentPopup);
                };
        }
    };
};

// Use this as the master object to define layer hierarchies. Sublayers are nested layer definitions,
// meaning they have their own click and hover listeners
export const layerDefinitions: MainLayerDefinition[] = [
    {
        id: LayerId.Mainstems,
        controllable: true,
        legend: true,
        config: getLayerConfig(LayerId.Mainstems),
        subLayers: [
            {
                id: SubLayerId.MainstemsSmall,
                controllable: true,
                legend: true,
                config: getLayerConfig(SubLayerId.MainstemsSmall),
                hoverFunction: getLayerHoverFunction(SubLayerId.MainstemsSmall),
            },
            {
                id: SubLayerId.MainstemsMedium,
                controllable: true,
                legend: true,
                config: getLayerConfig(SubLayerId.MainstemsMedium),
                hoverFunction: getLayerHoverFunction(
                    SubLayerId.MainstemsMedium
                ),
            },
            {
                id: SubLayerId.MainstemsLarge,
                controllable: true,
                legend: true,
                config: getLayerConfig(SubLayerId.MainstemsLarge),
                hoverFunction: getLayerHoverFunction(SubLayerId.MainstemsLarge),
            },
        ],
    },
    {
        id: LayerId.MajorRivers,
        controllable: true,
        legend: true,
        config: getLayerConfig(LayerId.MajorRivers),
    },
    {
        id: LayerId.MainstemsHighlight,
        controllable: false,
        legend: false,
        config: getLayerConfig(LayerId.MainstemsHighlight),
    },
    {
        id: LayerId.HUC2Boundaries,
        controllable: true,
        legend: false,
        config: getLayerConfig(LayerId.HUC2Boundaries),
        subLayers: [
            {
                id: SubLayerId.HUC2BoundaryLabels,
                controllable: true,
                legend: false,
                config: getLayerConfig(SubLayerId.HUC2BoundaryLabels),
            },
            {
                id: SubLayerId.HUC2BoundaryFill,
                controllable: false,
                legend: false,
                config: getLayerConfig(SubLayerId.HUC2BoundaryFill),
                hoverFunction: getLayerHoverFunction(
                    SubLayerId.HUC2BoundaryFill
                ),
                customHoverExitFunction: getLayerCustomHoverExitFunction(
                    SubLayerId.HUC2BoundaryFill
                ),
                mouseMoveFunction: getLayerMouseMoveFunction(
                    SubLayerId.HUC2BoundaryFill
                ),
            },
        ],
    },
    {
        id: LayerId.AssociatedData,
        controllable: false,
        legend: false,
        config: getLayerConfig(LayerId.AssociatedData),
        subLayers: [
            {
                id: SubLayerId.AssociatedDataClusters,
                controllable: false,
                legend: false,
                config: getLayerConfig(SubLayerId.AssociatedDataClusters),
                clickFunction: getLayerClickFunction(
                    SubLayerId.AssociatedDataClusters
                ),
                hoverFunction: getLayerHoverFunction(
                    SubLayerId.AssociatedDataClusters
                ),
                customHoverExitFunction: getLayerCustomHoverExitFunction(
                    SubLayerId.AssociatedDataClusters
                ),
            },
            {
                id: SubLayerId.AssociatedDataClusterCount,
                controllable: false,
                legend: false,
                config: getLayerConfig(SubLayerId.AssociatedDataClusterCount),
            },
            {
                id: SubLayerId.AssociatedDataUnclustered,
                controllable: false,
                legend: false,
                config: getLayerConfig(SubLayerId.AssociatedDataUnclustered),
                // hoverFunction: getLayerHoverFunction(
                //     SubLayerId.AssociatedDataUnclustered
                // ),
            },
        ],
    },
    {
        id: LayerId.SpiderifyPoints,
        controllable: false,
        legend: true,
        config: getLayerConfig(LayerId.SpiderifyPoints),
        hoverFunction: getLayerHoverFunction(LayerId.SpiderifyPoints),
        mouseMoveFunction: getLayerMouseMoveFunction(LayerId.SpiderifyPoints),
        customHoverExitFunction: getLayerCustomHoverExitFunction(
            LayerId.SpiderifyPoints
        ),
    },

    // {
    //     id: LayerId.Points,
    //     controllable: true,
    //     config: getLayerConfig(LayerId.Points),
    //     hoverFunction: getLayerHoverFunction(LayerId.Points),
    //     clickFunction: getLayerClickFunction(LayerId.Points),
    //     subLayers: [
    //         {
    //             id: SubLayerId.PointsSmall,
    //             controllable: true,
    //             config: getLayerConfig(SubLayerId.PointsSmall),
    //         },
    //     ],
    // },
];
