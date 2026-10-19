import React from 'react';

type Props = {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'filled' | 'transparent';
    className?: string;
    disabled?: boolean;
    title?: string;
};

/**
 * Renders a button with an icon, supporting custom styles, disabled state, and a title for accessibility.
 *
 * Props:
 * - onClick: () => void - Function to handle the button click event.
 * - children: React.ReactNode - The icon or content to be rendered within the button.
 * - className?: string - Optional custom class names for additional styling.
 * - disabled?: boolean - Optional boolean to disable the button (default is false).
 * - title?: string - Optional title for the button, used for accessibility.
 *
 * @component
 */
const IconButton: React.FC<Props> = (props) => {
    const {
        onClick,
        className = '',
        disabled = false,
        title = '',
        variant = 'filled',
    } = props;

    const variantClasses =
        variant === 'filled'
            ? 'bg-primary-opaque enabled:hover:bg-gray-100 rounded-full shadow-md'
            : 'bg-transparent enabled:hover:opacity-80';

    return (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`${!disabled ? 'group' : ''} ${variantClasses}  p-2  
                w-11 h-11
                flex justify-center items-center
                transition-all
                
                ${className} 
                
                disabled:opacity-50 disabled:cursor-not-allowed
                enabled:hover:scale-110
                `}
        >
            <span className="w-full h-full transition-all group-hover:opacity-65">
                {props.children}
            </span>
        </button>
    );
};

export default IconButton;
