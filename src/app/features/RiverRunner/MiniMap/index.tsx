import Map from '@/app/components/Map';
import {
    BASEMAP,
    MINI_MAP_ID,
    sourceConfigs,
    layerDefinitions,
} from './config';
import { useMap } from '@/app/contexts/MapContexts';
import { useEffect } from 'react';
import { useAppSelector } from '@/lib/state/hooks';
import { STATUS_TYPE } from '@/lib/state/river-runner/types';
import Card from '@/app/components/common/Card';
import { riverRunnerService } from '@/services/init/init';

const INITIAL_CENTER: [number, number] = [-98.5795, 39.8282];
const INITIAL_ZOOM = 4;

type Props = {
    accessToken: string;
};

const MiniMap: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { map } = useMap(MINI_MAP_ID);

    const status = useAppSelector((s) => s.riverRunner.status);

    useEffect(() => {
        if (!map) {
            return;
        }

        // Don't allow interactions with map
        map.scrollZoom.disable();
        map.boxZoom.disable();
        map.dragRotate.disable();
        map.dragPan.disable();
        map.keyboard.disable();
        map.doubleClickZoom.disable();
        map.touchZoomRotate.disable();

        riverRunnerService.setMiniMap(map);
    }, [map]);

    return (
        <Card
            className="!absolute !p-2 right-4 bottom-8 z-[99999]"
            style={{
                visibility: status !== STATUS_TYPE.Running ? 'hidden' : 'unset',
            }}
        >
            <div className="relative w-80 h-60 ">
                <Map
                    accessToken={accessToken}
                    id={MINI_MAP_ID}
                    sources={sourceConfigs}
                    layers={layerDefinitions}
                    options={{
                        style: BASEMAP,
                        projection: 'mercator',
                        center: INITIAL_CENTER,
                        zoom: INITIAL_ZOOM,
                        maxZoom: 20,
                    }}
                />
            </div>
        </Card>
    );
};

export default MiniMap;
