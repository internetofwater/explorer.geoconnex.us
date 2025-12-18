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
import { defaultGeoJson } from '@/lib/state/consts';
import { basemaps } from '@/app/components/Map/consts';
import { huc02Centers } from '@/data/huc02Centers';

export const MAP_ID = 'main';

export const BASEMAP = basemaps[BasemapId.Dark];

export enum SourceId {
    Mainstems = 'mainstems',
    MajorRivers = 'major-rivers-source',
    HUC2Boundaries = 'hu02',
    AssociatedData = 'associated-data-source',
    HUC2GeoJSON = 'huc-02-geojson',
    SummaryPoints = 'summary-points',
}

export enum LayerId {
    Mainstems = 'mainstems-layer',
    HUC2Boundaries = 'huc-2-boundaries',
    MajorRivers = 'major-rivers',
    AssociatedData = 'associated-data',
    SummaryPoints = 'summary-points',
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
    SummaryPointsSiteName = 'summary-points-site-name',
    SummaryPointsTotal = 'summary-points-site-total',
}
export const allLayerIds = [
    ...Object.values(LayerId),
    ...Object.values(SubLayerId),
];

/**
 * Zoom level to transition from clusters to summary points
 *
 * @constant
 */
export const CLUSTER_TRANSITION_ZOOM = 17;
/**
 * Define outlet_drainagearea_sqkm value that determines upper limit of small mainstems.
 *
 * @constant
 */
export const MAINSTEM_DRAINAGE_SMALL = 160;
/**
 * Define outlet_drainagearea_sqkm value that determines upper limit of medium mainstems.
 * Any values larger than this are considered large mainstems
 *
 * @constant
 */
export const MAINSTEM_DRAINAGE_MEDIUM = 1600;
export const MAINSTEM_SMALL_LINE_WIDTH = 3;
export const MAINSTEM_MEDIUM_LINE_WIDTH = 4;
export const MAINSTEM_LARGE_LINE_WIDTH = 6;
/**
 * Zoom level to render mainstems after initial load.
 *
 * @constant
 */
export const MAINSTEM_VISIBLE_ZOOM = 5;
/**
 * Zoom level for when mainstems should become more opaque.
 *
 * @constant
 */
export const MAINSTEM_OPACITY_ZOOM = 6;

export const MAINSTEM_OPACITY_EXPRESSION: ExpressionSpecification = [
    'step',
    ['zoom'],
    0.3,
    MAINSTEM_OPACITY_ZOOM,
    0.8,
];

// HUC Ids for boundaries outside continental US
const filteredHucs = ['19', '20', '21', '22'];
const hucFilterExpression: ExpressionSpecification = [
    'match',
    ['get', 'HUC2'],
    filteredHucs,
    false,
    true,
];

/**********************************************************************
 * Define the various datasources this map will use
 **********************************************************************/

/**
 * Configurations for sources in the map. Supports GeoJSON, VectorTile, and Esri Feature Service sources
 *
 * @constant
 */
export const sourceConfigs: SourceConfig[] = [
    {
        id: SourceId.Mainstems,
        type: Sources.VectorTile,
        definition: {
            type: 'vector',
            tiles: [
                `https://reference.geoconnex.us/collections/mainstems/tiles/WebMercatorQuad/{z}/{y}/{x}?f=mvt`,
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
                `https://reference.geoconnex.us/collections/hu02/tiles/WebMercatorQuad/{z}/{y}/{x}?f=mvt`,
            ],
            minzoom: 0,

            maxzoom: 10,
            tileSize: 512,
            bounds: [-179.229468, -14.42442, 179.856484, 71.439451],
        },
    },
    {
        id: SourceId.SummaryPoints,
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
    {
        id: SourceId.HUC2GeoJSON,
        type: Sources.GeoJSON,
        definition: {
            type: 'geojson',
            data: huc02Centers,
            cluster: false,
        },
    },
];

/**********************************************************************
 * Create helper functions to group layer logic
 **********************************************************************/
/**
 * Returns the display name for a given layer or sublayer based on its identifier.
 *
 * Parameters:
 * - layerId: LayerId | SubLayerId - The identifier for the layer or sublayer.
 *
 * Returns:
 * - string - The display name for the specified layer or sublayer.
 *
 * @function
 */
export const getLayerName = (layerId: LayerId | SubLayerId): string => {
    switch (layerId) {
        case LayerId.Mainstems:
            return 'Mainstems';
        case SubLayerId.MainstemsSmall:
            return 'Small';
        case SubLayerId.MainstemsMedium:
            return 'Medium';
        case SubLayerId.MainstemsLarge:
            return 'Large';
        case LayerId.MajorRivers:
            return 'Major Rivers';
        case LayerId.HUC2Boundaries:
            return 'HUC2 Boundaries';
        case SubLayerId.HUC2BoundaryLabels:
            return 'Labels';
        case SubLayerId.HUC2BoundaryFill:
            return 'HUC2 Boundaries';
        case LayerId.AssociatedData:
            return 'Associated Data';
        case SubLayerId.AssociatedDataClusters:
            return 'Dataset Clusters';
        default:
            return '';
    }
};

export const MAINSTEMS_SEARCH_COLOR = '#FAC60F';
export const MAINSTEMS_SELECTED_COLOR = '#F500FF';

/**
 * Returns the color for a given layer or sublayer based on its identifier.
 * It defines the color values for each layer, including special cases for data-driven properties.
 *
 * Parameters:
 * - id: LayerId | SubLayerId - The identifier for the layer or sublayer.
 *
 * Returns:
 * - DataDrivenPropertyValueSpecification<string> - The color value or expression for the specified layer or sublayer.
 *
 * @function
 */
export const getLayerColor = (
    id: LayerId | SubLayerId
): DataDrivenPropertyValueSpecification<string> => {
    switch (id) {
        case LayerId.Mainstems:
            return '#7A9939';
        case SubLayerId.MainstemsSmall:
            return '#e0f3db';
        case SubLayerId.MainstemsMedium:
            return '#7bccc4';
        case SubLayerId.MainstemsLarge:
            return '#08589e';
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
                '#91bfdb', // Less than 50
                50,
                '#ffffbf', // GTE 50
                200,
                '#fc8d59', // GTE 200
            ];
        case SubLayerId.AssociatedDataClusterCount:
            return '#000';
        case SubLayerId.AssociatedDataUnclustered:
            return '#1C76CA';
        case LayerId.SummaryPoints:
            return '#1C76CA';
        default:
            return '#FFF';
    }
};

/**
 * Returns the configuration for a given layer or sublayer in the map.
 * It defines the properties such as id, type, source, layout, filter, and paint for each layer.
 *
 * Parameters:
 * - id: LayerId | SubLayerId - The identifier for the layer or sublayer.
 *
 * Returns:
 * - LayerSpecification | null - The configuration object for the specified layer or sublayer, or null if no configuration is needed.
 *
 * @function
 */
export const getLayerConfig = (
    id: LayerId | SubLayerId
): null | LayerSpecification => {
    // Group layer and sublayer configurations together
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
                    'line-opacity': 1,
                    'line-color': getLayerColor(LayerId.HUC2Boundaries),
                    'line-width': 3,
                },
                filter: hucFilterExpression,
            };
        case SubLayerId.HUC2BoundaryLabels:
            return {
                id: SubLayerId.HUC2BoundaryLabels,
                type: LayerType.Symbol,
                source: SourceId.HUC2GeoJSON,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-size': 18,
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                },
                paint: {
                    'text-color': getLayerColor(LayerId.HUC2Boundaries),
                    'text-opacity': 0,
                    'text-halo-blur': 1,
                    'text-halo-color': '#000000',
                    'text-halo-width': 2,
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
                filter: hucFilterExpression,
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
                    'circle-opacity': [
                        'step',
                        ['zoom'],
                        1,
                        CLUSTER_TRANSITION_ZOOM,
                        0,
                    ],
                },
            };
        case SubLayerId.AssociatedDataClusterCount:
            return {
                id: SubLayerId.AssociatedDataClusterCount,
                type: LayerType.Symbol,
                source: SourceId.AssociatedData,
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                    'text-size': 12,
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                },
                paint: {
                    'text-color': getLayerColor(
                        SubLayerId.AssociatedDataClusterCount
                    ),
                    'text-opacity': [
                        'step',
                        ['zoom'],
                        1,
                        CLUSTER_TRANSITION_ZOOM,
                        0,
                    ],
                },
            };
        case SubLayerId.AssociatedDataUnclustered:
            return {
                id: SubLayerId.AssociatedDataUnclustered,
                type: LayerType.Symbol,
                source: SourceId.AssociatedData,
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'icon-color': getLayerColor(
                        SubLayerId.AssociatedDataUnclustered
                    ),
                    'icon-opacity': 1,
                },
                layout: {
                    'icon-image': 'observation-point-center',
                    'icon-size': 1,
                },
            };

        case LayerId.SummaryPoints:
            return {
                id: LayerId.SummaryPoints,
                type: LayerType.Circle,
                source: SourceId.SummaryPoints,
                paint: {
                    'circle-color': getLayerColor(LayerId.SummaryPoints),
                    'circle-opacity': [
                        'step',
                        ['zoom'],
                        0,
                        CLUSTER_TRANSITION_ZOOM,
                        1,
                    ],
                    'circle-radius': 20,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#FFF',
                    'circle-stroke-opacity': [
                        'step',
                        ['zoom'],
                        0,
                        CLUSTER_TRANSITION_ZOOM,
                        1,
                    ],
                },

                layout: {},
            };
        case SubLayerId.SummaryPointsSiteName:
            return {
                id: SubLayerId.SummaryPointsSiteName,
                type: LayerType.Symbol,
                source: SourceId.SummaryPoints,
                layout: {
                    'text-field': ['get', 'siteNames'],
                    'text-size': 14,
                    'text-offset': [
                        'interpolate',
                        ['linear'],
                        ['length', ['get', 'siteNames']],
                        1,
                        [0, -2.2], // 0 characters
                        30,
                        [0, -3.8], // 27 characters
                        60,
                        [0, -4], // 54 characters
                    ], // Positions the label above the point
                    'text-anchor': 'top',
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                    'text-max-width': 30,
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                },
                paint: {
                    'text-color': '#000000',
                    'text-halo-color': '#FFFFFF',
                    'text-halo-width': 2,
                    'text-opacity': [
                        'step',
                        ['zoom'],
                        0,
                        CLUSTER_TRANSITION_ZOOM,
                        1,
                    ],
                },
            };
        case SubLayerId.SummaryPointsTotal:
            return {
                id: SubLayerId.SummaryPointsTotal,
                type: LayerType.Symbol,
                source: SourceId.SummaryPoints,
                layout: {
                    'text-field': ['get', 'totalDatasets'],
                    'text-size': 14,
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                },
                paint: {
                    'text-color': '#FFFFFF',
                    'text-opacity': [
                        'step',
                        ['zoom'],
                        0,
                        CLUSTER_TRANSITION_ZOOM - 1,
                        1,
                    ],
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
                        const zoom = map.getZoom();
                        if (zoom > MAINSTEM_VISIBLE_ZOOM) {
                            map.getCanvas().style.cursor = 'pointer';

                            const feature = e.features?.[0];
                            if (feature && feature.properties) {
                                const html = `<strong style="color:black;">${
                                    feature.properties.name_at_outlet ||
                                    'URI: ' + feature.properties.id
                                }</strong>`;
                                hoverPopup
                                    .setLngLat(e.lngLat)
                                    .setHTML(html)
                                    .addTo(map);
                            }
                        }
                    }
                };
            case SubLayerId.MainstemsMedium:
                return (e) => {
                    if (!hoverOnCluster) {
                        const zoom = map.getZoom();
                        if (zoom > MAINSTEM_VISIBLE_ZOOM) {
                            map.getCanvas().style.cursor = 'pointer';

                            const feature = e.features?.[0];
                            if (feature && feature.properties) {
                                const html = `<strong style="color:black;">${
                                    feature.properties.name_at_outlet ||
                                    'URI: ' + feature.properties.id
                                }</strong>`;

                                hoverPopup
                                    .setLngLat(e.lngLat)
                                    .setHTML(html)
                                    .addTo(map);
                            }
                        }
                    }
                };
            case SubLayerId.MainstemsLarge:
                return (e) => {
                    if (!hoverOnCluster) {
                        const zoom = map.getZoom();
                        if (zoom > MAINSTEM_VISIBLE_ZOOM) {
                            map.getCanvas().style.cursor = 'pointer';

                            const feature = e.features?.[0];
                            if (feature && feature.properties) {
                                const html = `<strong style="color:black;">${
                                    feature.properties.name_at_outlet ||
                                    'URI: ' + feature.properties.id
                                }</strong>`;

                                hoverPopup
                                    .setLngLat(e.lngLat)
                                    .setHTML(html)
                                    .addTo(map);
                            }
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
                    const zoom = map.getZoom();
                    if (zoom < MAINSTEM_VISIBLE_ZOOM) {
                        map.getCanvas().style.cursor = 'pointer';
                        const feature = e.features?.[0] as
                            | Feature<LineString>
                            | undefined;
                        if (feature && feature.properties) {
                            const id = String(feature.properties.id);
                            map.setPaintProperty(
                                SubLayerId.HUC2BoundaryLabels,
                                'text-opacity',
                                ['case', ['==', ['get', 'id'], id], 1, 0]
                            );
                        }
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

/**
 * Custom functionality for when the `mouseleave` event fires on this layer.
 * If not defined, defaults to unsetting the cursor and removing the hoverpopup
 *
 * Parameters:
 * - id: LayerId | SubLayerId - The identifier for the layer or sublayer.
 *
 * Returns:
 * - CustomListenerFunction - A function that handles the hover exit event for the specified layer or sublayer.
 *
 * @function
 */
export const getLayerCustomHoverExitFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.AssociatedDataClusters:
                return () => {
                    hoverOnCluster = false;
                    map.getCanvas().style.cursor = '';
                };
            case SubLayerId.MainstemsSmall:
                return () => {
                    const zoom = map.getZoom();
                    if (zoom > MAINSTEM_VISIBLE_ZOOM) {
                        map.getCanvas().style.cursor = '';
                    }
                    hoverPopup.remove();
                };
            case SubLayerId.MainstemsMedium:
                return () => {
                    const zoom = map.getZoom();
                    if (zoom > MAINSTEM_VISIBLE_ZOOM) {
                        map.getCanvas().style.cursor = '';
                    }
                    hoverPopup.remove();
                };
            case SubLayerId.MainstemsLarge:
                return () => {
                    const zoom = map.getZoom();
                    if (zoom > MAINSTEM_VISIBLE_ZOOM) {
                        map.getCanvas().style.cursor = '';
                    }
                    hoverPopup.remove();
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

/**
 * Custom functionality for when the `mousemove` event fires on this layer. This event is triggered when
 * hovering over features without the cursor leaving the layer.
 *
 * Parameters:
 * - id: LayerId | SubLayerId - The identifier for the layer or sublayer.
 *
 * Returns:
 * - CustomListenerFunction - A function that handles the mouse move event for the specified layer or sublayer.
 *
 * @function
 */
export const getLayerMouseMoveFunction = (
    id: LayerId | SubLayerId
): CustomListenerFunction => {
    return (map: Map, hoverPopup: Popup, persistentPopup: Popup) => {
        switch (id) {
            case SubLayerId.AssociatedDataClusters:
                return () => {
                    hoverOnCluster = true;
                    map.getCanvas().style.cursor = 'pointer';
                };
            case SubLayerId.HUC2BoundaryFill:
                return (e) => {
                    const zoom = map.getZoom();
                    if (zoom < MAINSTEM_VISIBLE_ZOOM) {
                        const feature = e.features?.[0] as
                            | Feature<LineString>
                            | undefined;
                        if (feature && feature.properties) {
                            map.getCanvas().style.cursor = 'pointer';
                            const id = String(feature.properties.id);
                            map.setPaintProperty(
                                SubLayerId.HUC2BoundaryLabels,
                                'text-opacity',
                                ['case', ['==', ['get', 'id'], id], 1, 0]
                            );
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

/**
 * Custom functionality for when the `click` event fires on this layer.
 *
 * Parameters:
 * - id: LayerId | SubLayerId - The identifier for the layer or sublayer.
 *
 * Returns:
 * - CustomListenerFunction - A function that handles the click event for the specified layer or sublayer.
 *
 * @function
 */
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
                        const clusterId = feature.properties
                            .cluster_id as number;
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

/**
 * Contains the definitions for main layers and sublayers in the map.
 * Each layer definition includes properties such as id, controllable, legend, config, and optional event handler functions.
 *
 * LayerDefinition Type:
 * - id: string - The identifier for the layer or sublayer.
 * - controllable: boolean - Whether the layers visibility can be toggled by the user.
 * - legend: boolean - Whether the layer should be displayed in the legend.
 * - config: LayerSpecification | null - The configuration object for the layer or sublayer.
 * - hoverFunction?: CustomListenerFunction - Optional function to handle hover events.
 * - customHoverExitFunction?: CustomListenerFunction - Optional function to handle hover exit events.
 * - clickFunction?: CustomListenerFunction - Optional function to handle click events.
 * - mouseMoveFunction?: CustomListenerFunction - Optional function to handle mouse move events.
 *
 * MainLayerDefinition Type:
 * Contains the above type values and an additional optional array
 * - subLayers?: LayerDefinition[] - Optional array of sublayer definitions.
 *
 *
 * @constant
 */
export const layerDefinitions: MainLayerDefinition[] = [
    // Use this as the master object to define layer hierarchies. Sublayers are nested layer definitions,
    // meaning they have their own click and hover listeners. The order of layers and sublayers dictates the draw
    // order on the map.
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
                customHoverExitFunction: getLayerCustomHoverExitFunction(
                    SubLayerId.MainstemsSmall
                ),
            },
            {
                id: SubLayerId.MainstemsMedium,
                controllable: true,
                legend: true,
                config: getLayerConfig(SubLayerId.MainstemsMedium),
                hoverFunction: getLayerHoverFunction(
                    SubLayerId.MainstemsMedium
                ),
                customHoverExitFunction: getLayerCustomHoverExitFunction(
                    SubLayerId.MainstemsMedium
                ),
            },
            {
                id: SubLayerId.MainstemsLarge,
                controllable: true,
                legend: true,
                config: getLayerConfig(SubLayerId.MainstemsLarge),
                hoverFunction: getLayerHoverFunction(SubLayerId.MainstemsLarge),
                customHoverExitFunction: getLayerCustomHoverExitFunction(
                    SubLayerId.MainstemsLarge
                ),
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
            // Hack to allow layer toggles to turn the labels on/off
            {
                id: SubLayerId.HUC2BoundaryLabels,
                controllable: true,
                legend: false,
                config: null,
            },
        ],
    },
    {
        id: LayerId.SummaryPoints,
        controllable: false,
        legend: false,
        config: getLayerConfig(LayerId.SummaryPoints),
        subLayers: [
            {
                id: SubLayerId.SummaryPointsSiteName,
                controllable: false,
                legend: false,
                config: getLayerConfig(SubLayerId.SummaryPointsSiteName),
            },
            {
                id: SubLayerId.SummaryPointsTotal,
                controllable: false,
                legend: false,
                config: getLayerConfig(SubLayerId.SummaryPointsTotal),
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
                mouseMoveFunction: getLayerMouseMoveFunction(
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
        ],
    },
    // Treat as a separate layer to allow draw over the datapoints
    {
        id: SubLayerId.HUC2BoundaryLabels,
        controllable: false,
        legend: false,
        config: getLayerConfig(SubLayerId.HUC2BoundaryLabels),
    },
];
