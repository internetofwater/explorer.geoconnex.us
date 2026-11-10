import type { Store } from '@/lib/state/store';
import { TRunSettings } from '@/services/river-runner/types';
import {
    addRun,
    setActiveFeatureIndex,
    setFlag,
    setPhaseJump,
    setStart,
    setStatus,
    setStop,
} from '@/lib/state/river-runner/slice';
import { TInitialState } from '@/lib/state/river-runner/types';

export class RiverRunnerStateService {
    private store: Store;
    constructor(store: Store) {
        this.store = store;
    }

    // Flags
    hasAborted() {
        return this.store.getState().riverRunner.flags.abort;
    }
    hasPaused() {
        return this.store.getState().riverRunner.flags.paused;
    }
    setFlag(payload: Partial<TInitialState['flags']>) {
        this.store.dispatch(setFlag(payload));
    }

    // Status
    getStatus() {
        return this.store.getState().riverRunner.status;
    }
    setStatus(payload: Partial<TInitialState['status']>) {
        this.store.dispatch(setStatus(payload));
    }

    setStart(payload: TInitialState['segment']['start']) {
        this.store.dispatch(setStart(payload));
    }
    setStop(payload: TInitialState['segment']['stop']) {
        this.store.dispatch(setStop(payload));
    }

    // Run History
    // TODO: reduce object size here?
    saveRun(payload: TRunSettings) {
        this.store.dispatch(addRun(payload));
    }

    // Active Feature Index
    getActiveFeatureIndex() {
        return this.store.getState().riverRunner.featureIndex;
    }
    setActiveFeatureIndex(payload: TInitialState['featureIndex']) {
        this.store.dispatch(setActiveFeatureIndex(payload));
    }

    // Phase Jump
    getPhaseJump() {
        return this.store.getState().riverRunner.phaseJump;
    }
    setPhaseJump(payload: TInitialState['phaseJump']) {
        this.store.dispatch(setPhaseJump(payload));
    }
}
