'use client';
import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    createFilters,
    createSummary,
    getDatasetsInBounds,
    getMainstemBuffer,
    transformDatasets,
} from '@/lib/state/utils';
import { Feature, FeatureCollection, Geometry, Point } from 'geojson';
import { LayerId, SubLayerId } from '@/app/features/MainMap/config';
import { Dataset, MainstemData } from '@/app/types';
import { LngLatBoundsLike, Map } from 'mapbox-gl';
import * as turf from '@turf/turf';
import { defaultGeoJson } from '@/lib/state/consts';
import { RootState } from '@/lib/state/store';
import { BasemapId, BasemapStyles } from '@/app/components/Map/types';
import { basemaps } from '@/app/components/Map/consts';

export type SummaryData = Record<string, number>;

export type Summary = {
    id: string;
    name: string;
    length: number;
    totalDatasets: number;
    totalSites: number;
    variables: SummaryData;
    types: SummaryData;
    techniques: SummaryData;
};

type InitialState = {
    showSidePanel: boolean;
    showHelp: boolean;
    showResults: boolean;
    selectedBasemap: BasemapStyles;
    selectedMainstem: MainstemData | null;
    selectedMainstemBBOX: LngLatBoundsLike | null;
    mapMoved: number | null;
    hoverId: string | null;
    selectedSummary: Summary | null;
    searchResultIds: string[];
    status: string;
    error: string | null;
    loading: {
        loading: boolean;
        item: 'results-hover' | 'datasets' | 'search-results' | 'rendering';
    };
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
};

const initialState: InitialState = {
    showSidePanel: true,
    showHelp: false,
    showResults: false,
    selectedBasemap: basemaps[BasemapId.Dark],
    selectedMainstem: null,
    selectedMainstemBBOX: null,
    mapMoved: null,
    hoverId: null,
    selectedSummary: null,
    searchResultIds: [],
    status: 'idle', // Additional state to track loading status
    error: null,
    loading: {
        loading: false,
        item: 'datasets',
    },
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
};

type FetchDatasetsSuccess = Feature<
    Geometry,
    Omit<MainstemData, 'id'> & { datasets?: Dataset[] }
>;
type FetchDatasetsNotFound = {
    code: string;
    type: string;
    description: string;
};

function isFetchDatasetsSuccess(
    payload: FetchDatasetsSuccess | FetchDatasetsNotFound
): payload is FetchDatasetsSuccess {
    return Boolean(payload && (payload as FetchDatasetsSuccess).properties);
}

// Good candidate for caching
export const fetchDatasets = createAsyncThunk<
    FetchDatasetsSuccess | FetchDatasetsNotFound,
    string
>('main/fetchDatasets', async (id: string) => {
    const response = await fetch(
        `https://reference.geoconnex.us/collections/mainstems/items/${id}`
    );
    const data = (await response.json()) as Feature<
        Geometry,
        Omit<MainstemData, 'id'> & { datasets: Dataset[] }
    >;
    return data;
});

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

const selectSelectedMainstem = (state: RootState) =>
    state.main.selectedMainstem;
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
        setSelectedBasemap: (
            state,
            action: PayloadAction<InitialState['selectedBasemap']>
        ) => {
            state.selectedBasemap = action.payload;
        },
        setSelectedMainstem: (
            state,
            action: PayloadAction<InitialState['selectedMainstem']>
        ) => {
            state.selectedMainstem = action.payload;
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
        setSelectedMainstemBBOX: (
            state,
            action: PayloadAction<InitialState['selectedMainstemBBOX']>
        ) => {
            state.selectedMainstemBBOX = action.payload;
        },
        setLoading: (state, action: PayloadAction<InitialState['loading']>) => {
            state.loading = action.payload;
        },

        reset: (state) => {
            state.selectedMainstem = null;
            state.selectedMainstemBBOX = null;
            state.datasets = defaultGeoJson as FeatureCollection<
                Point,
                Dataset
            >;
            state.selectedSummary = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDatasets.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDatasets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload && isFetchDatasetsSuccess(action.payload)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars

                    const {
                        datasets: _datasets,
                        ...propertiesWithoutDatasets
                    } = action.payload.properties;

                    // Redundant, but covers load from route param
                    state.selectedMainstem = {
                        ...propertiesWithoutDatasets,
                        id: String(action.payload.id),
                    };

                    if (_datasets) {
                        state.filter = createFilters(_datasets);
                    }

                    // Get an appropriate buffer size based on drainage area
                    const buffer = getMainstemBuffer(
                        action.payload.properties.outlet_drainagearea_sqkm
                    );
                    // Simplify the line to reduce work getting bounds
                    const simplifiedLine = turf.simplify(action.payload, {
                        tolerance: 0.25,
                    });
                    // Buffer line to better fit feature to screen
                    const bufferedLine = turf.buffer(simplifiedLine, buffer, {
                        units: 'kilometers',
                    });
                    if (bufferedLine) {
                        const bbox = turf.bbox(
                            bufferedLine
                        ) as LngLatBoundsLike;

                        state.selectedMainstemBBOX = bbox;
                    }
                    // Transform datasets into a new feature collection
                    const datasets = transformDatasets(action.payload);

                    state.datasets = datasets;
                    state.showResults = false;
                }
                return;
            })
            .addCase(fetchDatasets.rejected, (state, action) => {
                state.status = 'failed';
                console.log('Error: ', action);
            });
    },
});

export const {
    setShowSidePanel,
    setShowHelp,
    setShowResults,
    setSearchResultIds,
    setHoverId,
    setMapMoved,
    setDatasets,
    setLayerVisibility,
    setFilter,
    setView,
    setSelectedBasemap,
    setSelectedMainstem,
    setSelectedMainstemBBOX,
    setLoading,
    reset,
} = mainSlice.actions;

export default mainSlice.reducer;
