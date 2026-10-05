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
    feature: Feature<Geometry, HydratedStateData>;
};

type CountyResult = {
    type: 'county';
    feature: Feature<Geometry, HydratedCountyData>;
};

type GnisResult = {
    type: 'gnis';
    feature: Feature<Geometry, HydratedGnisData>;
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

let countySearchStates: StateData[] | undefined;

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
        },
    }));

    if (!options?.signal?.aborted) {
        stateCache.set(query, results);
    }

    return results;
}

async function getCountySearchStates(signal?: AbortSignal) {
    if (countySearchStates) {
        return countySearchStates;
    }

    const url = new URL(STATES_URL);

    url.searchParams.set('skipGeometry', 'true');
    url.searchParams.set('limit', '100');
    url.searchParams.set('f', 'json');

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error('Failed to fetch states');
    }

    const data = (await response.json()) as FeatureCollection<null, StateData>;

    const states = data.features.map(({ properties }) => properties);

    if (!signal?.aborted) {
        countySearchStates = states;
    }

    return states;
}

function getCountyFilter(query: string, states: StateData[]): string {
    const normalized = query.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();

    /*
     * Match a trailing state name or acronym to narrow common county names
     * (e.g., Washington) by state FIPS code before applying the results limit.
     * Prefer the longest alias so "West Virginia" matches before "Virginia".
     */
    const match = states
        .flatMap((state) =>
            [state.name, state.stusps].map((alias) => ({
                state,
                alias: alias.toLowerCase(),
            }))
        )
        .sort((a, b) => b.alias.length - a.alias.length)
        .find(({ alias }) => normalized.endsWith(` ${alias}`));

    /* Remove the matched state suffix and its preceding space, if present. */
    const countyName = match
        ? normalized.slice(0, -(match.alias.length + 1)).trim()
        : normalized;

    const name = countyName.replace(/\s+county$/, '');

    const nameFilter = `CASEI(name) LIKE CASEI('%${name}%')`;

    return match
        ? `${nameFilter} AND statefp = '${match.state.statefp}'`
        : nameFilter;
}

async function searchCounties(
    query: string,
    options?: { signal?: AbortSignal }
): Promise<CountyResult[]> {
    const cached = countyCache.get(query);

    if (cached) {
        return cached;
    }

    const states = await getCountySearchStates(options?.signal);

    const url = new URL(COUNTIES_URL);

    url.searchParams.set('sortby', '-name');
    url.searchParams.set('filter', getCountyFilter(query, states));
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

    const stateNames = new Map(
        states.map(({ statefp, name }) => [statefp, name])
    );

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
        },
    }));

    if (!options?.signal?.aborted) {
        countyCache.set(query, results);
    }

    return results;
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
        },
    }));

    if (!options?.signal?.aborted) {
        gnisCache.set(query, results);
    }

    return results;
}
