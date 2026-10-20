import { fireEvent, render, screen } from '@testing-library/react';
import { DateRange } from '@/app/components/common/DateRange';
import { getTestTypeLabel, TestType } from '@/app/utils/__tests__/getTestType';

const TYPE = TestType.CommonComponents;

const LABEL = getTestTypeLabel(TYPE);

describe(`${LABEL}: DateRange`, () => {
    test('renders the start date input with the correct value', () => {
        render(
            <DateRange
                startDate="2023-01-01"
                handleStartDateChange={() => {}}
                endDate="2023-12-31"
                handleEndDateChange={() => {}}
            />
        );
        const startDateInput = screen.getByLabelText(
            /Start Date/i
        ) as HTMLInputElement;
        expect(startDateInput).toBeInTheDocument();
        expect(startDateInput.value).toBe('2023-01-01');
    });

    test('renders the end date input with the correct value', () => {
        render(
            <DateRange
                startDate="2023-01-01"
                handleStartDateChange={() => {}}
                endDate="2023-12-31"
                handleEndDateChange={() => {}}
            />
        );
        const endDateInput = screen.getByLabelText(
            /End Date/i
        ) as HTMLInputElement;
        expect(endDateInput).toBeInTheDocument();
        expect(endDateInput.value).toBe('2023-12-31');
    });

    test('calls handleStartDateChange when the start date is changed', () => {
        const handleStartDateChange = jest.fn();
        render(
            <DateRange
                startDate="2023-01-01"
                handleStartDateChange={handleStartDateChange}
                endDate="2023-12-31"
                handleEndDateChange={() => {}}
            />
        );
        const startDateInput = screen.getByLabelText(
            /Start Date/i
        ) as HTMLInputElement;
        fireEvent.change(startDateInput, { target: { value: '2023-02-01' } });
        expect(handleStartDateChange).toHaveBeenCalledTimes(1);
    });

    test('calls handleEndDateChange when the end date is changed', () => {
        const handleEndDateChange = jest.fn();
        render(
            <DateRange
                startDate="2023-01-01"
                handleStartDateChange={() => {}}
                endDate="2023-12-31"
                handleEndDateChange={handleEndDateChange}
            />
        );
        const endDateInput = screen.getByLabelText(
            /End Date/i
        ) as HTMLInputElement;
        fireEvent.change(endDateInput, { target: { value: '2023-11-30' } });
        expect(handleEndDateChange).toHaveBeenCalledTimes(1);
    });
});
