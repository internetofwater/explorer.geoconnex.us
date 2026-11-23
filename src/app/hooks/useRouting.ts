'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Feature, LineString } from 'geojson';
import { Dataset, MainstemData } from '@/app/types';
import { setTarget } from '@/lib/state/mainstem/slice';
import { loadingManager } from '@/managers/init';
import { LOADING_TYPE } from '@/lib/state/loading/types';
import { useMode } from '@/app/hooks/useMode';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';

export const useRouting = () => {
    const target = useAppSelector((s) => s.mainstem.target);
    const selected = useAppSelector((s) => s.mainstem.selected);

    const dispatch = useAppDispatch();

    const pathname = usePathname();
    const { changeToMainstemsMode } = useMode();

    useEffect(() => {
        // Get the mainstem id on initial load and fetch data from geoconnex
        const controller = new AbortController();
        if (pathname && pathname.startsWith('/mainstems/')) {
            const match = pathname.match(/\/mainstems\/(\d+)/);
            const id = match ? match[1] : null;

            if (id) {
                const loadingInstance = loadingManager.add(
                    'Fetching mainstem data for the id in the URL',
                    LOADING_TYPE.Datasets
                );
                void fetch(
                    `https://reference.geoconnex.us/collections/mainstems/items/${id}`,
                    {
                        signal: controller.signal,
                    }
                )
                    .then((r) => r.json())
                    .then(
                        (
                            feature: Feature<
                                LineString,
                                MainstemData & { datasets: Dataset[] }
                            >
                        ) => {
                            // TODO: update this when datasets is no longer returned on the feature
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { datasets: _, ...mainstemData } =
                                feature.properties;
                            changeToMainstemsMode();
                            dispatch(setTarget(mainstemData));
                        }
                    )
                    .catch((error) => console.error(error))
                    .finally(() => {
                        loadingManager.remove(loadingInstance);
                    });
            }
        }

        return () => {
            controller.abort('Component dismount');
        };
    }, []);

    useEffect(() => {
        if (window && target) {
            window.history.replaceState({}, '', `/mainstems/${target.id}`);
        }
    }, [target]);

    useEffect(() => {
        if (window && selected) {
            window.history.replaceState({}, '', `/mainstems/${selected.id}`);
        }
    }, [selected]);

    useEffect(() => {
        if (window && !selected && !target) {
            window.history.replaceState({}, '', window.location.origin);
        }
    }, [selected, target]);
};
