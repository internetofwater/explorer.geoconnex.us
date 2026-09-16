export const NotificationType = {
    Success: 'success',
    Error: 'error',
    Info: 'info',
};

export type TNotificationType =
    (typeof NotificationType)[keyof typeof NotificationType];

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
