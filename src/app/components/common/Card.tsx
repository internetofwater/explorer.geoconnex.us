import React from 'react';
import CloseButton from '@/app/components/common/CloseButton';

type Props = {
    children: React.ReactNode;
    handleClose?: () => void;
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
                            handleClick={handleClose}
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
