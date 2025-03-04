import { FeatureServiceOptions } from '@hansdo/mapbox-gl-arcgis-featureserver';
import {
    GeoJSONSource,
    VectorTileSource as VectorSource,
    RasterTileSource as RasterSource,
    ImageSource,
    VideoSource,
    SourceSpecification,
    LayerSpecification,
    MapOptions,
    MapMouseEvent,
    Map,
    Popup,
    FullscreenControlOptions,
    NavigationControlOptions,
    ScaleControlOptions,
} from 'mapbox-gl';

export type SourceDefinition =
    | GeoJSONSource
    | VectorSource
    | RasterSource<'raster'>
    | ImageSource
    | VideoSource;

export enum Sources {
    GeoJSON = 'geojson',
    VectorTile = 'vector-tile',
    ESRI = 'esri',
}

export type SourceConfig = {
    id: string;
    type: Sources;
    definition: SourceSpecification | FeatureServiceOptions;
};

export type CustomListenerFunction = (
    map: Map,
    hoverPopup: Popup,
    persistentPopup: Popup
) => (e: MapMouseEvent) => void;

export type LayerDefinition = {
    id: string;
    controllable: boolean;
    legend: boolean;
    config: LayerSpecification | null;
    hoverFunction?: CustomListenerFunction;
    customHoverExitFunction?: CustomListenerFunction;
    clickFunction?: CustomListenerFunction;
    mouseMoveFunction?: CustomListenerFunction;
};

export type MainLayerDefinition = LayerDefinition & {
    subLayers?: LayerDefinition[];
};

export interface MapComponentProps {
    accessToken: string;
    id: string;
    sources: SourceConfig[];
    layers: MainLayerDefinition[];
    options: Omit<MapOptions, 'container'>;
    controls?: {
        navigationControl?: NavigationControlOptions | boolean;
        scaleControl?: ScaleControlOptions | boolean;
        fullscreenControl?: FullscreenControlOptions | boolean;
    };
}

export enum BasemapId {
    Standard = 'standard',
    StandardSatellite = 'standard-satellite',
    Streets = 'streets',
    Outdoors = 'outdoors',
    Light = 'light',
    Dark = 'dark',
    Satellite = 'satellite',
    SatelliteStreets = 'satellite-streets',
    NavigationDay = 'navigation-day',
    NavigationNight = 'navigation-night',
}

export type BasemapStyles =
    | 'mapbox://styles/mapbox/standard'
    | 'mapbox://styles/mapbox/standard-satellite'
    | 'mapbox://styles/mapbox/streets-v12'
    | 'mapbox://styles/mapbox/outdoors-v12'
    | 'mapbox://styles/mapbox/light-v11'
    | 'mapbox://styles/mapbox/dark-v11'
    | 'mapbox://styles/mapbox/satellite-v9'
    | 'mapbox://styles/mapbox/satellite-streets-v12'
    | 'mapbox://styles/mapbox/navigation-day-v1'
    | 'mapbox://styles/mapbox/navigation-night-v1';

export type Basemaps = {
    [key in BasemapId]: BasemapStyles;
};

export enum LayerType {
    Line = 'line',
    Symbol = 'symbol',
    Circle = 'circle',
    Fill = 'fill',
}
