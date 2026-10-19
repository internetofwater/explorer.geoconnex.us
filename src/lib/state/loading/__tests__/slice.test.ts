import reducer, {
    addLoadingInstance,
    removeLoadingInstance,
    setLoadingInstances,
} from '@/lib/state/loading/slice';

import {
    initialState,
    LoadingType,
    TLoadingInstance,
} from '@/lib/state/loading/types';

describe('loadingSlice', () => {
    const loadingInstance: TLoadingInstance = {
        id: '1',
        message: 'Loading datasets...',
        type: LoadingType.Datasets,
    };

    it('should return the initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addLoadingInstance', () => {
        const state = reducer(
            initialState,
            addLoadingInstance(loadingInstance)
        );

        expect(state.loadingInstances).toEqual([loadingInstance]);
    });

    it('should handle removeLoadingInstance', () => {
        const state = reducer(
            {
                ...initialState,
                loadingInstances: [loadingInstance],
            },
            removeLoadingInstance(loadingInstance.id)
        );

        expect(state.loadingInstances).toEqual([]);
    });

    it('should handle removing a non-existent loading instance', () => {
        const state = reducer(
            {
                ...initialState,
                loadingInstances: [loadingInstance],
            },
            removeLoadingInstance('missing-id')
        );

        expect(state.loadingInstances).toEqual([loadingInstance]);
    });

    it('should handle setLoadingInstances', () => {
        const loadingInstances = [
            loadingInstance,
            {
                ...loadingInstance,
                id: '2',
                message: 'Loading metrics...',
            },
        ];

        const state = reducer(
            initialState,
            setLoadingInstances(loadingInstances)
        );

        expect(state.loadingInstances).toEqual(loadingInstances);
    });

    it('should replace existing loading instances when setLoadingInstances is called', () => {
        const existingState = {
            ...initialState,
            loadingInstances: [loadingInstance],
        };

        const newLoadingInstances: TLoadingInstance[] = [
            {
                id: '2',
                message: 'Loading metrics...',
                type: LoadingType.FetchModalMetrics,
            },
        ];

        const state = reducer(
            existingState,
            setLoadingInstances(newLoadingInstances)
        );

        expect(state.loadingInstances).toEqual(newLoadingInstances);
    });
});
