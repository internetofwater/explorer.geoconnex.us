import React from 'react';
import CloseButton from './CloseButton';

type Props = {
    handleClose?: () => void;
    children: React.ReactNode;
    className?: string;
};

const Card: React.FC<Props> = (props) => {
    const { handleClose = null, className = '' } = props;

    return (
        <div className={`flex items-center text-black ${className}`}>
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-[100%]">
                {handleClose && (
                    <span className="absolute top-2 right-2">
                        <CloseButton
                            title="Close Card"
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 "
                        />
                    </span>
                )}
                {props.children}
            </div>
        </div>
    );
};

export default Card;
