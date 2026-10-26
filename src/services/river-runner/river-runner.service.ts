import { Store } from '@/lib/state/store';

export class RiverRunnerService {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }
}
