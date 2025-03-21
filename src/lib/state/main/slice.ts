'use client';
import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    createSummary,
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
    selectedMainstem: MainstemData | null;
    selectedMainstemId: string | null;
    selectedMainstemBBOX: LngLatBoundsLike | null;
    mapMoved: number | null;
    hoverId: string | null;
    selectedData: Dataset | null;
    selectedSummary: Summary | null;
    searchResultIds: string[];
    status: string;
    error: string | null;
    datasets: FeatureCollection<Point, Dataset>;
    visibleDatasetIds: string[];
    view: 'map' | 'table';
    visibleLayers: {
        [LayerId.MajorRivers]: boolean;
        [LayerId.HUC2Boundaries]: boolean;
        [LayerId.Mainstems]: boolean;
        [SubLayerId.MainstemsSmall]: boolean;
        [SubLayerId.MainstemsMedium]: boolean;
        [SubLayerId.MainstemsLarge]: boolean;
        [SubLayerId.HUC2BoundaryLabels]: boolean;
        [LayerId.AssociatedData]: boolean;
        [LayerId.SpiderifyPoints]: boolean;
        [SubLayerId.AssociatedDataClusterCount]: boolean;
        [SubLayerId.AssociatedDataClusters]: boolean;
        [SubLayerId.AssociatedDataUnclustered]: boolean;
    };
    filter: {
        selectedTypes?: string[];
        selectedVariables?: string[];
        startTemporalCoverage?: string;
        endTemporalCoverage?: string;
    };
};

const initialState: InitialState = {
    showSidePanel: true,
    showHelp: false,
    showResults: false,
    selectedMainstem: null,
    selectedMainstemId: null,
    selectedMainstemBBOX: null,
    mapMoved: null,
    hoverId: null,
    selectedData: null,
    selectedSummary: null,
    searchResultIds: [],
    status: 'idle', // Additional state to track loading status
    error: null,
    datasets: defaultGeoJson as FeatureCollection<Point, Dataset>,
    visibleDatasetIds: [],
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
        [LayerId.SpiderifyPoints]: true,
        [SubLayerId.AssociatedDataClusterCount]: true,
        [SubLayerId.AssociatedDataClusters]: true,
        [SubLayerId.AssociatedDataUnclustered]: true,
    },
    filter: {
        selectedTypes: [],
        selectedVariables: [],
    },
};

// Good candidate for caching
export const fetchDatasets = createAsyncThunk<
    Feature<Geometry, Omit<MainstemData, 'id'> & { datasets: Dataset[] }>,
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
export const getVisibleDatasetsLength = (state: RootState) =>
    state.main.visibleDatasetIds.length;

const selectDatasets = (state: RootState) => state.main.datasets;
const selectFilter = (state: RootState) => state.main.filter;

// Memoized selector to prevent false rerender requests
export const getDatasets = createSelector(
    [selectDatasets, selectFilter],
    (datasets, filter): FeatureCollection<Point, Dataset> => {
        if (
            !filter.selectedVariables &&
            !filter.startTemporalCoverage &&
            !filter.endTemporalCoverage
        ) {
            return datasets;
        }

        // Apply filter automatically to the main datasets obj
        const features = datasets.features.filter((feature) => {
            const { variableMeasured, temporalCoverage } = feature.properties;
            const [startTemporal, endTemporal] = temporalCoverage.split('/');

            const startDate = new Date(startTemporal);
            const endDate = new Date(endTemporal);

            // If filter exists apply it

            // Check variable measured
            const isVariableSelected =
                filter.selectedVariables === undefined ||
                filter.selectedVariables.includes(
                    variableMeasured.split(' / ')[0]
                );

            // Check start of temporal coverages
            const isStartDateValid =
                filter.startTemporalCoverage === undefined ||
                new Date(filter.startTemporalCoverage) <= new Date(startDate);
            // Check end of temporal coverages
            const isEndDateValid =
                filter.endTemporalCoverage === undefined ||
                new Date(filter.endTemporalCoverage) >= new Date(endDate);

            return isVariableSelected && isStartDateValid && isEndDateValid;
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

export const getSelectedSummary = createSelector(
    [selectSelectedMainstem, selectMapMoved, getDatasets, selectMap],
    (selectedMainstem, mapMoved, datasets, map): Summary | null => {
        if (!map || !selectedMainstem || !mapMoved) {
            return null;
        }
        const bounds = map.getBounds();
        if (bounds) {
            const southWest = bounds.getSouthWest();
            const northEast = bounds.getNorthEast();
            const southEast = bounds.getSouthEast();
            const northWest = bounds.getNorthWest();

            const bbox = turf.polygon([
                [
                    [northEast.lng, northEast.lat],
                    [northWest.lng, northWest.lat],
                    [southWest.lng, southWest.lat],
                    [southEast.lng, southEast.lat],
                    [northEast.lng, northEast.lat],
                ],
            ]);

            const contained = turf.pointsWithinPolygon(datasets, bbox);

            if (contained.features.length > 0) {
                const _datasets = contained.features.map(
                    (feature) => feature.properties
                );
                const selectedSummary = createSummary(selectedMainstem.id, {
                    ...selectedMainstem,
                    datasets: _datasets,
                });
                return selectedSummary;
            }
        }
        return null;
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
        setSelectedMainstemId: (
            state,
            action: PayloadAction<InitialState['selectedMainstemId']>
        ) => {
            state.selectedMainstemId = action.payload;
        },
        setSelectedData: (
            state,
            action: PayloadAction<InitialState['selectedData']>
        ) => {
            state.selectedData = action.payload;
        },
        setVisibleDatasetIds: (
            state,
            action: PayloadAction<InitialState['visibleDatasetIds']>
        ) => {
            state.visibleDatasetIds = action.payload;
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
        reset: (state) => {
            state.selectedMainstem = null;
            state.selectedMainstemId = null;
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
                if (action.payload) {
                    // Create a summary for this mainstem
                    const id = action.payload.id;

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { datasets: _, ...propertiesWithoutDatasets } =
                        action.payload.properties;

                    state.selectedMainstem = {
                        ...propertiesWithoutDatasets,
                        id: String(id),
                    };

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
    setSelectedMainstemId,
    setHoverId,
    setMapMoved,
    setDatasets,
    setLayerVisibility,
    setSelectedData,
    setVisibleDatasetIds,
    setFilter,
    setView,
    setSelectedMainstemBBOX,
    reset,
} = mainSlice.actions;

export default mainSlice.reducer;
