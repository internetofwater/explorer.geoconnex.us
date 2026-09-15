'use client';
import { configureStore } from '@reduxjs/toolkit';
import mainReducer from '@/lib/state/main/slice';
import loadingReducer from '@/lib/state/loading/slice';

const store = configureStore({
    reducer: {
        main: mainReducer,
        loading: loadingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;

export default store;
