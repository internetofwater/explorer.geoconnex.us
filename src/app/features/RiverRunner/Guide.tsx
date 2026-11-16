import Card from '@/app/components/common/Card';
import { Typography } from '@/app/components/common/Typography';
import { useAppSelector } from '@/lib/state/hooks';
import { STATUS_TYPE } from '@/lib/state/river-runner/types';
import { Title } from '../SidePanel/Title';
import { MODE } from '@/lib/state/main/slice';
import IconButton from '@/app/components/common/IconButton';
import { riverRunnerService } from '@/services/init/init';
import Play from '@/app/assets/icons/Play';
import Pause from '@/app/assets/icons/Pause';
import Link from '@/app/assets/icons/Link';
import CloseIcon from '@/app/assets/icons/Close';
import { ProgressBar } from '@/app/components/common/Progress';

export const Guide: React.FC = () => {
    const status = useAppSelector((s) => s.riverRunner.status);
    const riverFeatures = useAppSelector((s) => s.riverRunner.riverFeatures);
    const isPaused = useAppSelector((s) => s.riverRunner.flags.paused);
    const frameSettings = useAppSelector((s) => s.riverRunner.frameSettings);

    const handleToggle = () => {
        riverRunnerService.toggle();
    };

    const handleAbort = () => {
        riverRunnerService.abort();
    };

    if (status !== STATUS_TYPE.Running || !frameSettings) {
        return null;
    }

    // console.log('framesettings, ', frameSettings);

    return (
        <div className="absolute z-[99999] top-4 left-2 ">
            <Card className="relative w-96 min-h-56 h-full flex-col !items-start">
                <Title mode={MODE.RiverRunner} />
                <div className="flex justify-start items-start gap-0 h-full">
                    <div className="self-stretch">
                        <ProgressBar
                            orientation="vertical"
                            percentage={frameSettings.phase / 1}
                        />
                    </div>
                    <div className="flex flex-col justify-evenly gap-1">
                        {riverFeatures.map((r) => (
                            <Typography
                                variant="body-small"
                                key={r.feature_data_index}
                            >
                                {r.name ?? 'Unknown'}
                            </Typography>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 -right-6 h-full w-fit py-4 flex flex-col justify-between gap-1">
                    <IconButton
                        variant="alternative"
                        onClick={handleToggle}
                        className="!rounded-full"
                    >
                        {isPaused ? <Play /> : <Pause />}
                    </IconButton>
                    <IconButton
                        variant="alternative"
                        onClick={() => null}
                        className="!rounded-full"
                        disabled
                    >
                        <Link />
                    </IconButton>
                    <IconButton
                        variant="alternative"
                        onClick={handleAbort}
                        className="!rounded-full"
                    >
                        <CloseIcon className="w-8 h-8" />
                    </IconButton>
                </div>
            </Card>
        </div>
    );
};
