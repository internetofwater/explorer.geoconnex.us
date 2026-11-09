import {
    Feature,
    FeatureCollection,
    Geometry,
    LineString,
    MultiPolygon,
    Polygon,
    Position,
} from 'geojson';
import { LngLatLike, MapMouseEvent, MapTouchEvent } from 'mapbox-gl';

// TODO: determine what this looks like for us
// type TGeocoderEvent = MapMouseEvent;

export type TMapInteraction = MapTouchEvent | MapMouseEvent;

/**
 * Properties contained on an NLDI feature.
 *
 * The `navigation` property contains a URL that can be used to query for upstream/downstream mainstems
 *
 * Example Result from `navigation` link:
 * ```
 * {
 *   upstreamMain: 'https://api.water.usgs.gov/nldi/linked-data/comid/1260357/navigation/UM',
 *   upstreamTributaries: 'https://api.water.usgs.gov/nldi/linked-data/comid/1260357/navigation/UT',
 *   downstreamMain: 'https://api.water.usgs.gov/nldi/linked-data/comid/1260357/navigation/DM',
 *   downstreamDiversions: 'https://api.water.usgs.gov/nldi/linked-data/comid/1260357/navigation/DD'
 * }
 * ```
 *  @type {TNLDIProperties}
 */
export type TNLDIProperties = {
    /** Unique NLDI feature identifier. */
    identifier: string;
    /** Navigation endpoint for querying upstream/downstream network. */
    navigation: string;
    /** Source provider identifier (e.g. comid, nwissite, huc12). */
    source: string;
    /** Human-readable source provider name. */
    sourceName: string;
    /** NHDPlus COMID for the flowline. */
    comid: number;
};

export type TNLDIFeatureCollection = FeatureCollection<
    LineString,
    TNLDIProperties
>;

export type TNLDIFeature = Feature<LineString, TNLDIProperties>;

/****************************************************************
 * Flowline Features
 ****************************************************************/

export type TFlowRateResponseRaw = {
    comid: string;
    flowrate: string;
};

export type TFlowlineProperties = {
    nhdplus_comid: number;
};

export type TFlowlineFeature = Feature<LineString, TFlowlineProperties>;

export type TFlowlineFeatureCollection = FeatureCollection<
    LineString,
    TFlowlineProperties
>;

/****************************************************************
 * VAA + Flowline Features
 ****************************************************************/

// This property should be unused in the actual application
export type TNLDIPropertiesVAA = TFlowlineProperties & {
    gnis_name: string | null;
    lengthkm: number | null;
    levelpathid: string | null;
    pathlength: number | null;
    streamlvl: number | null;
    terminalfl: number | null;

    // These are added post-fetch
    feature_name: string | null;
    feature_id: string | null;
};

export type TNLDIVAAFeatureCollection = FeatureCollection<
    LineString,
    TNLDIPropertiesVAA
>;

export type TNLDIVAAFeature = Feature<LineString, TNLDIPropertiesVAA>;

export type TVAAResponse = Omit<
    TNLDIPropertiesVAA,
    'feature_name' | 'feature_id'
>;

/****************************************************************
 * NLDI + Flowline Features
 ****************************************************************/

export type TNLDIFlowlineExtendedProperties = TFlowlineProperties & {
    flowRate?: number;
};

export type TNLDIFlowlineExtendedFeatureCollection = FeatureCollection<
    LineString,
    TNLDIFlowlineExtendedProperties
>;

export type TNLDIFlowlineExtendedFeature = Feature<
    LineString,
    TNLDIFlowlineExtendedProperties
>;

/****************************************************************
 * Stopping Feature Data File
 ****************************************************************/

// Stopping features can come with a large number of additional properties
// I can't find uses of properties besides the below, so only typing these for now
export type TStoppingFeaturePropertiesBase = {
    stop_feature_name: string;
    stop_feature_type: string;
};

export type TStoppingFeatureProperties = TStoppingFeaturePropertiesBase;

export type TStoppingFeatureCollection = FeatureCollection<
    Polygon | MultiPolygon,
    TStoppingFeatureProperties
>;

export type TStoppingFeature = Feature<
    Polygon | MultiPolygon,
    TStoppingFeatureProperties
>;

/****************************************************************
 * US State Data File
 ****************************************************************/

export type TUSStateProperties = {
    name: string;
};

export type TUSStateFeatureCollection = FeatureCollection<
    Polygon | MultiPolygon,
    TUSStateProperties
>;

export type TRiverProperties = {
    feature_data_index: number;
    progress: number | null;
    name: string | null;
    distance_from_destination: number | null;
    stream_level: number | null;
    length_km?: number | null;
    stop_point?: number | null;
    feature_data?: Array<{
        geometry: Geometry;
    }>;
};

/**
 * TRunSettings mapping from legacy runSettings:
 *
 * zoom                         <- zoom
 * center                       <- center
 * cameraBaseAltitude           <- cameraBaseAltitude
 * pitch                        <- cameraPitch
 * initialBearing               <- initialBearing
 *
 * paths.coordinate             <- coordinatePath
 * paths.smoothed               <- smoothedPath
 *
 * distance                     <- routeDistance
 * gap                          <- distanceGap
 *
 * terrain.elevations           <- elevations
 * terrain.multiplier           <- terrainElevationMultiplier
 *
 * features                     <- riverFeatures
 * flowRates                    <- flowrates
 */
export type TRunSettings = {
    zoom: number;
    center: LngLatLike;
    cameraBaseAltitude: number;
    pitch: number;
    initialBearing: number;
    paths: {
        coordinate: Position[];
        smoothed: Position[];
    };
    distance: number;
    gap: number;
    terrain: {
        elevations: number[];
        multiplier: number;
    };
    features: TRiverProperties[];
    flowRates: number[];
    duration: number;
};

export type TFrameSettings = {
    startTime?: number;
    lastTime?: number;
    phase: number;
    tick: number;
    phaseGap: number;
    segment: {
        start: number | null;
        stop: number | null;
    };
    speedCoefficient: number;
};
