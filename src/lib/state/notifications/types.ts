export const NOTIFICATION_TYPE = {
    Success: 'success',
    Error: 'error',
    Info: 'info',
} as const;

export type TNotificationType =
    (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export type TNotification = {
    id: string;
    message: string;
    createdAt: number;
    type: TNotificationType;
    visible: boolean; // This notification is visible on screen
    viewed: boolean; // This notification has been viewed in history
};

export type InitialState = {
    notifications: TNotification[];
};

export const initialState: InitialState = {
    notifications: [],
};
