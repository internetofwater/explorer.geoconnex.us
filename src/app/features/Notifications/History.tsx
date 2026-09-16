import NotificationsIcon from '@/app/assets/icons/Notifications';
import IconButton from '@/app/components/common/IconButton';
import {
    TNotification,
    TNotificationType,
} from '@/lib/state/notifications/types';
import Notification from '@/app/components/common/Notification';
import { notificationManager } from '@/managers/init';

type Props = {
    show: boolean;
    onClick: (show: boolean) => void;
    notifications: TNotification[];
    getColor: (type: TNotificationType) => 'red' | 'green' | 'var(--secondary)';
};

export const History: React.FC<Props> = (props) => {
    const { show, onClick, notifications, getColor } = props;

    const count = notifications.filter(
        (notificiation) => !notificiation.visible && !notificiation.viewed
    ).length;

    return (
        <>
            {show && (
                <div className="flex flex-col items-end gap-2 max-h-[calc(100vh - 8.75rem)] overflow-y-auto p-1">
                    {notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            color={getColor(notification.type)}
                            onClose={() =>
                                notificationManager.delete(notification.id)
                            }
                            onMouseEnter={() =>
                                notificationManager.viewed(notification.id)
                            }
                            onMouseLeave={() => null}
                        >
                            {notification.message}
                        </Notification>
                    ))}
                </div>
            )}

            <div className="mt-2 ml-auto w-fit">
                <IconButton onClick={() => onClick(!show)}>
                    <NotificationsIcon />
                </IconButton>
                {count > 0 && (
                    <span
                        className="
                            absolute
                            bottom-8
                            right-[-0.1875rem]
                            flex
                            h-5
                            w-5
                            shadow-md
                            items-center
                            justify-center
                            rounded-full
                            bg-primary-opaque
                            text-xs
                            text-black
                        "
                    >
                        {count}
                    </span>
                )}
            </div>
        </>
    );
};
