import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { Typography } from '@/app/components/common/Typography';
import {
    fetchDatasets,
    setHoverId,
    setSelectedMainstemId,
    setShowResults,
    Summary as SummaryObject,
} from '@/lib/state/main/slice';
import { createSummary } from '@/lib/state/utils';
import { Feature, Geometry } from 'geojson';
import { Dataset, MainstemData } from '@/app/types';
import { AppDispatch } from '@/lib/state/store';
import { Summary } from '@/app/features/SidePanel/Summary';

type Props = {
    setLoading: (loading: boolean) => void;
    results: MainstemData[];
};

export const Results: React.FC<Props> = (props) => {
    const { setLoading, results } = props;

    const [summary, setSummary] = useState<SummaryObject | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const controller = useRef<AbortController>(null);
    const isMounted = useRef(true);

    const getDatasets = async (id: number) => {
        if (summary && summary.id === id) {
            return;
        }

        try {
            setLoading(true);

            if (controller.current) {
                controller.current.abort(`New request for id: ${id}`);
            }
            controller.current = new AbortController();

            const response = await fetch(
                `https://reference.geoconnex.us/collections/mainstems/items/${id}`,
                { signal: controller.current.signal }
            );
            const feature = (await response.json()) as Feature<
                Geometry,
                MainstemData & { datasets: Dataset[] }
            >;

            if (isMounted.current) {
                const summary = createSummary(id, feature);
                setSummary(summary);
                setLoading(false);
            }
        } catch (error) {
            // Abort signals can come in 2 variants
            if (
                (error as Error)?.name === 'AbortError' ||
                (typeof error === 'string' &&
                    error.includes('New request for id:'))
            ) {
                console.log('Fetch request canceled');
            } else {
                console.error('Error fetching datasets: ', error);
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        }
    };

    const debouncedGetDatasets = useCallback(
        debounce((id: number) => getDatasets(id), 300),
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

    const handleClick = (id: number) => {
        dispatch(setShowResults(true));
        dispatch(fetchDatasets(String(id))); // eslint-disable-line @typescript-eslint/no-floating-promises
        dispatch(setSelectedMainstemId(String(id)));
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
                    const id = Number(result.id);

                    return (
                        <li
                            key={index}
                            tabIndex={0}
                            className="p-3.5 border-b cursor-pointer hover:bg-gray-100"
                            onClick={() => handleClick(id)}
                            onMouseOver={() => {
                                dispatch(setHoverId(id));
                                debouncedGetDatasets(id); // eslint-disable-line @typescript-eslint/no-floating-promises
                            }}
                            onMouseLeave={handleMouseLeave}
                            onFocus={() => {
                                dispatch(setHoverId(id));
                                debouncedGetDatasets(id); // eslint-disable-line @typescript-eslint/no-floating-promises
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
