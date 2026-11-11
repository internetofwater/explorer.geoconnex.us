import React, { MouseEventHandler } from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    variant?: 'secondary' | 'tertiary'; // Reflecting tailwind config, need to distinguish action element colors from layout color
    onClick: MouseEventHandler<HTMLButtonElement>;
};

/**
 * Renders a button with a title, click handler, and custom content.
 * It supports styling for different states such as hover.
 *
 * Props:
 * - title: string - The title for the button, used for accessibility.
 * - children: React.ReactNode - The content to be rendered within the button.
 * - onClick: () => void - Function to handle the button click event.
 *
 * @component
 */
const Button: React.FC<Props> = (props) => {
    const {
        title,
        onClick,
        className = '',
        variant = 'secondary',
        disabled = false,
    } = props;

    const variantClasses =
        variant === 'secondary'
            ? 'bg-secondary enabled:hover:bg-secondary-hover text-white'
            : 'bg-tertiary enabled:hover:bg-tertiary-hover text-black';

    return (
        <button
            title={title}
            onClick={onClick}
            className={`py-2 px-4 ${variantClasses} disabled:opacity-50 shadow-md font-bold rounded transition-all ${className}`}
            disabled={disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;
