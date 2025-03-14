import { Typography } from '@/app/components/common/Typography';
import { useCallback, useEffect, useState } from 'react';
import {
    fetchDatasets,
    setHoverId,
    setSelectedMainstemId,
    Summary as SummaryObject,
} from '@/lib/state/main/slice';
import debounce from 'lodash.debounce';
import { createSummary } from '@/lib/state/utils';
import { Feature, Geometry } from 'geojson';
import { Dataset, MainstemData } from '@/app/types';
import { AppDispatch } from '@/lib/state/store';
import { useDispatch } from 'react-redux';
import { Summary } from '@/app/features/SidePanel/Summary';

type Props = {
    setLoading: (loading: boolean) => void;
    results: MainstemData[];
};

export const Results: React.FC<Props> = (props) => {
    const { setLoading, results } = props;

    const [summary, setSummary] = useState<SummaryObject | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const controller = new AbortController();

    const getDatasets = async (id: number) => {
        if (summary && summary.id === id) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `https://reference.geoconnex.us/collections/mainstems/items/${id}`,
                { signal: controller.signal }
            );
            const feature: Feature<
                Geometry,
                MainstemData & { datasets: Dataset[] }
            > = await response.json();

            const summary = createSummary(id, feature);
            setSummary(summary);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching datasets: ', error);
            setLoading(false);
        }
    };

    const debouncedGetDatasets = useCallback(
        debounce((id: number) => getDatasets(id), 300),
        [summary]
    );

    useEffect(() => {
        return () => {
            debouncedGetDatasets.cancel();
            controller.abort();
        };
    }, []);

    const handleClick = async (id: number) => {
        dispatch(fetchDatasets(id));
        dispatch(setSelectedMainstemId(String(id)));
    };

    return (
        <div
            className="w-full ml-2"
            onMouseLeave={() => {
                dispatch(setHoverId(null));
                debouncedGetDatasets.cancel();
            }}
            aria-live="polite"
        >
            <ul aria-label="Search results">
                {results.map((result, index) => {
                    const id = Number(result.id);

                    return (
                        <li
                            key={index}
                            tabIndex={0}
                            className="p-2.5 border-b cursor-pointer hover:bg-gray-100"
                            onClick={() => handleClick(id)}
                            onMouseOver={() => {
                                dispatch(setHoverId(id));
                                debouncedGetDatasets(id);
                            }}
                            onMouseLeave={() => {
                                debouncedGetDatasets.cancel();
                                controller.abort();
                            }}
                            onFocus={() => {
                                dispatch(setHoverId(id));
                                debouncedGetDatasets(id);
                            }}
                            onBlur={() => {
                                debouncedGetDatasets.cancel();
                            }}
                            title={`${result.name_at_outlet} - ${result.uri}`}
                            role="option"
                            aria-selected={
                                summary !== null && summary.id === id
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleClick(id);
                                }
                            }}
                        >
                            <Typography variant="body">
                                <strong>{result.name_at_outlet}</strong>{' '}
                                {result.uri}
                            </Typography>
                            {summary !== null && summary.id === id && (
                                <Summary
                                    summary={summary}
                                    exclusions={{ name: true }}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
