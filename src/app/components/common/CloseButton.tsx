import { CloseIcon } from '@/app/assets/icons/CloseIcon';
import React from 'react';

type Props = {
    handleClick: () => void;
    className?: string;
    closeIconClassName?: string;
};

const CloseButton: React.FC<Props> = (props) => {
    const {
        handleClick,
        className = '',
        closeIconClassName = 'w-6 h-6',
    } = props;

    return (
        <button
            data-testid="close-button"
            onClick={handleClick}
            className={`close-button focus:outline-none ${className}`}
        >
            <CloseIcon className={closeIconClassName} />
        </button>
    );
};

export default CloseButton;
