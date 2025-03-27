import React from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
    onClick: () => void;
};

/**
 * Renders a button with a title, click handler, and custom content.
 * It supports styling for different states such as hover.
 *
 * Props:
 * - title: string - The title for the button, used for accessibility.
 * - children: React.ReactNode - The content to be rendered within the button.
 * - onClick: () => void - Function to handle the button click event.
 *
 * @component
 */
const Button: React.FC<Props> = (props) => {
    const { title, onClick } = props;

    return (
        <button
            title={title}
            onClick={onClick}
            className={
                'py-2 px-4 bg-secondary hover:bg-secondary-hover text-white font-bold rounded'
            }
        >
            {props.children}
        </button>
    );
};

export default Button;
