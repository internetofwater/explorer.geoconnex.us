import Button from '@/app/components/common/Button';
import Modal from '@/app/components/common/Modal';
import MultiSelect from '@/app/components/common/MultiSelect';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import { LoadingType } from '@/lib/state/loading/types';
import { EOverlay, setOverlay } from '@/lib/state/main/slice';
import { setMetrics } from '@/lib/state/mainstem/slice';
import { fetchDatasets } from '@/lib/state/mainstem/thunks';
import { TMainstemMetrics } from '@/lib/state/mainstem/types';
import { loadingManager } from '@/managers/init';
import { datasetService } from '@/services/init/init';
import { useEffect, useMemo, useState } from 'react';

export const MainstemModal: React.FC = () => {
    const selected = useAppSelector((state) => state.mainstem.selected);
    const metrics = useAppSelector((state) => state.mainstem.metrics);
    const currentRequest = useAppSelector((state) => state.mainstem.request);
    const overlay = useAppSelector((state) => state.main.overlay);

    const [request, setRequest] = useState(currentRequest);

    const dispatch = useAppDispatch();

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
            .getSummary(selected.uri, controller.signal)
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

    const variables = useMemo(() => {
        if (!metrics) {
            return [];
        }

        return metrics.variables.map(
            ({ variableMeasured }) => variableMeasured
        );
    }, [metrics]);

    const handleClose = () => {
        dispatch(setOverlay(null));
        setRequest(currentRequest);
    };

    const handleVariablesChange = (variable: string) => {
        const variables =
            request?.variables && request.variables.includes(variable)
                ? request.variables.filter((item) => item !== variable)
                : [...(request?.variables ?? []), variable];

        setRequest({
            ...request,
            variables,
        });
    };

    const handleClick = () => {
        if (!selected) {
            return;
        }

        dispatch(fetchDatasets(selected.uri));
        dispatch(setOverlay(null));
    };

    return (
        <Modal
            title={selected?.name_at_outlet ?? ''}
            open={overlay === EOverlay.Mainstem}
            handleClose={handleClose}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <MultiSelect
                            id="mainstem-variables-select"
                            options={variables}
                            selectedOptions={request.variables}
                            handleOptionClick={handleVariablesChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
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
