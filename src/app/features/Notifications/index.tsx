import { useAppSelector } from '@/lib/state/hooks';
import {
    NotificationType,
    TNotificationType,
} from '@/lib/state/notifications/types';
import Notification from '@/app/components/common/Notification';
import { notificationManager } from '@/managers/init';
import { History } from './History';
import { useState } from 'react';

export const Notifications: React.FC = () => {
    const notifications = useAppSelector(
        (state) => state.notifications.notifications
    );

    const [open, setOpen] = useState(false);

    const getColor = (type: TNotificationType) => {
        switch (type) {
            case NotificationType.Error:
                return 'red';
            case NotificationType.Success:
                return 'green';
            case NotificationType.Info:
            default:
                return 'var(--secondary)';
        }
    };

    const handleClick = (show: boolean) => {
        if (show) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-7 right-12 z-[9999]">
            {!open && (
                <div className="flex flex-col items-end max-h-[calc(100vh - 8.75rem)] gap-2 overflow-y-auto p-1">
                    {notifications
                        .filter((notification) => notification.visible)
                        .map((notification) => (
                            <Notification
                                key={notification.id}
                                color={getColor(notification.type)}
                                onClose={() =>
                                    notificationManager.hide(notification.id)
                                }
                                onMouseEnter={() =>
                                    notificationManager.pause(notification.id)
                                }
                                onMouseLeave={() =>
                                    notificationManager.resume(notification.id)
                                }
                            >
                                {notification.message}
                            </Notification>
                        ))}
                </div>
            )}
            <History
                show={open}
                onClick={handleClick}
                notifications={notifications}
                getColor={getColor}
            />
        </div>
    );
};
