import { DateRange } from '@/app/components/common/DateRange';
import { Typography } from '@/app/components/common/Typography';
import { Dataset } from '@/app/types';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { Feature, Geometry } from 'geojson';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type DateReducerState = {
    minTime: Date | null;
    maxTime: Date | null;
};

export const TemporalCoverage: React.FC = () => {
    const { datasets, filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>('');

    const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const startDate = e.target.value;
        dispatch(setFilter({ startTemporalCoverage: startDate }));
    };

    const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const endDate = e.target.value;
        dispatch(setFilter({ endTemporalCoverage: endDate }));
    };

    useEffect(() => {
        const initialState: DateReducerState = {
            minTime: null,
            maxTime: null,
        };

        const reducer = (
            state: DateReducerState,
            feature: Feature<Geometry, Dataset>
        ) => {
            const [startTemporal, endTemporal] =
                feature.properties.temporalCoverage.split('/');
            const startDate = new Date(startTemporal);
            const endDate = new Date(endTemporal);

            return {
                minTime:
                    !state.minTime || startDate < state.minTime
                        ? startDate
                        : state.minTime,
                maxTime:
                    !state.maxTime || endDate > state.maxTime
                        ? endDate
                        : state.maxTime,
            };
        };

        const { minTime, maxTime } = datasets.features.reduce(
            reducer,
            initialState
        );

        // Get yyyy-mm-dd from timestamp
        if (minTime) {
            const _minTime = minTime.toISOString();
            setMinDate(_minTime.split('T')[0]);
        } else {
            setMinDate('');
        }
        if (maxTime) {
            const _maxTime = maxTime.toISOString();
            setMaxDate(_maxTime.split('T')[0]);
        } else {
            setMaxDate('');
        }
    }, [datasets]);

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
