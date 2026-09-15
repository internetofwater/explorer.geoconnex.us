import store from '@/lib/state/store';
import LoadingManager from '@/managers/loading.manager';

export const loadingManager = new LoadingManager(store);
