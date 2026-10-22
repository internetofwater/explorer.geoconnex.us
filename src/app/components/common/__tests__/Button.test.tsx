import { fireEvent, render, screen } from '@testing-library/react';
import Button from '@/app/components/common/Button';
import { getTestTypeLabel, TestType } from '@/app/utils/__tests__/getTestType';

const TYPE = TestType.CommonComponents;

const LABEL = getTestTypeLabel(TYPE);

describe(`${LABEL}: Button`, () => {
    test('renders the button with children', () => {
        render(
            <Button title="test" onClick={() => {}}>
                Click Me
            </Button>
        );
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls handleClick when clicked', () => {
        const handleClick = jest.fn();
        render(
            <Button title="test" onClick={handleClick}>
                Click Me
            </Button>
        );
        const buttonElement = screen.getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
