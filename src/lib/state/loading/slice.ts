'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    InitialState,
    initialState,
    TLoadingInstance,
} from '@/lib/state/loading/types';
import { randomUUID } from 'crypto';

export const loadingSlice = createSlice({
    name: 'main',
    initialState: initialState,
    reducers: {
        addLoadingInstance: (
            state,
            action: PayloadAction<TLoadingInstance>
        ) => {
            const id = randomUUID();

            const loadingInstance: TLoadingInstance = {
                ...action.payload,
                id,
            };

            state.loadingInstances.push(loadingInstance);
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
            action: PayloadAction<InitialState['loadingInstances']>
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
