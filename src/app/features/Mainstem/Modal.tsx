import Button from '@/app/components/common/Button';
import Modal from '@/app/components/common/Modal';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import { LoadingType } from '@/lib/state/loading/types';
import { EOverlay, setOverlay } from '@/lib/state/main/slice';
import { setMetrics, setTarget } from '@/lib/state/mainstem/slice';
import { fetchDatasets } from '@/lib/state/mainstem/thunks';
import { TMainstemMetrics, TMainstemRequest } from '@/lib/state/mainstem/types';
import { loadingManager } from '@/managers/init';
import { datasetService } from '@/services/init/init';
import { useEffect, useRef, useState } from 'react';
import { Variables } from '@/app/features/Mainstem/Variables';
import { Types } from '@/app/features/Mainstem/Types';
import { MainstemData } from '@/app/types';
import { Typography } from '@/app/components/common/Typography';
import { getMessage } from '@/app/features/Mainstem/utils';
import { useLoading } from '@/app/hooks/useLoading';
import { DATASET_LIMIT } from '@/sparql/queries/getDatasets';
import { DistributionNames } from '@/app/features/Mainstem/DistributionNames';
import { Request } from '@/app/features/Mainstem/Request';

export const MainstemModal: React.FC = () => {
    const target = useAppSelector((state) => state.mainstem.target);
    const request = useAppSelector((state) => state.mainstem.request);
    const metrics = useAppSelector((state) => state.mainstem.metrics);
    const overlay = useAppSelector((state) => state.main.overlay);

    const [variables, setVariables] = useState<string[]>(request.variables);
    const [types, setTypes] = useState<string[]>(request.types);
    const [distributionNames, setDistributionNames] = useState<string[]>(
        request.distributionNames
    );
    const [datasetCount, setDatasetCount] = useState(0);

    const requestId = useRef(0);
    const controller = useRef<AbortController>(null);

    const dispatch = useAppDispatch();

    const { isFetchingDatasetCount, isFetchingModalMetrics } = useLoading();

    const getRequest = (target: MainstemData): TMainstemRequest => ({
        id: target.id,
        variables,
        types,
        distributionNames,
    });

    useEffect(() => {
        if (overlay === EOverlay.Mainstem) {
            return;
        }

        if (target) {
            dispatch(setOverlay(EOverlay.Mainstem));
            if (target.id !== request.id) {
                setTypes([]);
                setVariables([]);
                setDistributionNames([]);
            }
            return;
        }

        dispatch(setOverlay(null));
    }, [target]);

    useEffect(() => {
        if (!target || (metrics && metrics.id === target.id)) {
            return;
        }

        const loadingInstance = loadingManager.add(
            'Fetching mainstem summary information',
            LoadingType.FetchModalMetrics
        );

        const controller = new AbortController();

        void datasetService
            .getSummary(target.uri, { signal: controller.signal })
            .then((partialMetrics) => {
                const metrics: TMainstemMetrics = {
                    ...partialMetrics,
                    id: target.id,
                    name: target.name_at_outlet,
                    length: target.outlet_drainagearea_sqkm,
                };

                dispatch(setMetrics(metrics));
            })
            .catch((error) => console.error(error))
            .finally(() => {
                loadingManager.remove(loadingInstance);
            });

        return () => {
            controller.abort();
        };
    }, [target, metrics]);

    useEffect(() => {
        if (!target || (metrics && metrics.id !== target.id)) {
            return;
        }

        const loadingInstance = loadingManager.add(
            'Updating dataset count',
            LoadingType.DatasetCount
        );

        let isMounted = true;
        if (controller.current) {
            controller.current.abort('New request for dataset count');
        }
        controller.current = new AbortController();
        const request = getRequest(target);

        void datasetService
            .getDatasetCount(target.uri, {
                signal: controller.current.signal,
                request,
                requestId: ++requestId.current,
            })
            .then(({ result: { count }, requestId: thisRequestId }) => {
                if (isMounted && thisRequestId === requestId.current) {
                    setDatasetCount(count);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => {
                loadingManager.remove(loadingInstance);
            });

        return () => {
            isMounted = false;
        };
    }, [target, metrics, types, variables, distributionNames]);

    const handleClose = () => {
        dispatch(setOverlay(null));
        dispatch(setTarget(null));

        // Undo any changes
        setVariables(request.variables);
        setTypes(request.types);
        setDistributionNames(request.distributionNames);
    };

    const handleClick = () => {
        if (!target) {
            return;
        }

        const request = getRequest(target);

        dispatch(setTarget(null));
        dispatch(fetchDatasets(target, request));
        dispatch(setOverlay(null));
    };

    const handleVariablesChange = (variables: string[]) =>
        setVariables(variables);

    const handleTypesChange = (types: string[]) => setTypes(types);

    const handleDistributionNamesChange = (distributionNames: string[]) =>
        setDistributionNames(distributionNames);

    const groupClasses = 'flex flex-col gap-2';

    return (
        <Modal
            title={
                <div className="flex flex-row items-end gap-2">
                    <Typography
                        variant="h2"
                        as="h3"
                        className="text-left flex-grow pl-4"
                    >
                        {target?.name_at_outlet ?? ''}
                    </Typography>
                    <Typography variant="body-small">
                        {target?.uri ?? ''}
                    </Typography>
                </div>
            }
            open={overlay === EOverlay.Mainstem}
            handleClose={handleClose}
        >
            <div className="w-full flex flex-row justify-center min-h-[20.3125rem]">
                <div className={`${groupClasses} flex-grow max-w-[49%]`}>
                    <Typography variant="h3" as="h4" className="text-left">
                        Dataset Filters
                    </Typography>
                    <Variables
                        variables={variables}
                        onVariablesChange={handleVariablesChange}
                        metricVariables={metrics?.variables ?? []}
                        disabled={isFetchingModalMetrics}
                    />
                    <Types
                        types={types}
                        onTypesChange={handleTypesChange}
                        metricTypes={metrics?.types ?? []}
                        disabled={isFetchingModalMetrics}
                    />
                    <DistributionNames
                        distributionNames={distributionNames}
                        onDistributionNamesChange={
                            handleDistributionNamesChange
                        }
                        metricDistributionNames={
                            metrics?.distributionNames ?? []
                        }
                        disabled={isFetchingModalMetrics}
                    />
                </div>
                <div className="w-px self-stretch bg-gray-300 mx-6" />
                <div className="flex flex-col max-w-[49%] gap-4">
                    <div className={`${groupClasses} items-start gap-6`}>
                        <Typography variant="h3" as="h4">
                            {isFetchingDatasetCount ||
                            isFetchingModalMetrics ? (
                                <>Loading...</>
                            ) : (
                                <>{getMessage(datasetCount)}</>
                            )}
                        </Typography>
                        <Typography
                            variant="body-small"
                            className="text-[#3b3b3b]"
                        >
                            Click "Load Data" to get all found datasets for the{' '}
                            {target?.name_at_outlet} mainstem. This action will
                            reset the map view and clear any existing filters.
                        </Typography>
                        <Button
                            title={`Fetch datasets for mainstem: ${target?.name_at_outlet}`}
                            onClick={handleClick}
                            disabled={
                                datasetCount > DATASET_LIMIT ||
                                isFetchingModalMetrics ||
                                isFetchingDatasetCount
                            }
                        >
                            <span className="p-2">Load Data</span>
                        </Button>
                    </div>
                    <div className="w-full h-px self-stretch bg-gray-300 my-2" />
                    <div className={`${groupClasses} justify-center`}>
                        <Request
                            request={{
                                id: '',
                                variables,
                                types,
                                distributionNames,
                            }}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
