import { useEffect, useRef, useState } from 'react';
import { bbox } from '@turf/turf';

import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { LngLatBoundsLike } from 'mapbox-gl';
import type {
    CountyData,
    HydratedCountyData,
    HydratedStateData,
    StateData,
} from '@/app/types';

type StateResult = {
    type: 'state';
    feature: Feature<null, HydratedStateData>;
};

type CountyResult = {
    type: 'county';
    feature: Feature<null, HydratedCountyData>;
};

export type GeocoderResult = StateResult | CountyResult;

type GeocoderState =
    | { status: 'idle'; results: [] }
    | { status: 'searching'; results: [] }
    | { status: 'success'; results: GeocoderResult[] }
    | { status: 'error'; results: []; error: Error };

type UseGeocoderReturns = {
    query: string;
    setQuery: (query: string) => void;
    state: GeocoderState;
};

const GEOCODER_DEBOUNCE_MS = 800;
const MIN_GEOCODER_QUERY_LENGTH = 3;

const STATES_URL = 'https://reference.geoconnex.us/collections/states/items';

const COUNTIES_URL =
    'https://reference.geoconnex.us/collections/counties/items';

const stateCache = new Map<string, StateResult[]>();
const countyCache = new Map<string, CountyResult[]>();
const stateNamesByFips = new Map<string, string>();

/**
 * Manages a debounced search for states and counties.
 *
 * Normalizes the query, cancels stale requests, and exposes the current query
 * together with the request status, results, or error.
 *
 * @returns The query value, query setter, and current geocoder state.
 */
export function useGeocoder(): UseGeocoderReturns {
    const requestIdRef = useRef(0);

    const [searchState, setSearchState] = useState<GeocoderState>({
        status: 'idle',
        results: [],
    });

    const [query, setQuery] = useState('');

    const normalizedQuery = query.trim().toLowerCase();

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const controller = new AbortController();

        if (normalizedQuery.length < MIN_GEOCODER_QUERY_LENGTH) {
            setSearchState({ status: 'idle', results: [] });

            return () => {
                controller.abort();
            };
        }

        setSearchState({ status: 'searching', results: [] });

        async function runSearch() {
            try {
                const [states, counties] = await Promise.all([
                    searchStates(normalizedQuery, {
                        signal: controller.signal,
                    }),
                    searchCounties(normalizedQuery, {
                        signal: controller.signal,
                    }),
                ]);

                if (requestId !== requestIdRef.current) {
                    return;
                }

                setSearchState({
                    status: 'success',
                    results: [...states, ...counties],
                });
            } catch (error) {
                if (requestId !== requestIdRef.current) {
                    return;
                }

                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }

                setSearchState({
                    status: 'error',
                    results: [],
                    error:
                        error instanceof Error
                            ? error
                            : new Error('Search failed'),
                });
            }
        }

        const timeout = window.setTimeout(() => {
            void runSearch();
        }, GEOCODER_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [normalizedQuery]);

    return { query, setQuery, state: searchState };
}

async function searchStates(
    query: string,
    options?: { signal?: AbortSignal }
): Promise<StateResult[]> {
    const cached = stateCache.get(query);

    if (cached) {
        return cached;
    }

    const url = new URL(STATES_URL);

    url.searchParams.set('sortby', '-name');
    url.searchParams.set('filter', `CASEI(name) LIKE CASEI('%${query}%')`);
    url.searchParams.set('filter-lang', 'cql2-text');
    url.searchParams.set('f', 'json');

    const response = await fetch(url, { signal: options?.signal });

    if (!response.ok) {
        throw new Error('Failed to fetch states');
    }

    const data = (await response.json()) as FeatureCollection<
        Geometry,
        StateData
    >;

    const results: StateResult[] = data.features.map((feature) => ({
        type: 'state',
        feature: {
            ...feature,
            properties: {
                ...feature.properties,
                id: String(feature.id ?? feature.properties.fid),
                bounds: bbox(feature.geometry) as LngLatBoundsLike,
            },
            geometry: null,
        },
    }));

    if (!options?.signal?.aborted) {
        results.forEach(({ feature }) => {
            stateNamesByFips.set(
                feature.properties.statefp,
                feature.properties.name
            );
        });

        stateCache.set(query, results);
    }

    return results;
}

async function searchCounties(
    query: string,
    options?: { signal?: AbortSignal }
): Promise<CountyResult[]> {
    const cached = countyCache.get(query);

    if (cached) {
        return cached;
    }

    const url = new URL(COUNTIES_URL);

    url.searchParams.set('sortby', '-name');
    url.searchParams.set('filter', `CASEI(name) LIKE CASEI('%${query}%')`);
    url.searchParams.set('filter-lang', 'cql2-text');
    url.searchParams.set('f', 'json');

    const response = await fetch(url, { signal: options?.signal });

    if (!response.ok) {
        throw new Error('Failed to fetch counties');
    }

    const data = (await response.json()) as FeatureCollection<
        Geometry,
        CountyData
    >;

    const statefps = new Set(
        data.features.map((feature) => feature.properties.statefp)
    );

    const stateNameEntries = await Promise.all(
        [...statefps].map(async (statefp) => {
            const name = await getStateName(statefp, options?.signal);
            return [statefp, name] as const;
        })
    );

    const stateNames = new Map(stateNameEntries);

    const results: CountyResult[] = data.features.map((feature) => ({
        type: 'county',
        feature: {
            ...feature,
            properties: {
                ...feature.properties,
                id: String(feature.id ?? feature.properties.fid),
                bounds: bbox(feature.geometry) as LngLatBoundsLike,
                stateName: stateNames.get(feature.properties.statefp)!,
            },
            geometry: null,
        },
    }));

    if (!options?.signal?.aborted) {
        countyCache.set(query, results);
    }

    return results;
}

async function getStateName(statefp: string, signal?: AbortSignal) {
    const cached = stateNamesByFips.get(statefp);

    if (cached) {
        return cached;
    }

    const url = new URL(STATES_URL);

    url.searchParams.set('filter', `statefp = '${statefp}'`);
    url.searchParams.set('filter-lang', 'cql2-text');
    url.searchParams.set('f', 'json');
    url.searchParams.set('skipGeometry', 'true');
    url.searchParams.set('limit', '1');

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Failed to fetch state for FIPS code ${statefp}`);
    }

    const data = (await response.json()) as FeatureCollection<
        Geometry,
        StateData
    >;

    const name = data.features[0]?.properties.name;

    if (!name) {
        throw new Error(`No state found for FIPS code ${statefp}`);
    }

    if (!signal?.aborted) {
        stateNamesByFips.set(statefp, name);
    }

    return name;
}
