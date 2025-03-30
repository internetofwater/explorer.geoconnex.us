/**
 * Primary mainstem data type.
 * When requesting from /items contains just below.
 * When requesting from /items/[uri] contains an additional optional
 * key 'datasets' containing 0 -> 100,000 objects containing the properties
 * in type Datasets.
 *
 * @interface
 */
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
 * Dataset type containing properties for datasets.
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
