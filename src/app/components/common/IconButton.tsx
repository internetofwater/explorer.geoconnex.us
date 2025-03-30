import React from 'react';

type Props = {
    onClick: () => void;
    children: React.ReactNode;
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
    const { onClick, className = '', disabled = false, title = '' } = props;

    return (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`bg-primary-opaque hover:bg-gray-100
                rounded-full p-2 shadow-md 
                w-11 h-11
                flex justify-center items-center

                ${className} 
                
                ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                }`}
        >
            {props.children}
        </button>
    );
};

export default IconButton;
