/**
 * Copyright 2025 Lincoln Institute of Land Policy
 * SPDX-License-Identifier: Apache-2.0
 */

import { v6 } from 'uuid';
import { Store } from '@/lib/state/store';
import {
    addNotification,
    hideNotification,
    markViewed,
    removeNotification,
} from '@/lib/state/notifications/slice';
import {
    NotificationType,
    TNotification,
    TNotificationType,
} from '@/lib/state/notifications/types';

type Timer = {
    timeoutId: ReturnType<typeof setTimeout>;
    startTime: number;
    remaining: number;
};

class NotificationManager {
    private timers: Map<string, Timer>;
    private store: Store;

    constructor(store: Store) {
        this.store = store;
        this.timers = new Map<string, Timer>();
    }

    private createUUID(): TNotification['id'] {
        return v6();
    }

    private get(id: TNotification['id']): Timer | undefined {
        return this.timers.get(id);
    }

    private add(id: TNotification['id'], timer: Timer) {
        this.timers.set(id, timer);
    }

    private remove(id: TNotification['id']) {
        this.timers.delete(id);
    }

    private startTimer(
        id: TNotification['id'],
        duration: number
    ): ReturnType<typeof setTimeout> {
        return setTimeout(() => {
            this.store.dispatch(hideNotification(id));
            this.remove(id);
        }, duration);
    }

    show(
        message: string,
        type: TNotificationType = NotificationType.Info,
        duration: number = 3000
    ): TNotification['id'] {
        const id = this.createUUID();

        const notification: TNotification = {
            id,
            message,
            type,
            visible: true,
            viewed: false,
            createdAt: Date.now(),
        };

        this.store.dispatch(addNotification(notification));

        const startTime = Date.now();
        const timeoutId = this.startTimer(id, duration);

        this.add(id, {
            timeoutId,
            startTime,
            remaining: duration,
        });

        return id;
    }

    pause(id: string) {
        const timer = this.get(id);

        if (!timer) {
            throw new Error(`Error: no timer instance found for id: ${id}`);
        }

        if (timer) {
            clearTimeout(timer.timeoutId);
            timer.remaining -= Date.now() - timer.startTime;
        }

        this.store.dispatch(markViewed(id));
    }

    resume(id: string) {
        const timer = this.get(id);

        if (!timer) {
            throw new Error(`Error: no timer instance found for id: ${id}`);
        }

        if (timer.remaining > 0) {
            timer.startTime = Date.now();
            timer.timeoutId = this.startTimer(id, timer.remaining);
        }
    }

    hide(id: string) {
        const timer = this.get(id);

        if (!timer) {
            throw new Error(`Error: no timer instance found for id: ${id}`);
        }

        if (timer) {
            clearTimeout(timer.timeoutId);
            this.remove(id);
        }

        this.store.dispatch(hideNotification(id));
    }

    viewed(id: string) {
        this.store.dispatch(markViewed(id));
    }

    delete(id: string) {
        const timer = this.get(id);

        // This notification will likely not have a timeout instance
        if (timer) {
            clearTimeout(timer.timeoutId);
            this.remove(id);
        }

        this.store.dispatch(removeNotification(id));
    }
}

export default NotificationManager;
