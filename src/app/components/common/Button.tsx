import React from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
    handleClick: () => void;
};

const Button: React.FC<Props> = (props) => {
    const { title, handleClick } = props;

    return (
        <button
            title={title}
            onClick={handleClick}
            className={
                'bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded'
            }
        >
            {props.children}
        </button>
    );
};

export default Button;
