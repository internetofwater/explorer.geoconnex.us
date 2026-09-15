'use client';
import { configureStore } from '@reduxjs/toolkit';
import mainReducer from '@/lib/state/main/slice';
import loadingReducer from '@/lib/state/loading/slice';
import notificationsReducer from '@/lib/state/notifications/slice';

const store = configureStore({
    reducer: {
        main: mainReducer,
        loading: loadingReducer,
        notifications: notificationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;

export default store;
