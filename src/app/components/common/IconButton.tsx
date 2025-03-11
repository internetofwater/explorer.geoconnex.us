import React from 'react';

type Props = {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    title?: string;
};

const IconButton: React.FC<Props> = (props) => {
    const { onClick, className = '', disabled = false, title = '' } = props;

    return (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`bg-white hover:bg-gray-100
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
