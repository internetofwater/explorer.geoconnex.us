'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialState, initialState, TNotification } from './types';

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<TNotification>) => {
            state.notifications.push(action.payload);
        },

        removeNotification: (
            state,
            action: PayloadAction<TNotification['id']>
        ) => {
            state.notifications = state.notifications.filter(
                ({ id }) => id !== action.payload
            );
        },

        setNotifications: (
            state,
            action: PayloadAction<InitialState['notifications']>
        ) => {
            state.notifications = action.payload;
        },

        hideNotification: (
            state,
            action: PayloadAction<TNotification['id']>
        ) => {
            const notification = state.notifications.find(
                (notification) => notification.id === action.payload
            );

            if (!notification || !notification.visible) {
                return;
            }

            notification.visible = false;
        },

        markViewed: (state, action: PayloadAction<TNotification['id']>) => {
            const notification = state.notifications.find(
                (notification) => notification.id === action.payload
            );

            if (!notification || notification.viewed) {
                return;
            }

            notification.viewed = true;
        },
    },
});

export const {
    addNotification,
    removeNotification,
    setNotifications,
    hideNotification,
    markViewed,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
