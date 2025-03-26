import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

import debounce from 'lodash.debounce';
import { FeatureCollection, Geometry } from 'geojson';
import { AppDispatch } from '@/lib/state/store';
import { setLoading, setShowResults } from '@/lib/state/main/slice';
import { MainstemData } from '@/app/types';

type Props = {
    setResults: (results: MainstemData[]) => void;
};

const Search: React.FC<Props> = (props) => {
    const { setResults } = props;

    const [query, setQuery] = useState('');

    const dispatch: AppDispatch = useDispatch();

    const controller = useRef<AbortController>(null);
    const isMounted = useRef(true);

    const search = async (query: string) => {
        const _query = query.toLowerCase();

        if (_query) {
            try {
                dispatch(
                    setLoading({
                        item: 'search-results',
                        loading: true,
                    })
                );

                if (controller.current) {
                    controller.current.abort(
                        `New search request for: ${_query}`
                    );
                }
                controller.current = new AbortController();

                const response = await fetch(
                    `https://reference.geoconnex.dev/collections/mainstems/items?sortby=-outlet_drainagearea_sqkm&filter=name_at_outlet+ILIKE+'%${query}%'+OR+uri+ILIKE+'%mainstems/${query}%'&f=json&skipGeometry=true`,
                    { signal: controller.current.signal }
                );
                const data = (await response.json()) as FeatureCollection<
                    Geometry,
                    MainstemData
                >;
                const searchResults: MainstemData[] = data.features.map(
                    (feature) =>
                        ({
                            ...feature.properties,
                            id: feature.id,
                        } as MainstemData)
                );
                if (isMounted.current) {
                    dispatch(setShowResults(true));
                    setResults(searchResults);
                    dispatch(
                        setLoading({
                            item: 'search-results',
                            loading: false,
                        })
                    );
                }
            } catch (error) {
                // Abort signals come in 2 variants
                if (
                    (error as Error)?.name === 'AbortError' ||
                    (typeof error === 'string' &&
                        error.includes('New search request for:'))
                ) {
                    console.log('Fetch request canceled');
                } else {
                    console.error('Error fetching mainstems: ', error);
                    if (isMounted.current) {
                        dispatch(
                            setLoading({
                                item: 'search-results',
                                loading: false,
                            })
                        );
                    }
                }
            }
        } else {
            if (isMounted.current) {
                setResults([]);
            }
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (query: string) => search(query), 800),
        []
    );

    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (controller.current) {
                controller.current.abort('Component unmount');
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => {
        debouncedSearch(query); // eslint-disable-line @typescript-eslint/no-floating-promises
    }, [query]);

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
