import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import debounce from 'lodash.debounce';
import {
    Feature,
    FeatureCollection,
    GeoJsonProperties,
    Geometry,
} from 'geojson';
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
import { Typography } from '@/app/components/common/Typography';

type Props = {
    setLoading: (loading: boolean) => void;
    setResults: (results: MainstemData[]) => void;
};

const SearchComponent: React.FC<Props> = (props) => {
    const { setLoading, setResults } = props;

    const [query, setQuery] = useState('');

    const dispatch: AppDispatch = useDispatch();

    const controller = new AbortController();

    const search = async (query: string) => {
        const _query = query.toLowerCase();

        if (_query) {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://reference.geoconnex.us/collections/mainstems/items?filter=name_at_outlet+ILIKE+'%${query}%'+OR+uri+ILIKE+'%mainstems/${query}%'&f=json&skipGeometry=true`,
                    { signal: controller.signal }
                );
                const data: FeatureCollection<Geometry, MainstemData> =
                    await response.json();
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
            dispatch(
                setDatasets(
                    defaultGeoJson as FeatureCollection<Geometry, Dataset>
                )
            );
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (query: string) => search(query), 800),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
            controller.abort();
        };
    }, []);

    useEffect(() => {
        debouncedSearch(query);
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
                className="border border-gray-500 p-2 mx-1 mt-1 mb-[0.3rem] rounded w-[98%] h-12"
            />
        </>
    );
};

export default SearchComponent;
