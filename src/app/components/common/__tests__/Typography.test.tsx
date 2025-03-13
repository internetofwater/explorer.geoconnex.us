import React from 'react';
import { render, screen } from '@testing-library/react';
import { Typography } from '../Typography';

describe('Common Components: Typography', () => {
    test('renders the correct HTML tag based on the variant', () => {
        render(<Typography variant="h1">Heading 1</Typography>);
        const element = screen.getByText('Heading 1');
        expect(element.tagName).toBe('H1');
    });

    test('applies the correct size classes based on the variant', () => {
        render(<Typography variant="h2">Heading 2</Typography>);
        const element = screen.getByText('Heading 2');
        expect(element).toHaveClass('text-4xl font-bold sm:text-3xl');
    });

    test('applies additional classes passed via className prop', () => {
        render(
            <Typography variant="body" className="custom-class">
                Body Text
            </Typography>
        );
        const element = screen.getByText('Body Text');
        expect(element).toHaveClass('text-lg sm:text-md custom-class');
    });

    test('renders the correct HTML tag when "as" prop is provided', () => {
        render(
            <Typography variant="h3" as="div">
                Heading 3
            </Typography>
        );
        const element = screen.getByText('Heading 3');
        expect(element.tagName).toBe('DIV');
    });

    test('renders children correctly', () => {
        render(<Typography variant="small">Small Text</Typography>);
        const element = screen.getByText('Small Text');
        expect(element).toBeInTheDocument();
    });
});
