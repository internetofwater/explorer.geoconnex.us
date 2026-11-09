'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    initialState,
    type TInitialState,
} from '@/lib/state/river-runner/types';
import { TRunSettings } from '@/services/river-runner/types';

export const riverRunner = createSlice({
    name: 'river-runner',
    initialState: initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<TInitialState['status']>) => {
            state.status = action.payload;
        },
        setFlag: (
            state,
            action: PayloadAction<Partial<TInitialState['flags']>>
        ) => {
            state.flags = { ...state.flags, ...action.payload };
        },
        setStart: (
            state,
            action: PayloadAction<Partial<TInitialState['driver']['start']>>
        ) => {
            state.driver.start = action.payload;
        },
        setStop: (
            state,
            action: PayloadAction<Partial<TInitialState['driver']['stop']>>
        ) => {
            state.driver.stop = action.payload;
        },
        setPerspective: (
            state,
            action: PayloadAction<TInitialState['perspective']>
        ) => {
            state.perspective = action.payload;
        },
        addRun: (state, action: PayloadAction<TRunSettings>) => {
            state.runs.push(action.payload);
        },
        setActiveFeatureIndex: (
            state,
            action: PayloadAction<TInitialState['featureIndex']>
        ) => {
            state.featureIndex = action.payload;
        },
        setPhaseJump: (
            state,
            action: PayloadAction<TInitialState['phaseJump']>
        ) => {
            state.phaseJump = action.payload;
        },
    },
});

export const {
    setStatus,
    setFlag,
    setStart,
    setStop,
    setPerspective,
    addRun,
    setActiveFeatureIndex,
    setPhaseJump,
} = riverRunner.actions;

export default riverRunner.reducer;
