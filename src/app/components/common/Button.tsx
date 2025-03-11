import React from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
    onClick: () => void;
};

const Button: React.FC<Props> = (props) => {
    const { title, onClick } = props;

    return (
        <button
            title={title}
            onClick={onClick}
            className={
                'bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded'
            }
        >
            {props.children}
        </button>
    );
};

export default Button;
