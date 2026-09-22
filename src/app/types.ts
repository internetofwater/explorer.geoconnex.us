/**
 * Primary mainstem data type. Excluding datasets property.
 *
 *
 * @interface
 */
// When requesting from /items contains just below.
// When requesting from /items/[uri] contains an additional optional
// key 'datasets' containing 0 -> 100,000 objects containing the properties

import type { LngLatBoundsLike } from 'mapbox-gl';

// in type Datasets.
export interface MainstemData {
    downstream_mainstem_id: string;
    encompassing_mainstem_basins: string[];
    featuretype: string[];
    fid: number;
    head_2020huc12: string;
    head_nhdpv1_comid: number;
    head_nhdpv2_comid: string;
    head_nhdpv2huc12: string;
    head_rf1id: number;
    id: string;
    lengthkm: number;
    name_at_outlet: string;
    name_at_outlet_gnis_id: number;
    new_mainstemid: string;
    outlet_2020huc12: string;
    outlet_drainagearea_sqkm: number;
    outlet_nhdpv1_comid: number;
    outlet_nhdpv2_comid: string;
    outlet_nhdpv2huc12: string;
    outlet_rf1id: number;
    superseded: boolean;
    uri: string;
}

/**
 * Type containing properties of datasets.
 *
 * @type
 */
export type Dataset = {
    datasetDescription: string;
    distributionFormat: string;
    distributionName: string;
    distributionURL: string;
    measurementTechnique: string;
    monitoringLocation: string;
    siteName: string;
    temporalCoverage: string;
    type: string;
    url: string;
    variableMeasured: string;
    variableUnit: string;
    wkt: string;
};

export interface StateData {
    affgeoid: string;
    census_profile: string;
    fid: number;
    geoid: string;
    lsad: string;
    name: string;
    statefp: string;
    statens: string;
    stusps: string;
    uri: string;
}

export interface HydratedStateData extends StateData {
    bounds: LngLatBoundsLike;
    id: string;
}

export interface CountyData {
    affgeoid: string;
    census_profile: string;
    countyfp: string;
    countyns: string;
    fid: number;
    geoid: string;
    lsad: string;
    name: string;
    statefp: string;
    uri: string;
}

export interface HydratedCountyData extends CountyData {
    bounds: LngLatBoundsLike;
    id: string;
    stateName: string;
}
