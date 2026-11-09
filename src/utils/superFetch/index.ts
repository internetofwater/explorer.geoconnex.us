import { TSuperFetchArgs } from '@/utils/superFetch/types';

/**
 * Enhanced fetch wrapper with centralized status handling, parsing,
 * optional caching, and lifecycle callbacks.
 *
 * Features:
 * - Cache lookups and writes
 * - Per-status response handlers
 * - Response parsing (json, blob, text, etc.)
 * - Error handling hooks
 * - Optional error rethrowing
 *
 * @template T
 *
 * @async
 * @param {TSuperFetchArgs<T>} options Request configuration.
 * @param {string} options.url Target URL.
 * @param {RequestInit} [options.init] Native fetch configuration.
 * @param {(response: Response) => Promise<T>} options.parse Function used to
 * transform the response into the desired type.
 *
 * @param {Map<string, T>} [options.cache] Cache instance used for storing and
 * retrieving parsed results.
 * @param {() => string} [options.getKey] Generates the cache key for lookups
 * and writes. Required when using cache.
 *
 * @param {Record<number, {
 *   shouldTerminate: boolean;
 *   action: (response?: Response) => void | Promise<void>;
 * }>} [options.statusHandlers]
 * Status-specific handlers keyed by HTTP status code.
 *
 * Handlers execute before parsing occurs. When a handler's
 * `shouldTerminate` value is true, execution stops and the function
 * returns undefined.
 *
 * @param {() => void} [options.onSuccess]
 * Invoked after a successful response is received and before parsing.
 *
 * @param {(error?: unknown) => void} [options.onCatch]
 * Invoked when an exception occurs.
 *
 * @param {() => void} [options.onFinally]
 * Invoked regardless of success, failure, or early termination.
 *
 * @param {boolean} [options.rethrow=true]
 * Whether caught errors should be rethrown after invoking onCatch.
 *
 * @returns {Promise<T | undefined>}
 * Parsed response data, cached data, or undefined when terminated
 * by a status handler or when an error occurs and rethrow is disabled.
 */
export const superFetch = async <T>({
    url,
    init,
    cache,
    getKey,
    statusHandlers = {},
    onSuccess,
    onCatch,
    onFinally,
    parse,
    rethrow = true,
}: TSuperFetchArgs<T>): Promise<T | undefined> => {
    try {
        let key;
        if (cache && getKey) {
            key = getKey();

            if (cache.has(key)) {
                return cache.get(key) as T;
            }
            // Log key miss?
        }

        const response = await fetch(url, init);

        const handler = statusHandlers[response.status];
        if (handler) {
            const { shouldTerminate, action } = handler;
            await action(response);
            if (shouldTerminate) {
                // Log?
                return;
            }
        }

        // Log?

        onSuccess?.();

        const result = await parse(response);

        if (cache && key) {
            // Log cache?
            cache.set(key, result);
        }
        return result;
    } catch (error) {
        // Log error
        onCatch?.(error);
        if (rethrow) {
            throw error;
        }
        return undefined;
    } finally {
        onFinally?.();
    }
};
