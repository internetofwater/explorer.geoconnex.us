import React from 'react';
import CloseButton from '@/app/components/common/CloseButton';

type Props = {
    handleClose?: () => void;
    children: React.ReactNode;
    className?: string;
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
    const { handleClose = null, className = '' } = props;

    return (
        <div className={`flex items-center text-black ${className}`}>
            <div className="relative bg-primary-opaque rounded-lg shadow-lg p-6 w-[100%]">
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
