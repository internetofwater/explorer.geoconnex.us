import CloseIcon from '@/app/assets/icons/Close';
import React from 'react';

type Props = {
    onClick: () => void;
    className?: string;
    closeIconClassName?: string;
    title?: string;
};

/**
 * Renders a button with a close icon, supporting custom styles and a title for accessibility.
 *
 * Props:
 * - onClick: () => void - Function to handle the button click event.
 * - className?: string - Optional custom class names for additional styling.
 * - closeIconClassName?: string - Optional custom class names for the close icon (default is 'w-6 h-6').
 * - title?: string - Optional title for the button, used for accessibility (default is 'Close').
 *
 * @component
 */
const CloseButton: React.FC<Props> = (props) => {
    const {
        onClick,
        className = '',
        closeIconClassName = 'w-6 h-6',
        title = 'Close',
    } = props;

    return (
        <button
            title={title}
            aria-label={title}
            data-testid="close-button"
            onClick={onClick}
            className={className}
        >
            <CloseIcon className={closeIconClassName} />
        </button>
    );
};

export default CloseButton;
