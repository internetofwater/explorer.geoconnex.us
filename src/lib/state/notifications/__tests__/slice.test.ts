import reducer, {
    addNotification,
    removeNotification,
    setNotifications,
    hideNotification,
    markViewed,
} from '@/lib/state/notifications/slice';

import {
    initialState,
    NotificationType,
    TNotification,
} from '@/lib/state/notifications/types';

describe('notificationsSlice', () => {
    const notification: TNotification = {
        id: '1',
        message: 'Test Message',
        visible: true,
        viewed: false,
        createdAt: Date.now(),
        type: NotificationType.Info,
    };

    it('should return the initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addNotification', () => {
        const state = reducer(initialState, addNotification(notification));

        expect(state.notifications).toEqual([notification]);
    });

    it('should handle removeNotification', () => {
        const state = reducer(
            {
                ...initialState,
                notifications: [notification],
            },
            removeNotification(notification.id)
        );

        expect(state.notifications).toEqual([]);
    });

    it('should handle setNotifications', () => {
        const notifications = [
            notification,
            {
                ...notification,
                id: '2',
            },
        ];

        const state = reducer(initialState, setNotifications(notifications));

        expect(state.notifications).toEqual(notifications);
    });

    describe('hideNotification', () => {
        it('should hide a visible notification', () => {
            const state = reducer(
                {
                    ...initialState,
                    notifications: [notification],
                },
                hideNotification(notification.id)
            );

            expect(state.notifications[0].visible).toBe(false);
        });

        it('should do nothing when notification does not exist', () => {
            const state = reducer(
                {
                    ...initialState,
                    notifications: [notification],
                },
                hideNotification('missing-id')
            );

            expect(state.notifications[0].visible).toBe(true);
        });

        it('should do nothing when notification is already hidden', () => {
            const state = reducer(
                {
                    ...initialState,
                    notifications: [
                        {
                            ...notification,
                            visible: false,
                        },
                    ],
                },
                hideNotification(notification.id)
            );

            expect(state.notifications[0].visible).toBe(false);
        });
    });

    describe('markViewed', () => {
        it('should mark a notification as viewed', () => {
            const state = reducer(
                {
                    ...initialState,
                    notifications: [notification],
                },
                markViewed(notification.id)
            );

            expect(state.notifications[0].viewed).toBe(true);
        });

        it('should do nothing when notification does not exist', () => {
            const state = reducer(
                {
                    ...initialState,
                    notifications: [notification],
                },
                markViewed('missing-id')
            );

            expect(state.notifications[0].viewed).toBe(false);
        });

        it('should do nothing when notification is already viewed', () => {
            const state = reducer(
                {
                    ...initialState,
                    notifications: [
                        {
                            ...notification,
                            viewed: true,
                        },
                    ],
                },
                markViewed(notification.id)
            );

            expect(state.notifications[0].viewed).toBe(true);
        });
    });
});
