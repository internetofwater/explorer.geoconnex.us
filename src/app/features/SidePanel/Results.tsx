import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { Typography } from '@/app/components/common/Typography';
import {
    fetchDatasets,
    setHoverId,
    setLoading,
    setSelectedMainstem,
    Summary as SummaryObject,
} from '@/lib/state/main/slice';
import { createSummary } from '@/lib/state/utils';
import { Feature, Geometry } from 'geojson';
import { Dataset, MainstemData } from '@/app/types';
import { AppDispatch, RootState } from '@/lib/state/store';
import { SimpleSummary } from '@/app/features/SidePanel/Summary/Simple';

type Props = {
    results: MainstemData[];
};

/**
 * This component fetches and displays datasets for mainstem search results.
 * It uses debounced fetching to optimize performance and avoid unnecessary requests.
 * The component handles hover and focus events to fetch and display summary data.
 *
 * Props:
 * - results: Array of MainstemData objects representing the search results.
 *
 * @component
 */
export const Results: React.FC<Props> = (props) => {
    const { results } = props;

    const { loading } = useSelector((state: RootState) => state.main);

    const [summary, setSummary] = useState<SummaryObject | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const controller = useRef<AbortController>(null);
    const isMounted = useRef(true);

    const getDatasets = async (id: string) => {
        if (
            (summary && summary.id === id) ||
            (loading.item === 'datasets' && loading.loading)
        ) {
            return;
        }

        try {
            if (!(loading.item === 'datasets' && loading.loading)) {
                dispatch(
                    setLoading({
                        item: 'results-hover',
                        loading: true,
                    })
                );
            }

            if (controller.current) {
                controller.current.abort(`New request for id: ${id}`);
            }
            controller.current = new AbortController();

            // Fetch the complete mainstem data with included datasets
            const response = await fetch(
                `https://reference.geoconnex.dev/collections/mainstems/items/${id}`,
                { signal: controller.current.signal }
            );
            const feature = (await response.json()) as Feature<
                Geometry,
                MainstemData & { datasets: Dataset[] }
            >;

            if (isMounted.current) {
                const summary = createSummary(id, feature.properties);
                setSummary(summary);
                if (!(loading.item === 'datasets' && loading.loading)) {
                    dispatch(
                        setLoading({
                            item: 'results-hover',
                            loading: false,
                        })
                    );
                }
            }
        } catch (error) {
            // Abort signals can come in 2 variants
            if (
                (error as Error)?.name === 'AbortError' ||
                (typeof error === 'string' &&
                    error.includes('New request for id:')) ||
                error === 'Component unmount'
            ) {
                console.log('Fetch request canceled');
            } else {
                console.error('Error fetching datasets: ', error);
                if (isMounted.current) {
                    if (!(loading.item === 'datasets' && loading.loading)) {
                        dispatch(
                            setLoading({
                                item: 'results-hover',
                                loading: false,
                            })
                        );
                    }
                }
            }
        }
    };

    const debouncedGetDatasets = useCallback(
        debounce((id: string) => getDatasets(id), 300),
        [summary]
    );

    useEffect(() => {
        return () => {
            isMounted.current = false;
            debouncedGetDatasets.cancel();
            if (controller.current) {
                controller.current.abort('Component unmount');
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            debouncedGetDatasets.cancel();
        };
    }, [debouncedGetDatasets]);

    const handleClick = async (result: MainstemData) => {
        dispatch(setSelectedMainstem(result));
        window.history.replaceState({}, '', `/mainstems/${result.id}`);
        dispatch(
            setLoading({
                item: 'datasets',
                loading: true,
            })
        );
        await dispatch(fetchDatasets(result.id));
        // Let the camera move end the datasets loading event
    };

    const handleMouseLeave = () => {
        dispatch(setHoverId(null));
        debouncedGetDatasets.cancel();
    };

    return (
        <div
            className="w-full"
            onMouseLeave={handleMouseLeave}
            aria-live="polite"
        >
            <ul aria-label="Search results">
                {results.map((result, index) => {
                    const id = result.id;

                    return (
                        <li
                            key={index}
                            tabIndex={0}
                            className="p-3.5 cursor-pointer hover:bg-gray-100 border-b"
                            onClick={() => {
                                void handleClick(result);
                            }}
                            onMouseOver={() => {
                                dispatch(setHoverId(id));
                                void debouncedGetDatasets(id);
                            }}
                            onMouseLeave={handleMouseLeave}
                            onFocus={() => {
                                dispatch(setHoverId(id));
                                void debouncedGetDatasets(id);
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
                                    void handleClick(result);
                                }
                            }}
                        >
                            <Typography variant="body">
                                <strong>{result.name_at_outlet}</strong>{' '}
                                {result.uri}
                            </Typography>
                            {summary !== null && summary.id === id && (
                                <SimpleSummary
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
