import {
    addLoadingInstance,
    removeLoadingInstance,
} from '@/lib/state/loading/slice';

jest.mock('uuid', () => ({
    v6: jest.fn(),
}));

import { v6 } from 'uuid';
import LoadingManager from '@/managers/loading.manager';

describe('LoadingManager', () => {
    let store: any;
    let manager: LoadingManager;

    beforeEach(() => {
        jest.clearAllMocks();

        store = {
            dispatch: jest.fn(),
            getState: jest.fn().mockReturnValue({
                loading: {
                    loadingInstances: [],
                },
            }),
        };

        manager = new LoadingManager(store);
    });

    describe('add', () => {
        it('should create and dispatch a loading instance', () => {
            (v6 as jest.Mock).mockReturnValue('test-id');

            const id = manager.add('Loading datasets', 'datasets');

            expect(id).toBe('test-id');

            expect(store.dispatch).toHaveBeenCalledWith(
                addLoadingInstance({
                    id: 'test-id',
                    type: 'datasets',
                    message: 'Loading datasets',
                })
            );
        });
    });

    describe('remove', () => {
        it('should dispatch removeLoadingInstance', () => {
            const result = manager.remove('test-id');

            expect(store.dispatch).toHaveBeenCalledWith(
                removeLoadingInstance('test-id')
            );

            expect(result).toBeNull();
        });
    });

    describe('has', () => {
        it('should return true when a matching message exists', () => {
            store.getState.mockReturnValue({
                loading: {
                    loadingInstances: [
                        {
                            id: '1',
                            type: 'datasets',
                            message: 'Loading datasets...',
                        },
                    ],
                },
            });

            expect(
                manager.has({
                    message: 'Loading datasets',
                })
            ).toBe(true);
        });

        it('should return false when a matching message does not exist', () => {
            store.getState.mockReturnValue({
                loading: {
                    loadingInstances: [
                        {
                            id: '1',
                            type: 'datasets',
                            message: 'Loading datasets...',
                        },
                    ],
                },
            });

            expect(
                manager.has({
                    message: 'Loading summary',
                })
            ).toBe(false);
        });

        it('should return true when a matching type exists', () => {
            store.getState.mockReturnValue({
                loading: {
                    loadingInstances: [
                        {
                            id: '1',
                            type: 'datasets',
                            message: 'Loading datasets...',
                        },
                    ],
                },
            });

            expect(
                manager.has({
                    type: 'datasets',
                })
            ).toBe(true);
        });

        it('should return false when a matching type does not exist', () => {
            store.getState.mockReturnValue({
                loading: {
                    loadingInstances: [
                        {
                            id: '1',
                            type: 'datasets',
                            message: 'Loading datasets...',
                        },
                    ],
                },
            });

            expect(
                manager.has({
                    type: 'metrics',
                })
            ).toBe(false);
        });

        it('should return false when neither message nor type is provided', () => {
            expect(manager.has({})).toBe(false);
        });

        it('should prioritize message matching over type matching', () => {
            store.getState.mockReturnValue({
                loading: {
                    loadingInstances: [
                        {
                            id: '1',
                            type: 'datasets',
                            message: 'Loading datasets...',
                        },
                    ],
                },
            });

            expect(
                manager.has({
                    message: 'not found',
                    type: 'datasets',
                })
            ).toBe(false);
        });
    });
});
