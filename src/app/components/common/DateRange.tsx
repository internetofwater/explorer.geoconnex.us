import React, { ChangeEvent } from 'react';
import { Typography } from '@/app/components/common/Typography';

type Props = {
    startDate: string;
    handleStartDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
    endDate: string;
    handleEndDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Renders a date range input with start and end dates.
 * It includes labels and input fields for selecting the dates, and handles changes to the date values.
 *
 * Props:
 * - startDate: string - The selected start date.
 * - handleStartDateChange: (e: ChangeEvent<HTMLInputElement>) => void - Function to handle changes to the start date.
 * - endDate: string - The selected end date.
 * - handleEndDateChange: (e: ChangeEvent<HTMLInputElement>) => void - Function to handle changes to the end date.
 *
 * @component
 */
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
                        className="p-2 text-text-default border border-gray-300 rounded-md"
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
                        className="p-2 text-text-default border border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </>
    );
};
