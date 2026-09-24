import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { Typography } from '@/app/components/common/Typography';
import {
    setHoverId,
    setSelectedMainstem,
    Summary as SummaryObject,
} from '@/lib/state/main/slice';
import { MainstemData } from '@/app/types';
import { AppDispatch } from '@/lib/state/store';
import { SimpleSummary } from '@/app/features/SidePanel/Summary/Simple';
import { fetchDatasets } from '@/lib/state/main/thunks';
import { loadingManager } from '@/managers/init';
import { LoadingType } from '@/lib/state/loading/types';
import { datasetService } from '@/services/init/init';

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

    const [summary, setSummary] = useState<SummaryObject | null>(null);

    const dispatch: AppDispatch = useDispatch();

    const controller = useRef<AbortController>(null);
    const isMounted = useRef(true);

    const getDatasets = async (mainstem: MainstemData) => {
        if (
            (summary && summary.id === mainstem.id) ||
            loadingManager.has({ type: LoadingType.Datasets }) // TODO: is this needed?
        ) {
            return;
        }

        const loadingInstance = loadingManager.add(
            `Fetching summary for mainstem with identifier: ${mainstem.id}`,
            LoadingType.ResultsHover
        );

        try {
            if (controller.current) {
                controller.current.abort(`New request for id: ${mainstem.id}`);
            }
            controller.current = new AbortController();

            // Fetch the complete mainstem data with included datasets
            const partialSummary = await datasetService.getSummary(
                mainstem.uri,
                controller.current.signal
            );

            const summary: SummaryObject = {
                ...partialSummary,
                id: mainstem.id,
                name: mainstem.name_at_outlet,
                length: mainstem.outlet_drainagearea_sqkm,
            };

            setSummary(summary);
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
            }
        } finally {
            loadingManager.remove(loadingInstance);
        }
    };

    const debouncedGetDatasets = useCallback(
        debounce((mainstem: MainstemData) => getDatasets(mainstem), 300),
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

    const handleClick = (result: MainstemData) => {
        dispatch(setSelectedMainstem(result));
        window.history.replaceState({}, '', `/mainstems/${result.id}`);
        // const res = await datasetService.getDatasets(result.uri);
        // console.log('res', res);
        dispatch(fetchDatasets(result.uri));

        // TODO: review this approach
        // Let the camera move end the datasets loading event
    };

    const handleMouseLeave = () => {
        dispatch(setHoverId(null));
        debouncedGetDatasets.cancel();
        if (controller.current) {
            controller.current.abort('Row no longer hovered');
        }
    };

    console.log('results', results);

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
                                void debouncedGetDatasets(result);
                            }}
                            onMouseLeave={handleMouseLeave}
                            onFocus={() => {
                                dispatch(setHoverId(id));
                                void debouncedGetDatasets(result);
                            }}
                            onBlur={() => {
                                debouncedGetDatasets.cancel();
                            }}
                            title={`${result.name_at_outlet} - ${result.id}`}
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
