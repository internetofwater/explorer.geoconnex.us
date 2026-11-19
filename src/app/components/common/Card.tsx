import React, { CSSProperties } from 'react';
import CloseButton from '@/app/components/common/CloseButton';

type Props = {
    handleClose?: () => void;
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
};

/**
 * Renders a card with optional close functionality, supporting custom styles and content.
 *
 * Props:
 * - handleClose?: () => void - Optional function to handle closing the card.
 * - children: React.ReactNode - The content to be rendered within the card.
 * - className?: string - Optional custom class names for additional styling.
 *
 * @component
 */
const Card: React.FC<Props> = (props) => {
    const { handleClose = null, className = '', style } = props;

    return (
        <div
            className={`flex items-center text-black relative bg-primary-opaque rounded-lg shadow-lg p-6 ${className}`}
            style={style}
        >
            {handleClose && (
                <span className="absolute top-2 right-2">
                    <CloseButton title="Close Card" onClick={handleClose} />
                </span>
            )}
            {props.children}
        </div>
    );
};

export default Card;
