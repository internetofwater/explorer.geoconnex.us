import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import debounce from 'lodash.debounce';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { AppDispatch } from '@/lib/state/store';
import {
    fetchDatasets,
    setDatasets,
    setHoverId,
    setSearchResultIds,
    setSelectedMainstemId,
    Summary as SummaryObject,
} from '@/lib/state/main/slice';
import { createSummary } from '@/lib/state/utils';
import { defaultGeoJson } from '@/lib/state/consts';
import { Dataset, MainstemData } from '@/app/types';
import { Linear } from '@/app/assets/Linear';
import { Summary } from '@/app/features/SidePanel/Summary';

const SearchComponent: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MainstemData[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<SummaryObject | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const search = async (query: string) => {
        const _query = query.toLowerCase();

        if (_query) {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://reference.geoconnex.us/collections/mainstems/items?filter=name_at_outlet+ILIKE+'%${query}%'+OR+uri+ILIKE+'%mainstems/${query}%'&f=json&skipGeometry=true`
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
                setResults(searchResults);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mainstems: ', error);
                setLoading(false);
            }
        } else {
            setResults([]);
            setSummary(null);
            dispatch(
                setDatasets(
                    defaultGeoJson as FeatureCollection<Geometry, Dataset>
                )
            );
        }
    };

    const getDatasets = async (id: number) => {
        if (summary && summary.id === id) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `https://reference.geoconnex.us/collections/mainstems/items/${id}`
            );
            const feature = (await response.json()) as Feature<
                Geometry,
                MainstemData & { datasets: Dataset[] }
            >;

            const summary = createSummary(id, feature);
            setSummary(summary);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching datasets: ', error);
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (query: string) => search(query), 800),
        []
    );

    const debouncedGetDatasets = useCallback(
        debounce((id: number) => getDatasets(id), 300),
        [summary]
    );

    useEffect(() => {
        return function cleanup() {
            debouncedSearch.cancel();
            debouncedGetDatasets.cancel();
        };
    }, []);

    useEffect(() => {
        debouncedSearch(query); // eslint-disable-line @typescript-eslint/no-floating-promises
    }, [query]);

    useEffect(() => {
        const ids = results.map((result) => result.id);
        dispatch(setSearchResultIds(ids));
    }, [results]);

    const handleClick = (id: number) => {
        dispatch(fetchDatasets(String(id))); // eslint-disable-line @typescript-eslint/no-floating-promises
        dispatch(setSelectedMainstemId(String(id)));
    };

    return (
        <>
            <div className="bg-white flex flex-col justify-center m-1 pb-1 text-black border border-gray-500 rounded-lg shadow-lg">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for Names at Outlet or URIs"
                    className="border p-2 mx-1 mt-1 mb-[0.3rem] rounded w-[98%] h-12 focus:outline-none focus:ring-2 focus:ring-[#4798e6] shadow-lg"
                />
                <div
                    className="h-30% max-h-[29vh] overflow-auto p-2.5 w-[100%] "
                    onMouseLeave={() => {
                        dispatch(setHoverId(null));
                        debouncedGetDatasets.cancel();
                    }}
                >
                    <ul>
                        {results.map((result, index) => {
                            const id = Number(result.id);

                            return (
                                <li
                                    key={index}
                                    className="p-2 border-b truncate cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleClick(id)}
                                    onMouseOver={() => {
                                        dispatch(setHoverId(id));
                                        debouncedGetDatasets(id); // eslint-disable-line @typescript-eslint/no-floating-promises
                                    }}
                                    onMouseLeave={() => {
                                        debouncedGetDatasets.cancel();
                                    }}
                                    title={`${result.name_at_outlet} - ${result.uri}`}
                                >
                                    <strong>{result.name_at_outlet}</strong> -{' '}
                                    {result.uri}
                                    {summary !== null && summary.id === id && (
                                        <span className="mt-2">
                                            <Summary
                                                summary={summary}
                                                exclusions={{ name: true }}
                                            />
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            {loading ? <Linear /> : <div className="h-2" />}
        </>
    );
};

export default SearchComponent;
