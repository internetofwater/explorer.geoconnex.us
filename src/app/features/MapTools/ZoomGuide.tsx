import { useMap } from '@/app/contexts/MapContexts';
import { MAP_ID } from '@/app/features/MainMap/config';
import { useEffect, useMemo, useState } from 'react';
import Card from '@/app/components/common/Card';
import {
    getColor,
    LARGE_MAINSTEM_VISIBLE_ZOOM,
    MEDIUM_MAINSTEM_VISIBLE_ZOOM,
    SMALL_MAINSTEM_VISIBLE_ZOOM,
} from '@/app/features/MainMap/consts';
import { Typography } from '@/app/components/common/Typography';
import { formatNumber } from '@/app/utils/formatNumber';

type Props = {
    zoom: number;
};

const ZoomGuideMessage: React.FC<Props> = (props) => {
    const { zoom } = props;

    if (zoom > SMALL_MAINSTEM_VISIBLE_ZOOM) {
        return (
            <Typography variant="body-small">
                <strong>Now Visible:</strong> All Mainstems.
            </Typography>
        );
    }

    if (zoom > MEDIUM_MAINSTEM_VISIBLE_ZOOM) {
        return (
            <Typography variant="body-small">
                <strong>Now Visible:</strong> Mainstems with over{' '}
                {formatNumber(600)} sqkm of Drainage.
            </Typography>
        );
    }

    if (zoom > LARGE_MAINSTEM_VISIBLE_ZOOM) {
        return (
            <Typography variant="body-small">
                <strong>Now Visible:</strong> Mainstems with over{' '}
                {formatNumber(1600)} sqkm of Drainage.
            </Typography>
        );
    }

    return (
        <Typography variant="body-small">
            Zoom in further to reveal mainstems.
        </Typography>
    );
};

export const ZoomGuide: React.FC = () => {
    const { map } = useMap(MAP_ID);

    const [zoom, setZoom] = useState<number | null>(null);

    useEffect(() => {
        if (!map) {
            return;
        }

        const handleZoom = () => setZoom(map.getZoom());

        map.on('zoom', handleZoom);

        setZoom(map.getZoom());

        return () => {
            map.off('zoom', handleZoom);
        };
    }, [map]);

    const sections = useMemo(() => {
        if (!map || !zoom) {
            return [];
        }

        const max = map.getMaxZoom();

        const sections = [
            {
                id: 'first',
                color: '#fff',
                start: 0,
                end: LARGE_MAINSTEM_VISIBLE_ZOOM,
            },
            {
                id: 'second',
                color: getColor('large'),
                start: LARGE_MAINSTEM_VISIBLE_ZOOM,
                end: MEDIUM_MAINSTEM_VISIBLE_ZOOM,
            },
            {
                id: 'third',
                color: getColor('medium'),
                start: MEDIUM_MAINSTEM_VISIBLE_ZOOM,
                end: SMALL_MAINSTEM_VISIBLE_ZOOM,
            },
            {
                id: 'fourth',
                color: getColor('small'),
                start: SMALL_MAINSTEM_VISIBLE_ZOOM,
                end: max,
            },
        ];

        const clamp = (n: number) => Math.max(0, Math.min(n, 1));

        return sections.map((section) => {
            const length = section.end - section.start;

            return {
                ...section,
                width: (length / max) * 100,
                pct: clamp((zoom - section.start) / length),
            };
        });
    }, [map, zoom]);

    if (!map || zoom === null || sections.length === 0) {
        return null;
    }

    return (
        <Card className="w-96">
            <div className=" flex flex-col gap-2 h-[6.5rem]">
                <Typography variant="h4" as="h4">
                    Mainstems
                </Typography>
                <div className="h-4 w-full overflow-hidden rounded-full bg-black flex flex-row justify-start items-center gap-0 border-2 border-solid border-black">
                    {sections.map(({ id, color, pct, width }) => (
                        <div
                            key={id}
                            className={`h-full origin-left transition-transform duration-100 ease-out`}
                            style={{
                                width: `${width * pct}%`,
                                backgroundColor: color,
                            }}
                        />
                    ))}
                </div>
                <ZoomGuideMessage zoom={zoom} />
            </div>
        </Card>
    );
};
