import React from 'react';

type Props = {
    children: React.ReactNode;
    onClick: () => void;
};

const Button: React.FC<Props> = (props) => {
    const { onClick: handleClick } = props;

    return (
        <button
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
