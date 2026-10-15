import reducer, {
    setTarget,
    setSelected,
    setMetrics,
    setBBox,
    setRequest,
    reset,
} from '@/lib/state/mainstem/slice';

import { initialState, TInitialState } from '@/lib/state/mainstem/types';
import { getDefaultRequest } from '@/lib/state/mainstem/utils';

describe('mainstemSlice', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setTarget', () => {
        const target = {
            uri: 'mainstem-uri',
            name: 'Test Mainstem',
        };

        const state = reducer(initialState, setTarget(target as any));

        expect(state.target).toEqual(target);
    });

    it('should handle setSelected', () => {
        const selected = {
            id: '123',
        };

        const state = reducer(initialState, setSelected(selected as any));

        expect(state.selected).toEqual(selected);
    });

    it('should handle setMetrics', () => {
        const metrics = {
            datasetCount: { count: 10 },
        };

        const state = reducer(initialState, setMetrics(metrics as any));

        expect(state.metrics).toEqual(metrics);
    });

    it('should handle setBBox', () => {
        const bbox = [-124, 42, -123, 43];

        const state = reducer(initialState, setBBox(bbox as any));

        expect(state.bbox).toEqual(bbox);
    });

    it('should handle setRequest', () => {
        const state = reducer(
            initialState,
            setRequest({
                variables: ['Temperature'],
            })
        );

        expect(state.request).toEqual({
            ...initialState.request,
            variables: ['Temperature'],
        });
    });

    it('should merge request values instead of replacing the request object', () => {
        const startingState: TInitialState = {
            ...initialState,
            request: {
                id: 'test',
                variables: ['pH'],
                types: ['Lake'],
                distributionNames: ['USGS'],
            },
        };

        const state = reducer(
            startingState,
            setRequest({
                variables: ['Temperature'],
            })
        );

        expect(state.request).toEqual({
            id: 'test',
            variables: ['Temperature'],
            types: ['Lake'],
            distributionNames: ['USGS'],
        });
    });

    it('should reset the state', () => {
        const state = reducer(
            {
                ...initialState,
                selected: { id: '123' } as any,
                metrics: { datasetCount: { count: 5 } } as any,
                bbox: [-124, 42, -123, 43] as any,
                request: {
                    id: 'test',
                    variables: ['Temperature'],
                    types: ['Lake'],
                    distributionNames: ['USGS'],
                },
            },
            reset()
        );

        expect(state.selected).toBeNull();
        expect(state.metrics).toBeNull();
        expect(state.bbox).toBeNull();
        expect(state.request).toEqual(getDefaultRequest());

        // reset intentionally preserves target
        expect(state.target).toEqual(initialState.target);
    });
});
