'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    TInitialState,
    initialState,
    TLoadingInstance,
} from '@/lib/state/loading/types';

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: initialState,
    reducers: {
        addLoadingInstance: (
            state,
            action: PayloadAction<TLoadingInstance>
        ) => {
            state.loadingInstances.push(action.payload);
        },
        removeLoadingInstance: (
            state,
            action: PayloadAction<TLoadingInstance['id']>
        ) => {
            const newLoadingInstances = state.loadingInstances.filter(
                ({ id }) => id !== action.payload
            );

            state.loadingInstances = newLoadingInstances;
        },
        setLoadingInstances: (
            state,
            action: PayloadAction<TInitialState['loadingInstances']>
        ) => {
            state.loadingInstances = action.payload;
        },
    },
});

export const {
    addLoadingInstance,
    removeLoadingInstance,
    setLoadingInstances,
} = loadingSlice.actions;

export default loadingSlice.reducer;
