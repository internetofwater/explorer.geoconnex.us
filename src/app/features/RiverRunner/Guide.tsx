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

const calculateFeatureWeightedProgress = (
    phase: number,
    checkpoints: number[]
): number => {
    if (checkpoints.length === 0) {
        return phase * 100;
    }

    const normalized = [0, ...checkpoints, 1];

    for (let i = 0; i < normalized.length - 1; i++) {
        const start = normalized[i];
        const end = normalized[i + 1];

        if (phase <= end) {
            const localT = (phase - start) / (end - start);

            const visualStart = (i / (normalized.length - 1)) * 100;
            const visualEnd = ((i + 1) / (normalized.length - 1)) * 100;

            return visualStart + localT * (visualEnd - visualStart);
        }
    }

    return 100;
};

type Props = {
    hasBeenSelected: boolean;
};

const Indicator: React.FC<Props> = (props) => {
    const { hasBeenSelected } = props;

    return (
        <div
            className="h-4 w-4 rounded-full transition-colors duration-300 shadow-md"
            style={{
                backgroundColor: hasBeenSelected
                    ? 'var(--tertiary)'
                    : '#e5e7eb',
            }}
        />
    );
};

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

    const weightedProgress = calculateFeatureWeightedProgress(
        frameSettings.phase,
        riverFeatures
            .map((r) => r.progress)
            .filter((p): p is number => typeof p === 'number')
    );

    return (
        <div className="absolute z-[99999] top-4 left-2 ">
            <Card className="relative w-96 min-h-56 h-full flex-col !items-start">
                <Title mode={MODE.RiverRunner} />
                <div className="flex justify-start items-start gap-0 h-full">
                    <div className="self-stretch">
                        <ProgressBar
                            orientation="vertical"
                            percentage={weightedProgress / 100}
                        />
                    </div>
                    <div className="flex flex-col justify-evenly items-start gap-1 -ml-3 z-20">
                        {riverFeatures.map((r) => (
                            <div
                                className="flex items-center justify-start gap-2"
                                key={r.feature_data_index}
                            >
                                <Indicator
                                    hasBeenSelected={
                                        typeof r.progress === 'number'
                                            ? frameSettings.phase > r.progress
                                            : false
                                    }
                                />
                                <Typography variant="body-small">
                                    {r.name ?? 'Unknown'}
                                </Typography>
                            </div>
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
