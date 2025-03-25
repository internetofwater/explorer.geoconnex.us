import { DateRange } from '@/app/components/common/DateRange';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    minTime: Date | null;
    maxTime: Date | null;
};

export const TemporalCoverage: React.FC<Props> = (props) => {
    const { minTime, maxTime } = props;

    const { filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>('');

    useEffect(() => {
        if (minTime) {
            const _minTime = minTime.toISOString();
            setMinDate(_minTime.split('T')[0]);
        } else {
            setMinDate('');
        }
    }, [minTime]);

    useEffect(() => {
        if (maxTime) {
            const _maxTime = maxTime.toISOString();
            setMaxDate(_maxTime.split('T')[0]);
        } else {
            setMaxDate('');
        }
    }, [maxTime]);

    const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const startDate = e.target.value;
        dispatch(setFilter({ startTemporalCoverage: startDate }));
    };

    const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const endDate = e.target.value;
        dispatch(setFilter({ endTemporalCoverage: endDate }));
    };

    return (
        <>
            <Typography variant="h6">Temporal Coverage</Typography>
            <DateRange
                startDate={filter?.startTemporalCoverage ?? minDate}
                handleStartDateChange={handleStartDateChange}
                endDate={filter?.endTemporalCoverage ?? maxDate}
                handleEndDateChange={handleEndDateChange}
            />
        </>
    );
};
