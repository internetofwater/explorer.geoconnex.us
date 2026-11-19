import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureCollection, Geometry } from 'geojson';
import { AppDispatch } from '@/lib/state/store';
import { setShowResults } from '@/lib/state/main/slice';
import { MainstemData } from '@/app/types';
import { loadingManager } from '@/managers/init';
import { LOADING_TYPE } from '@/lib/state/loading/types';

type Props = {
    onSearchResultsChange: (results: MainstemData[]) => void;
};

/**
 * This component performs debounced searches for mainstem data based on user input.
 * It manages the search query state and handles fetch requests with abort control.
 * The component updates the search results and loading state in Redux.
 *
 * Props:
 * - setResults: Function to update the search results state.
 *
 * @component
 */
const Search: React.FC<Props> = (props) => {
    const { onSearchResultsChange } = props;

    const [query, setQuery] = useState('');

    const dispatch: AppDispatch = useDispatch();

    const requestIdRef = useRef(0);

    useEffect(() => {
        const requestId = ++requestIdRef.current;
        const controller = new AbortController();

        if (!query.trim()) {
            onSearchResultsChange([]);
            return () => {
                controller.abort();
            };
        }

        const search = async () => {
            const loadingInstance = loadingManager.add(
                `Search request for: ${query}`,
                LOADING_TYPE.SearchResults
            );

            try {
                const params = {
                    sortby: '-outlet_drainagearea_sqkm',
                    'filter-lang': 'cql2-text',
                    filter: `CASEI(name_at_outlet) LIKE CASEI('%${query}%') OR CASEI(uri) LIKE CASEI('https://geoconnex.us/ref/mainstems/${query}%')`,
                    f: 'json',
                    skipGeometry: 'true',
                };

                const queryString = new URLSearchParams(params).toString();

                const response = await fetch(
                    `https://reference.geoconnex.us/collections/mainstems_v3/items?${queryString}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(
                        `Search failed (${response.status}): ${await response.text()}`
                    );
                }

                const data = (await response.json()) as FeatureCollection<
                    Geometry,
                    MainstemData
                >;

                // Ignore stale responses
                if (requestId !== requestIdRef.current) {
                    return;
                }

                const searchResults: MainstemData[] = data.features.map(
                    (feature) =>
                        ({
                            ...feature.properties,
                            id: feature.id,
                        }) as MainstemData
                );

                dispatch(setShowResults(true));
                onSearchResultsChange(searchResults);
            } catch (error) {
                if (requestId !== requestIdRef.current) {
                    return;
                }

                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }

                console.error('Error fetching mainstems:', error);
            } finally {
                loadingManager.remove(loadingInstance);
            }
        };

        const timeout = window.setTimeout(() => {
            void search();
        }, 800);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [query, dispatch]);

    return (
        <>
            <label htmlFor="search-input" className="sr-only">
                Search for Names at Outlet or URIs
            </label>
            <input
                type="text"
                id="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Names at Outlet or URIs"
                aria-label="Search for Names at Outlet or URIs"
                className="border border-gray-500 p-2 mx-1 mt-1 mb-[0.3rem] rounded w-[98%] h-12 shadow-md"
            />
        </>
    );
};

export default Search;
