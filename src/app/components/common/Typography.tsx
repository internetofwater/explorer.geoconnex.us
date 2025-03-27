import React, { ElementType } from 'react';

type Variant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'body-small'
    | 'small';

interface Props {
    variant: Variant;
    children: React.ReactNode;
    className?: string;
    as?: ElementType;
}

const tags: Record<Variant, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body: 'p',
    'body-small': 'p',
    small: 'span',
};

const sizes: Record<Variant, string> = {
    h1: 'text-5xl font-bold sm:text-4xl',
    h2: 'text-4xl font-bold sm:text-3xl',
    h3: 'text-3xl font-bold sm:text-2xl',
    h4: 'text-2xl font-bold sm:text-1xl',
    h5: 'text-xl font-bold sm:text-lg',
    h6: 'text-lg font-bold sm:text-md',
    body: 'text-lg sm:text-md',
    'body-small': 'text-md sm:text-sm',
    small: 'text-sm sm:text-xs',
};

/**
 * This function returns the CSS class names for a given typographic variant.
 * It maps the variant to predefined CSS classes that control the text size and styling.
 *
 * Parameters:
 * - variant: Variant - The typographic variant to get the styling for (e.g., 'h1', 'h2', 'body', etc.).
 *
 * Returns:
 * - string - The CSS class names corresponding to the specified variant.
 *
 * @function
 */
export const getTextStyling = (variant: Variant) => sizes[variant];

/**
 * Renders text with various typographic styles based on the provided variant.
 * It supports different HTML tags and custom class names for styling.
 *
 * Props:
 * - variant: Variant - The typographic variant to apply (e.g., 'h1', 'h2', 'body', etc.).
 * - children: React.ReactNode - The content to be rendered within the component.
 * - className?: string - Optional custom class names for additional styling.
 * - as?: ElementType - Optional HTML tag to use for rendering the text (default is based on the variant).
 *
 *
 * Example Usage:
 * ```tsx
 * <Typography variant="h1">Heading 1</Typography>
 * <Typography variant="body" className="text-blue-200">Body <strong>Text</strong></Typography>
 * <Typography variant="small" as="span">Small Text</Typography>
 * ```
 *
 * @component
 */
export const Typography = ({
    variant,
    children,
    className = '',
    as,
}: Props) => {
    const sizeClasses = sizes[variant];
    const Tag = as || tags[variant];

    return (
        <Tag
            className={`${sizeClasses} ${className} flex-grow text-text-default`}
        >
            {children}
        </Tag>
    );
};
