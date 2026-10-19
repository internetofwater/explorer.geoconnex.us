import NotificationManager from '@/managers/notification.manager';
import {
    addNotification,
    hideNotification,
    markViewed,
    removeNotification,
} from '@/lib/state/notifications/slice';
import { NotificationType } from '@/lib/state/notifications/types';

jest.mock('uuid', () => ({
    v6: jest.fn(),
}));

import { v6 } from 'uuid';

describe('NotificationManager', () => {
    let store: any;
    let manager: NotificationManager;

    beforeEach(() => {
        jest.useFakeTimers();

        store = {
            dispatch: jest.fn(),
        };

        manager = new NotificationManager(store);

        (v6 as jest.Mock).mockReturnValue('notification-id');
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should create and dispatch a notification', () => {
        const id = manager.show('Hello world', NotificationType.Info, 5000);

        expect(id).toBe('notification-id');

        expect(store.dispatch).toHaveBeenCalledWith(
            addNotification(
                expect.objectContaining({
                    id: 'notification-id',
                    message: 'Hello world',
                    type: NotificationType.Info,
                    visible: true,
                    viewed: false,
                })
            )
        );
    });

    it('should hide notification after duration', () => {
        manager.show('Hello world', NotificationType.Info, 3000);

        jest.advanceTimersByTime(3000);

        expect(store.dispatch).toHaveBeenLastCalledWith(
            hideNotification('notification-id')
        );
    });

    it('should mark notification as viewed when paused', () => {
        const id = manager.show('Hello');

        manager.pause(id);

        expect(store.dispatch).toHaveBeenCalledWith(markViewed(id));
    });

    it('should throw when pausing unknown notification', () => {
        expect(() => manager.pause('missing')).toThrow(
            'Error: no timer instance found for id: missing'
        );
    });

    it('should throw when resuming unknown notification', () => {
        expect(() => manager.resume('missing')).toThrow(
            'Error: no timer instance found for id: missing'
        );
    });

    it('should hide notification', () => {
        const id = manager.show('Hello');

        manager.hide(id);

        expect(store.dispatch).toHaveBeenCalledWith(hideNotification(id));
    });

    it('should throw when hiding unknown notification', () => {
        expect(() => manager.hide('missing')).toThrow(
            'Error: no timer instance found for id: missing'
        );
    });

    it('should mark notification as viewed', () => {
        manager.viewed('notification-id');

        expect(store.dispatch).toHaveBeenCalledWith(
            markViewed('notification-id')
        );
    });

    it('should remove notification', () => {
        manager.delete('notification-id');

        expect(store.dispatch).toHaveBeenCalledWith(
            removeNotification('notification-id')
        );
    });

    it('should clear timer and remove notification', () => {
        const id = manager.show('Hello');

        manager.delete(id);

        expect(store.dispatch).toHaveBeenCalledWith(removeNotification(id));

        jest.advanceTimersByTime(5000);

        expect(store.dispatch).not.toHaveBeenCalledWith(hideNotification(id));
    });
});
