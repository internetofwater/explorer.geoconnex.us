import { useAppSelector } from '@/lib/state/hooks';
import {
    NotificationType,
    TNotificationType,
} from '@/lib/state/notifications/types';
import Notification from '@/app/components/common/Notification';
import { notificationManager } from '@/managers/init';

export const Notifications: React.FC = () => {
    const notifications = useAppSelector(
        (state) => state.notifications.notifications
    );

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

    return (
        <div className="fixed bottom-7 right-12 z-[9999]">
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
    );
};
