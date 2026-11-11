import React from 'react';

type Props = {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'filled' | 'alternative' | 'transparent';
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
            ? 'bg-primary-opaque enabled:hover:bg-gray-100 rounded-full shadow-md group-hover:opacity-65 enabled:hover:scale-110'
            : variant === 'alternative'
              ? 'bg-tertiary enabled:hover:bg-tertiary-hover rounded-md shadow-md'
              : 'bg-transparent enabled:hover:opacity-80 group-hover:opacity-65 enabled:hover:scale-110';

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
                
                `}
        >
            <span className="w-full h-full text-center flex flex-row justify-center items-center transition-all ">
                {props.children}
            </span>
        </button>
    );
};

export default IconButton;
