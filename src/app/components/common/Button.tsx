import React from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick: () => void;
};

const Button: React.FC<Props> = (props) => {
    const { title, onClick, className = '', disabled = false } = props;

    return (
        <button
            title={title}
            onClick={onClick}
            className={`bg-secondary hover:bg-secondary-hover disabled:opacity-50 text-white font-bold py-2 px-4 rounded ${className}`}
            disabled={disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;
