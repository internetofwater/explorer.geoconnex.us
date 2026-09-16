import store from '@/lib/state/store';
import LoadingManager from '@/managers/loading.manager';
import NotificationManager from '@/managers/notification.manager';

export const loadingManager = new LoadingManager(store);

export const notificationManager = new NotificationManager(store);
