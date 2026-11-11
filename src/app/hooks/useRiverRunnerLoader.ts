import { LOADING_TYPE } from '@/lib/state/loading/types';
import { NOTIFICATION_TYPE } from '@/lib/state/notifications/types';
import { loadingManager, notificationManager } from '@/managers/init';
import { riverRunnerService } from '@/services/init/init';
import { Map } from 'mapbox-gl';
import { useEffect } from 'react';

export const useRiverRunnerLoader = (map: Map | null, accessToken: string) => {
    useEffect(() => {
        if (!map) {
            return;
        }

        let isMounted = true;

        const loadingInstance = loadingManager.add(
            'Loading required River Runner assets',
            LOADING_TYPE.RiverRunnerLoad
        );

        void riverRunnerService
            .load(map, accessToken)
            .then((success) => {
                if (success && isMounted) {
                    // TODO: enable river running globally
                }
            })
            .catch((error) => {
                console.error(error);
                notificationManager.show(
                    'Unable to load required assets for River Runner.',
                    NOTIFICATION_TYPE.Error,
                    6500
                );
            })
            .finally(() => {
                loadingManager.remove(loadingInstance);
            });

        return () => {
            isMounted = false;
        };
    }, [map]);
};
