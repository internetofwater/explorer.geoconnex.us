import CloseIcon from '@/app/assets/icons/Close';
import Button from '@/app/components/common/Button';
import CloseButton from '@/app/components/common/CloseButton';
import IconButton from '@/app/components/common/IconButton';
import { Typography } from '@/app/components/common/Typography';
import { riverRunnerService } from '@/services/init/init';
import { TMapInteraction } from '@/services/river-runner/types';

type Props = {
    e: TMapInteraction;
    name?: string;
    close: () => void;
};

const Popup: React.FC<Props> = (props) => {
    const { e, close } = props;

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
            <div className="flex justify-between items-end my-2 p-2">
                <div className="flex flex-col mr-4">
                    {/* TODO: add mainstem and place text blurb */}
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
