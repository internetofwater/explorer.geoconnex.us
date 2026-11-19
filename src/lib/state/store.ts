'use client';
import { configureStore } from '@reduxjs/toolkit';
import mainReducer from '@/lib/state/main/slice';
import loadingReducer from '@/lib/state/loading/slice';
import notificationsReducer from '@/lib/state/notifications/slice';
import mainstemReducer from '@/lib/state/mainstem/slice';
import riverRunnerReducer from '@/lib/state/river-runner/slice';

const store = configureStore({
    reducer: {
        main: mainReducer,
        mainstem: mainstemReducer,
        loading: loadingReducer,
        notifications: notificationsReducer,
        riverRunner: riverRunnerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;

export default store;
