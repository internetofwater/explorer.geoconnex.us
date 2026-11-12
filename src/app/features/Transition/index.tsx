import { Spinner } from '@/app/assets/Spinner';
import { Blur } from '@/app/components/common/Blur';
import Card from '@/app/components/common/Card';
import { Typography } from '@/app/components/common/Typography';
import { useAppSelector } from '@/lib/state/hooks';
import { STATUS_TYPE, TStatusType } from '@/lib/state/river-runner/types';

const Transition: React.FC = () => {
    const status = useAppSelector((s) => s.riverRunner.status);

    const getMessage = (status: TStatusType) => {
        if (status === 'unitialized') {
            return 'Checking necessary assets...';
        }

        if (status === 'calculating') {
            return 'Determining route...';
        }

        return 'Beginning River Run...';
    };

    const loadingStatuses: TStatusType[] = [
        STATUS_TYPE.Uninitialized,
        STATUS_TYPE.Calculating,
        STATUS_TYPE.Overview,
    ];
    const isLoadingRiverRunner = loadingStatuses.includes(status);

    if (!isLoadingRiverRunner) {
        return null;
    }

    return (
        <>
            <div className=" absolute z-[99999] w-svw h-svh flex justify-center items-center">
                <Card className=" m-auto">
                    <div className="flex items-center gap-8">
                        <Spinner />
                        <Typography variant="body">
                            {getMessage(status)}
                        </Typography>
                    </div>
                </Card>
            </div>
            <Blur />
        </>
    );
};

export default Transition;
