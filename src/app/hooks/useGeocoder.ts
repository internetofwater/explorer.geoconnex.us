import { useEffect, useRef, useState } from 'react';
import { bbox } from '@turf/turf';

import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { LngLatBoundsLike } from 'mapbox-gl';
import type {
    CountyData,
    GnisData,
    HydratedCountyData,
    HydratedGnisData,
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

type GnisResult = {
    type: 'gnis';
    feature: Feature<null, HydratedGnisData>;
};

export type GeocoderResult = StateResult | CountyResult | GnisResult;

export type GeocoderResultGroups = {
    state: StateResult[];
    county: CountyResult[];
    gnis: GnisResult[];
};

type GeocoderState =
    | { status: 'idle'; results: null }
    | { status: 'searching'; results: null }
    | { status: 'success'; results: GeocoderResultGroups }
    | { status: 'error'; results: null; error: Error };

type UseGeocoderReturns = {
    query: string;
    setQuery: (query: string) => void;
    state: GeocoderState;
};

const GEOCODER_DEBOUNCE_MS = 800;

export const MIN_GEOCODER_QUERY_LENGTH = 3;

export const GEOCODER_RESULTS_LIMIT = 5;

const STATES_URL = 'https://reference.geoconnex.us/collections/states/items';

const COUNTIES_URL =
    'https://reference.geoconnex.us/collections/counties/items';

const FEATURES_URL =
    'https://features.geoconnex.us/collections/GeoconnexFeatures/items';

const GNIS_URL = 'https://geoconnex.us/usgs/gnis';

const stateCache = new Map<string, StateResult[]>();
const countyCache = new Map<string, CountyResult[]>();
const gnisCache = new Map<string, GnisResult[]>();

const stateNamesByFips = new Map<string, string>();

/**
 * Manages a debounced search for states, counties, and GNIS features.
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
        results: null,
    });

    const [query, setQuery] = useState('');

    const normalizedQuery = query.trim().toLowerCase();

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const controller = new AbortController();

        if (normalizedQuery.length < MIN_GEOCODER_QUERY_LENGTH) {
            setSearchState({ status: 'idle', results: null });

            return () => {
                controller.abort();
            };
        }

        setSearchState({ status: 'searching', results: null });

        async function runSearch() {
            try {
                const [states, counties, gnisFeatures] = await Promise.all([
                    searchStates(normalizedQuery, {
                        signal: controller.signal,
                    }),
                    searchCounties(normalizedQuery, {
                        signal: controller.signal,
                    }),
                    searchGnisFeatures(normalizedQuery, {
                        signal: controller.signal,
                    }),
                ]);

                if (requestId !== requestIdRef.current) {
                    return;
                }

                setSearchState({
                    status: 'success',
                    results: {
                        state: states,
                        county: counties,
                        gnis: gnisFeatures,
                    },
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
                    results: null,
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
    url.searchParams.set('limit', `${GEOCODER_RESULTS_LIMIT}`);
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
    url.searchParams.set('limit', `${GEOCODER_RESULTS_LIMIT}`);
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

async function searchGnisFeatures(
    query: string,
    options?: { signal?: AbortSignal }
): Promise<GnisResult[]> {
    const cached = gnisCache.get(query);

    if (cached) {
        return cached;
    }

    const url = new URL(FEATURES_URL);

    url.searchParams.set('geoconnex_sitemap', 'usgs:gnis');
    url.searchParams.set(
        'filter',
        `feature_name ILIKE '%${query}%' OR id = '${GNIS_URL}/${query}'`
    );
    url.searchParams.set('limit', `${GEOCODER_RESULTS_LIMIT}`);
    url.searchParams.set('f', 'json');

    const response = await fetch(url, { signal: options?.signal });

    if (!response.ok) {
        throw new Error('Failed to fetch features');
    }

    const data = (await response.json()) as FeatureCollection<
        Geometry,
        GnisData
    >;

    const results: GnisResult[] = data.features.map((feature) => ({
        type: 'gnis',
        feature: {
            ...feature,
            properties: {
                ...feature.properties,
                bounds: bbox(feature.geometry) as LngLatBoundsLike,
            },
            geometry: null,
        },
    }));

    if (!options?.signal?.aborted) {
        gnisCache.set(query, results);
    }

    return results;
}
