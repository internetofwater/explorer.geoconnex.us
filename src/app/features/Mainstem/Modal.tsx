import Button from '@/app/components/common/Button';
import Modal from '@/app/components/common/Modal';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import { LoadingType } from '@/lib/state/loading/types';
import { EOverlay, setOverlay } from '@/lib/state/main/slice';
import { setMetrics } from '@/lib/state/mainstem/slice';
import { fetchDatasets } from '@/lib/state/mainstem/thunks';
import { TMainstemMetrics, TMainstemRequest } from '@/lib/state/mainstem/types';
import { loadingManager } from '@/managers/init';
import { datasetService } from '@/services/init/init';
import { useEffect, useRef, useState } from 'react';
import { Variables } from './Variables';
import { Types } from './Types';
import { MainstemData } from '@/app/types';
import { Typography } from '@/app/components/common/Typography';

export const MainstemModal: React.FC = () => {
    const selected = useAppSelector((state) => state.mainstem.selected);
    const metrics = useAppSelector((state) => state.mainstem.metrics);
    const overlay = useAppSelector((state) => state.main.overlay);

    const [variables, setVariables] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [datasetCount, setDatasetCount] = useState(0);

    const requestId = useRef(0);
    const controller = useRef<AbortController>(null);

    const dispatch = useAppDispatch();

    const getRequest = (selected: MainstemData): TMainstemRequest => ({
        id: selected.id,
        variables: variables,
        types: types,
    });

    useEffect(() => {
        if (overlay === EOverlay.Mainstem) {
            return;
        }

        if (selected) {
            dispatch(setOverlay(EOverlay.Mainstem));
            return;
        }

        dispatch(setOverlay(null));
    }, [selected]);

    useEffect(() => {
        if (!selected || (metrics && metrics.id === selected.id)) {
            return;
        }

        // TODO: determine correct loading type
        const loadingInstance = loadingManager.add(
            'Fetching mainstem summary information',
            LoadingType.Datasets
        );

        const controller = new AbortController();

        void datasetService
            .getSummary(selected.uri, { signal: controller.signal })
            .then((partialMetrics) => {
                const metrics: TMainstemMetrics = {
                    ...partialMetrics,
                    id: selected.id,
                    name: selected.name_at_outlet,
                    length: selected.outlet_drainagearea_sqkm,
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
    }, [selected, metrics]);

    useEffect(() => {
        if (!selected || (metrics && metrics.id !== selected.id)) {
            return;
        }

        // TODO: determine correct loading type
        const loadingInstance = loadingManager.add(
            'Updating dataset count',
            LoadingType.Datasets
        );

        let isMounted = true;
        if (controller.current) {
            controller.current.abort('New request for dataset count');
        }
        controller.current = new AbortController();
        const request = getRequest(selected);

        void datasetService
            .getDatasetCount(selected.uri, {
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
    }, [types, variables]);

    const handleClose = () => {
        dispatch(setOverlay(null));
        // setRequest(currentRequest);
    };

    const handleClick = () => {
        if (!selected) {
            return;
        }

        const request = getRequest(selected);

        dispatch(fetchDatasets(selected.uri, request));
        dispatch(setOverlay(null));
    };

    const handleVariablesChange = (variables: string[]) =>
        setVariables(variables);

    const handleTypesChange = (types: string[]) => setTypes(types);

    return (
        <Modal
            title={selected?.name_at_outlet ?? ''}
            open={overlay === EOverlay.Mainstem}
            handleClose={handleClose}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <Variables
                            variables={variables}
                            onVariablesChange={handleVariablesChange}
                            metricVariables={metrics?.variables ?? []}
                        />
                        <Types
                            types={types}
                            onTypesChange={handleTypesChange}
                            metricTypes={metrics?.types ?? []}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="body">{datasetCount}</Typography>
                        <Button
                            title={`Fetch datasets for mainstem: ${selected?.name_at_outlet}`}
                            onClick={handleClick}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
