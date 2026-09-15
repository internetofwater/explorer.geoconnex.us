import { Store } from '@/lib/state/store';
import { TLoadingInstance } from '@/lib/state/loading/types';
import { randomUUID } from 'crypto';
import {
    addLoadingInstance,
    removeLoadingInstance,
} from '@/lib/state/loading/slice';

class LoadingManager {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    private createUUID(): TLoadingInstance['id'] {
        return randomUUID();
    }

    add(
        message: TLoadingInstance['message'],
        item: TLoadingInstance['item']
    ): TLoadingInstance['id'] {
        const loadingInstance: TLoadingInstance = {
            id: this.createUUID(),
            item,
            message,
        };

        this.store.dispatch(addLoadingInstance(loadingInstance));

        return loadingInstance.id;
    }

    remove(id: TLoadingInstance['id']): null {
        this.store.dispatch(removeLoadingInstance(id));

        return null;
    }

    has({
        message,
        item,
    }: {
        message?: TLoadingInstance['message'];
        item?: TLoadingInstance['item'];
    }): boolean {
        const loadingInstances = this.store.getState().loading.loadingInstances;

        if (message) {
            return loadingInstances.some((instance) =>
                instance.message.includes(message)
            );
        }

        if (item) {
            return loadingInstances.some((instance) => instance.item === item);
        }

        return false;
    }
}

export default LoadingManager;
