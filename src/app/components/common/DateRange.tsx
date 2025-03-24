import React, { ChangeEvent } from 'react';
import { Typography } from '@/app/components/common/Typography';

type Props = {
    startDate: string;
    handleStartDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
    endDate: string;
    handleEndDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const DateRange: React.FC<Props> = (props) => {
    const { startDate, handleStartDateChange, endDate, handleEndDateChange } =
        props;
    return (
        <>
            {/* Defined in global.css */}
            <div id="date-range-columns">
                <div className="flex flex-col">
                    <label htmlFor="start-date" className="mb-1">
                        <Typography variant="body-small">Start Date</Typography>
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="p-2 text-black border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="end-date" className="mb-1">
                        <Typography variant="body-small">End Date</Typography>
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="p-2 text-black border border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </>
    );
};
