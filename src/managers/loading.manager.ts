import { Store } from '@/lib/state/store';
import { TLoadingInstance } from '@/lib/state/loading/types';
import {
    addLoadingInstance,
    removeLoadingInstance,
} from '@/lib/state/loading/slice';
import { v6 } from 'uuid';

class LoadingManager {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    private createUUID(): TLoadingInstance['id'] {
        return v6();
    }

    add(
        message: TLoadingInstance['message'],
        item: TLoadingInstance['type']
    ): TLoadingInstance['id'] {
        const loadingInstance: TLoadingInstance = {
            id: this.createUUID(),
            type: item,
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
        type,
    }: {
        message?: TLoadingInstance['message'];
        type?: TLoadingInstance['type'];
    }): boolean {
        const loadingInstances = this.store.getState().loading.loadingInstances;

        if (message) {
            return loadingInstances.some((instance) =>
                instance.message.includes(message)
            );
        }

        if (type) {
            return loadingInstances.some((instance) => instance.type === type);
        }

        return false;
    }
}

export default LoadingManager;
