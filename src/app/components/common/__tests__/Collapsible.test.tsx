import { fireEvent, render, screen } from '@testing-library/react';
import Collapsible from '../Collapsible';

describe('Common Components: Collapsible', () => {
    test('renders the title', () => {
        render(
            <Collapsible title="Test Title">
                <div>Test Content</div>
            </Collapsible>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('toggles content visibility on button click', () => {
        render(
            <Collapsible title="Test Title">
                <div>Test Content</div>
            </Collapsible>
        );

        const content = screen.getByTestId('collapsible-content');
        // Initially, the content should not be visible
        expect(content).toHaveClass('hidden');

        // Click the button to open the collapsible
        fireEvent.click(screen.getByText('Test Title'));
        expect(content).toHaveClass('block');

        // Click the button again to close the collapsible
        fireEvent.click(screen.getByText('Test Title'));
        expect(content).toHaveClass('hidden');
    });

    test('displays the correct arrow direction based on state', () => {
        render(
            <Collapsible title="Test Title">
                <div>Test Content</div>
            </Collapsible>
        );

        // Initially, the arrow should point to the right (collapsed state)
        const rightArrowIcon = screen.getByTestId('arrow-icon-wrapper');
        expect(rightArrowIcon).toHaveClass('rotate-90');

        // Click the button to open the collapsible
        fireEvent.click(screen.getByText('Test Title'));
        expect(rightArrowIcon).toHaveClass('-rotate-90');
    });
});
