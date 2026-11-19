import Card from '@/app/components/common/Card';
import { Typography } from '@/app/components/common/Typography';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
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
import Slider from '@/app/components/common/Slider';
import Collapsible from '@/app/components/common/Collapsible';
import Next from '@/app/assets/icons/Next';
import Previous from '@/app/assets/icons/Previous';
import { setPhaseJump } from '@/lib/state/river-runner/slice';

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
                    : '#707070',
            }}
        />
    );
};

export const Guide: React.FC = () => {
    const status = useAppSelector((s) => s.riverRunner.status);
    const riverFeatures = useAppSelector((s) => s.riverRunner.riverFeatures);
    const isPaused = useAppSelector((s) => s.riverRunner.flags.paused);
    const frameSettings = useAppSelector((s) => s.riverRunner.frameSettings);
    const featureIndex = useAppSelector((s) => s.riverRunner.featureIndex);
    const altitudeMultiplier = useAppSelector(
        (s) => s.riverRunner.driver.altitudeMultiplier
    );

    const dispatch = useAppDispatch();

    const handleToggle = () => {
        riverRunnerService.toggle();
    };

    const handleAbort = () => {
        riverRunnerService.abort();
    };

    if (status !== STATUS_TYPE.Running) {
        return null;
    }

    const weightedProgress = calculateFeatureWeightedProgress(
        frameSettings?.phase ?? 0,
        riverFeatures
            .map((r) => r.progress)
            .filter((p): p is number => typeof p === 'number')
    );

    const jumpIndex = (direction: 'next' | 'previous') => {
        if (featureIndex === null) {
            return;
        }

        const nextIndex =
            direction === 'next' ? featureIndex + 1 : featureIndex - 1;

        if (nextIndex < 0 || nextIndex >= riverFeatures.length) {
            return;
        }

        dispatch(setPhaseJump(riverFeatures[nextIndex].progress));
    };

    const handleNext = () => jumpIndex('next');
    const handlePrevious = () => jumpIndex('previous');

    const handleAltitudeChange = (altitudeMultiplier: number) => {
        riverRunnerService.setDriver({ altitudeMultiplier });
    };

    return (
        <div className="absolute z-[99999] top-4 left-2 ">
            <Card className="relative w-[22rem] min-h- h-full flex-col !items-start !bg-[#ffffffbf] !bg-opacity-60 !p-2">
                <div className="h-full flex-col !items-start">
                    <Title mode={MODE.RiverRunner} />
                    <div
                        className="flex flex-grow justify-start items-stretch gap-0 h-full ml-8 mt-2 pb-10"
                        style={{
                            maxHeight: `${1.95 * riverFeatures.length}rem`,
                        }}
                    >
                        <div className="self-stretch">
                            <ProgressBar
                                background="#707070"
                                orientation="vertical"
                                percentage={
                                    frameSettings ? weightedProgress / 100 : 0
                                }
                            />
                        </div>
                        <div className="flex flex-col justify-between items-start gap-1 -ml-[0.65rem] z-20">
                            {riverFeatures.map((r) => (
                                <div
                                    className="flex items-center justify-start gap-2"
                                    key={r.feature_data_index}
                                >
                                    <Indicator
                                        hasBeenSelected={
                                            typeof r.progress === 'number'
                                                ? (frameSettings?.phase ?? -1) >
                                                  r.progress
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
                </div>

                {frameSettings && (
                    <>
                        <div className="absolute top-0 -right-6 h-full w-fit py-8 flex flex-col justify-between gap-1">
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
                        <div className="flex h-fit w-full -mx-2 -mb-2 border-t border-solid border-gray-500">
                            <IconButton
                                className="rounded-none"
                                onClick={handlePrevious}
                                disabled={featureIndex === 0}
                            >
                                <Previous />
                            </IconButton>
                            <IconButton
                                className="rounded-none"
                                onClick={handleNext}
                                disabled={
                                    featureIndex === riverFeatures.length - 1
                                }
                            >
                                <Next />
                            </IconButton>
                            <Collapsible
                                className="relative !bg-transparent"
                                buttonClassname="min-w-0 border-x !py-[0.6rem] !border-y-0 border-solid enabled:hover:scale-105 border-[var(--border)]"
                                title={
                                    <div className=" text-left mr-2">
                                        <Typography variant="body">
                                            Detail / Speed
                                        </Typography>
                                    </div>
                                }
                            >
                                <div className="absolute top-[2.5rem] pb-2 pl-2 pt-2 w-4 bg-primary w-full min-h-48 h-full max-h-52 ">
                                    <Slider
                                        orientation="vertical"
                                        invert
                                        className="w-full"
                                        value={altitudeMultiplier}
                                        min={0.6}
                                        max={5}
                                        step={0.01}
                                        onChange={handleAltitudeChange}
                                        labels={
                                            [
                                                {
                                                    value: 0.6,
                                                    label: (
                                                        <>
                                                            Low Detail /<br />
                                                            High Speed
                                                        </>
                                                    ),
                                                },
                                                {
                                                    value: 5,
                                                    label: (
                                                        <>
                                                            High Detail /<br />
                                                            Low Speed
                                                        </>
                                                    ),
                                                },
                                            ] as const
                                        }
                                    />
                                </div>
                            </Collapsible>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};
