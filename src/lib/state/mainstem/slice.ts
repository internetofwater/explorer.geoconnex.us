'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialState, initialState } from '@/lib/state/mainstem/types';
import { getDefaultRequest } from '@/lib/state/mainstem/utils';

export const mainstemSlice = createSlice({
    name: 'mainstem',
    initialState: initialState,
    reducers: {
        setTarget: (state, action: PayloadAction<InitialState['target']>) => {
            state.target = action.payload;
        },
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
});

export const {
    setTarget,
    setSelected,
    setMetrics,
    setBBox,
    setRequest,
    reset,
} = mainstemSlice.actions;

export default mainstemSlice.reducer;
