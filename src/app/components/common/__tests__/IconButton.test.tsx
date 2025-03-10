import { fireEvent, render, screen } from '@testing-library/react';
import IconButton from '../IconButton';
import HamburgerIcon from '@/app/assets/icons/Hamburger';

describe('Common Components: IconButton', () => {
    test('renders the button with children', () => {
        render(<IconButton onClick={() => {}}>Icon</IconButton>);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveTextContent('Icon');
    });

    test('renders the button with svg', () => {
        render(
            <IconButton onClick={() => {}}>
                <HamburgerIcon />
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        const svgElement = screen.getByTestId('map-icon');
        expect(buttonElement).toBeInTheDocument();
        expect(svgElement).toBeInTheDocument();
    });

    test('calls handleClick when clicked', () => {
        const handleClick = jest.fn();
        render(<IconButton onClick={handleClick}>Icon</IconButton>);
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call handleClick when disabled', () => {
        const handleClick = jest.fn();
        render(
            <IconButton onClick={handleClick} disabled>
                Icon
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(handleClick).not.toHaveBeenCalled();
    });

    test('applies the disabled class when disabled', () => {
        render(
            <IconButton onClick={() => {}} disabled>
                Icon
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass('opacity-50');
        expect(buttonElement).toHaveClass('cursor-not-allowed');
    });

    test('sets the title attribute when provided', () => {
        render(
            <IconButton onClick={() => {}} title="Button Title">
                Icon
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveAttribute('title', 'Button Title');
    });
});
