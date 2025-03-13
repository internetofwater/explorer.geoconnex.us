import CloseIcon from '@/app/assets/icons/Close';
import React from 'react';

type Props = {
    onClick: () => void;
    className?: string;
    closeIconClassName?: string;
    title?: string;
};

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
