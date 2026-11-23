import Button from '@/app/components/common/Button';
import CloseButton from '@/app/components/common/CloseButton';
import { Typography } from '@/app/components/common/Typography';
import {
    riverRunnerDataService,
    riverRunnerService,
} from '@/services/init/init';
import { TMapInteraction } from '@/services/river-runner/types';
import { useEffect, useState } from 'react';

type Props = {
    e: TMapInteraction;
    name?: string;
    close: () => void;
};

type TPlace = {
    city: string;
    state: string;
    country?: string;
};

const Popup: React.FC<Props> = (props) => {
    const { e, close } = props;

    const [place, setPlace] = useState<TPlace | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        setPlace(null);

        void riverRunnerDataService
            .getPlaces(e.lngLat, controller.signal)
            .then((r) => {
                if (r && r.features.length > 0) {
                    const feature = r.features[0];

                    // Example addresses:
                    // "Hidalgo del Parral, Chihuahua, Mexico"
                    // "Nelson, British Columbia, Canada"
                    // "Ord, Nebraska, United States"
                    const address = feature.properties.full_address.split(', ');

                    const [city, state, country] = address;

                    const place: TPlace = {
                        city,
                        state,
                    };

                    if (country !== 'United States') {
                        place.country = country;
                    }

                    if (isMounted) {
                        setPlace(place);
                    }
                }
            })
            .catch((err) => console.error(err));

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [e]);

    const handleClick = () => {
        close();
        void riverRunnerService.initialize(e);
    };

    return (
        <div className="bg-primary flex flex-col rounded-lg">
            <div className="flex justify-between items-center p-2">
                <Typography variant="body-large" className="text-xl">
                    <strong>Lat:</strong> {e.lngLat.lat.toFixed(5)} —{' '}
                    <strong>Lng:</strong> {e.lngLat.lng.toFixed(5)}
                </Typography>
                <CloseButton onClick={close} className="text-black" />
            </div>
            <div className="h-px self-stretch bg-gray-300" />
            <div className="flex justify-between items-end my-2 px-2">
                <div className="flex flex-col mr-4 gap-4">
                    {place && (
                        <div className="flex flex-col gap-0">
                            <Typography variant="body">
                                <strong>Nearest Place:</strong>
                            </Typography>
                            <Typography variant="body-small">
                                {place.city}, {place.state}
                            </Typography>
                            <Typography
                                variant="body-small"
                                className="text-gray-600"
                            >
                                {place.country}
                            </Typography>
                        </div>
                    )}
                    <Typography variant="body-small">
                        Start a River Run from this coordinate?
                    </Typography>
                </div>
                <Button
                    title="Start River Run"
                    variant="tertiary"
                    onClick={handleClick}
                    className="w-20"
                >
                    <Typography variant="body">Go</Typography>
                </Button>
            </div>
        </div>
    );
};

export default Popup;
