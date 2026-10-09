'use client';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSummary, getDatasetsInBounds } from '@/lib/state/utils';
import { FeatureCollection, Point } from 'geojson';
import { LayerId, SubLayerId } from '@/app/features/MainMap/config';
import { Dataset } from '@/app/types';
import { Map } from 'mapbox-gl';
import { defaultGeoJson } from '@/lib/state/consts';
import { RootState } from '@/lib/state/store';
import { BasemapId, BasemapStyles } from '@/app/components/Map/types';
import { basemaps } from '@/app/components/Map/consts';
import { TDatasetCount } from '@/sparql/queries/getDatasetCount';
import { TTotalSites } from '@/sparql/queries/getTotalSites';
import { TVariablesMeasured } from '@/sparql/queries/getVariablesMeasured';
import { TTypes } from '@/sparql/queries/getTypes';
import { TDistributionNames } from '@/sparql/queries/getDistributionNames';
import type { GeocoderResult } from '@/app/hooks/useGeocoder';

export type SummaryData = Record<string, number>;

export type MainstemMetrics = {
    id: string;
    name: string;
    length: number;
    datasetCount: TDatasetCount;
    totalSites: TTotalSites;
    variables: TVariablesMeasured;
    distributionNames: TDistributionNames;
    types: TTypes;
};

export type Summary = {
    id: string;
    name: string;
    length: number;
    totalDatasets: number;
    totalSites: number;
    variables: SummaryData;
    types: SummaryData;
};

export const enum EOverlay {
    Help = 'help',
    Mainstem = 'mainstem',
}

type InitialState = {
    showSidePanel: boolean;
    showHelp: boolean;
    showResults: boolean;
    selectedBasemap: BasemapStyles;
    overlay: EOverlay | null;
    mapMoved: number | null;
    hoverId: string | null;
    searchResultIds: string[];
    status: string;
    error: string | null;
    datasets: FeatureCollection<Point, Dataset>;
    view: 'map' | 'table' | 'about';
    visibleLayers: {
        [LayerId.MajorRivers]: boolean;
        [LayerId.HUC2Boundaries]: boolean;
        [LayerId.Mainstems]: boolean;
        [SubLayerId.MainstemsSmall]: boolean;
        [SubLayerId.MainstemsMedium]: boolean;
        [SubLayerId.MainstemsLarge]: boolean;
        [SubLayerId.HUC2BoundaryLabels]: boolean;
        [LayerId.AssociatedData]: boolean;
        [SubLayerId.AssociatedDataClusterCount]: boolean;
        [SubLayerId.AssociatedDataClusters]: boolean;
        [SubLayerId.AssociatedDataUnclustered]: boolean;
    };
    filter: {
        distributionNames?: string[];
        siteNames?: string[];
        types?: string[];
        variables?: string[];
        startTemporalCoverage?: string;
        endTemporalCoverage?: string;
    };
    geocoderResult: GeocoderResult | null;
};

const initialState: InitialState = {
    showSidePanel: true,
    showHelp: false,
    showResults: false,
    overlay: null,
    selectedBasemap: basemaps[BasemapId.Dark],
    mapMoved: null,
    hoverId: null,
    searchResultIds: [],
    status: 'idle', // Additional state to track loading status
    error: null,
    datasets: defaultGeoJson as FeatureCollection<Point, Dataset>,
    view: 'map',
    visibleLayers: {
        [LayerId.MajorRivers]: true,
        [LayerId.HUC2Boundaries]: true,
        [LayerId.Mainstems]: true,
        [SubLayerId.MainstemsSmall]: true,
        [SubLayerId.MainstemsMedium]: true,
        [SubLayerId.MainstemsLarge]: true,
        [SubLayerId.HUC2BoundaryLabels]: true,
        [LayerId.AssociatedData]: true,
        [SubLayerId.AssociatedDataClusterCount]: true,
        [SubLayerId.AssociatedDataClusters]: true,
        [SubLayerId.AssociatedDataUnclustered]: true,
    },
    filter: {
        distributionNames: [],
        siteNames: [],
        types: [],
        variables: [],
    },
    geocoderResult: null,
};

export const getDatasetsLength = (state: RootState) =>
    state.main.datasets.features.length;

const selectDatasets = (state: RootState) => state.main.datasets;
const selectFilter = (state: RootState) => state.main.filter;

// Memoized selector to prevent false rerender requests
export const getFilteredDatasets = createSelector(
    [selectDatasets, selectFilter],
    (datasets, filter): FeatureCollection<Point, Dataset> => {
        // Apply filter automatically to the main datasets obj
        const features = datasets.features.filter((feature) => {
            const {
                siteName,
                distributionName,
                variableMeasured,
                type,
                temporalCoverage,
            } = feature.properties;
            const [startTemporal, endTemporal] = temporalCoverage.split('/');

            const startDate = new Date(startTemporal);
            const endDate = new Date(endTemporal);

            // If filter exists apply it

            // Check type
            const isTypeSelected =
                filter.types === undefined || filter.types.includes(type);

            if (!isTypeSelected) {
                return false;
            }
            // Check Site Name
            const isSiteNameSelected =
                filter.siteNames === undefined ||
                filter.siteNames.includes(siteName);

            if (!isSiteNameSelected) {
                return false;
            }

            // Check Distribution Name
            const isDistributionNameSelected =
                filter.distributionNames === undefined ||
                filter.distributionNames.includes(distributionName);

            if (!isDistributionNameSelected) {
                return false;
            }

            // Check variable measured
            const isVariableSelected =
                filter.variables === undefined ||
                filter.variables.includes(variableMeasured.split(' / ')[0]);

            if (!isVariableSelected) {
                return false;
            }

            // Check start of temporal coverages
            const isStartDateValid =
                filter.startTemporalCoverage === undefined ||
                new Date(filter.startTemporalCoverage) <= new Date(startDate);

            if (!isStartDateValid) {
                return false;
            }

            // Check end of temporal coverages
            const isEndDateValid =
                filter.endTemporalCoverage === undefined ||
                new Date(filter.endTemporalCoverage) >= new Date(endDate);

            if (!isEndDateValid) {
                return false;
            }

            // All true return true

            return true;
        });

        return {
            type: 'FeatureCollection',
            features: features,
        };
    }
);

const selectSelectedMainstem = (state: RootState) => state.mainstem.selected;
const selectMapMoved = (state: RootState) => state.main.mapMoved;
const selectMap = (state: RootState, map: Map | null) => map;

// Restrict the filtered datasets collection to what is within the current map bounds
export const getFilteredDatasetsInBounds = createSelector(
    [selectMapMoved, getFilteredDatasets, selectMap],
    (mapMoved, datasets, map): FeatureCollection<Point, Dataset> => {
        if (!map || !mapMoved) {
            return datasets;
        }

        const contained = getDatasetsInBounds(map, datasets);
        return contained;
    }
);

// Get all datasets within the current map bounds
export const getUnfilteredDatasetsInBounds = createSelector(
    [selectMapMoved, selectDatasets, selectMap],
    (mapMoved, datasets, map): FeatureCollection<Point, Dataset> => {
        if (!map || !mapMoved) {
            return datasets;
        }

        const contained = getDatasetsInBounds(map, datasets);
        return contained;
    }
);

// Create a summary for the restricted datasets
export const getSelectedSummary = createSelector(
    [selectSelectedMainstem, getFilteredDatasetsInBounds],
    (selectedMainstem, datasets): Summary | null => {
        if (!selectedMainstem) {
            return null;
        }

        const _datasets = datasets.features.map(
            (feature) => feature.properties
        );
        const selectedSummary = createSummary(selectedMainstem.id, {
            ...selectedMainstem,
            datasets: _datasets,
        });
        return selectedSummary;
    }
);

export const mainSlice = createSlice({
    name: 'main',
    initialState: initialState,
    reducers: {
        setShowSidePanel: (
            state,
            action: PayloadAction<InitialState['showSidePanel']>
        ) => {
            state.showSidePanel = action.payload;
        },
        setShowHelp: (
            state,
            action: PayloadAction<InitialState['showHelp']>
        ) => {
            state.showHelp = action.payload;
        },
        setShowResults: (
            state,
            action: PayloadAction<InitialState['showResults']>
        ) => {
            state.showResults = action.payload;
        },
        setOverlay: (state, action: PayloadAction<InitialState['overlay']>) => {
            state.overlay = action.payload;
        },
        setSearchResultIds: (
            state,
            action: PayloadAction<InitialState['searchResultIds']>
        ) => {
            state.searchResultIds = action.payload;
        },
        setDatasets: (
            state,
            action: PayloadAction<InitialState['datasets']>
        ) => {
            state.datasets = action.payload;
        },
        addDatasets: (
            state,
            action: PayloadAction<InitialState['datasets']['features']>
        ) => {
            state.datasets.features.push(...action.payload);
        },
        setSelectedBasemap: (
            state,
            action: PayloadAction<InitialState['selectedBasemap']>
        ) => {
            state.selectedBasemap = action.payload;
        },
        setLayerVisibility: (
            state,
            action: PayloadAction<Partial<InitialState['visibleLayers']>>
        ) => {
            state.visibleLayers = {
                ...state.visibleLayers,
                ...action.payload,
            };
        },
        setFilter: (
            state,
            action: PayloadAction<Partial<InitialState['filter']>>
        ) => {
            // Update filter
            const newFilter = {
                ...state.filter,
                ...action.payload,
            };

            state.filter = newFilter;
        },
        setMapMoved: (
            state,
            action: PayloadAction<InitialState['mapMoved']>
        ) => {
            state.mapMoved = action.payload;
        },
        setHoverId: (state, action: PayloadAction<InitialState['hoverId']>) => {
            state.hoverId = action.payload;
        },
        setView: (state, action: PayloadAction<InitialState['view']>) => {
            state.view = action.payload;
        },
        reset: (state) => {
            state.datasets = defaultGeoJson as FeatureCollection<
                Point,
                Dataset
            >;
            state.filter = {
                distributionNames: [],
                siteNames: [],
                types: [],
                variables: [],
            };
        },

        setGeocoderResult: (
            state,
            action: PayloadAction<InitialState['geocoderResult']>
        ) => {
            state.geocoderResult = action.payload;
        },
    },
});

export const {
    setShowSidePanel,
    setShowHelp,
    setShowResults,
    setSearchResultIds,
    setOverlay,
    setHoverId,
    setMapMoved,
    addDatasets,
    setDatasets,
    setLayerVisibility,
    setFilter,
    setView,
    setSelectedBasemap,
    setGeocoderResult,
    reset,
} = mainSlice.actions;

export default mainSlice.reducer;
