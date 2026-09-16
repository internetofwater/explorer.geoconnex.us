import React, { PropsWithChildren } from 'react';
import { Typography } from '@/app/components/common/Typography';
import CloseButton from '@/app/components/common/CloseButton';

type Props = {
    color: string;
    onClose: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
};

/**
 *
 * @component
 */
const Notification: React.FC<PropsWithChildren<Props>> = (props) => {
    const { color, onClose, onMouseEnter, onMouseLeave } = props;

    return (
        <div
            className="bg-primary-opaque rounded-lg shadow-lg min-w-96 p-2 flex flex-row items-center justify-start gap-4 z-var(--z-notification)"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className="w-2 self-stretch rounded-md"
                style={{ backgroundColor: color }}
            />
            <Typography variant="body-small">{props.children}</Typography>
            <CloseButton
                className="text-gray-900 hover:text-gray-700 text-xs ml-auto"
                closeIconClassName="w-5 h-5"
                onClick={onClose}
                title="Hide this notification"
            />
        </div>
    );
};

export default Notification;
