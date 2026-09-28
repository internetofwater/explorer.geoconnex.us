'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialState, initialState } from '@/lib/state/mainstem/types';
import { getDefaultRequest } from './utils';

export const mainstemSlice = createSlice({
    name: 'mainstem',
    initialState: initialState,
    reducers: {
        setSelected: (
            state,
            action: PayloadAction<InitialState['selected']>
        ) => {
            state.selected = action.payload;
        },
        setMetrics: (state, action: PayloadAction<InitialState['metrics']>) => {
            state.metrics = action.payload;
        },
        setBBox: (state, action: PayloadAction<InitialState['bbox']>) => {
            state.bbox = action.payload;
        },

        setRequest: (
            state,
            action: PayloadAction<Partial<InitialState['request']>>
        ) => {
            const newRequest = {
                ...state.request,
                ...action.payload,
            };

            state.request = newRequest;
        },
        reset: (state) => {
            state.selected = null;
            state.request = getDefaultRequest();
            state.metrics = null;
            state.bbox = null;
        },
    },
    //     extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchDatasets.pending, (state) => {
    //             state.status = 'loading';
    //             state.error = null;
    //         })
    //         .addCase(fetchDatasets.fulfilled, (state, action) => {
    //             state.status = 'succeeded';
    //             if (action.payload && isFetchDatasetsSuccess(action.payload)) {
    //                 // eslint-disable-next-line @typescript-eslint/no-unused-vars

    //                 const {
    //                     datasets: _datasets,
    //                     ...propertiesWithoutDatasets
    //                 } = action.payload.properties;

    //                 // Redundant, but covers load from route param
    //                 state.selectedMainstem = {
    //                     ...propertiesWithoutDatasets,
    //                     id: String(action.payload.id),
    //                 };

    //                 if (_datasets) {
    //                     state.filter = createFilters(_datasets);
    //                 }

    //                 // Get an appropriate buffer size based on drainage area
    //                 const buffer = getMainstemBuffer(
    //                     action.payload.properties.outlet_drainagearea_sqkm
    //                 );
    //                 // Simplify the line to reduce work getting bounds
    //                 const simplifiedLine = turf.simplify(action.payload, {
    //                     tolerance: 0.25,
    //                 });
    //                 // Buffer line to better fit feature to screen
    //                 const bufferedLine = turf.buffer(simplifiedLine, buffer, {
    //                     units: 'kilometers',
    //                 });
    //                 if (bufferedLine) {
    //                     const bbox = turf.bbox(
    //                         bufferedLine
    //                     ) as LngLatBoundsLike;

    //                     state.selectedMainstemBBOX = bbox;
    //                 }
    //                 // Transform datasets into a new feature collection
    //                 const datasets = transformDatasets(action.payload);

    //                 state.datasets = datasets;
    //                 state.showResults = false;
    //             }
    //             return;
    //         })
    //         .addCase(fetchDatasets.rejected, (state, action) => {
    //             state.status = 'failed';
    //             console.log('Error: ', action);
    //         });
    // },
});

export const { setSelected, setMetrics, setBBox, setRequest, reset } =
    mainstemSlice.actions;

export default mainstemSlice.reducer;
