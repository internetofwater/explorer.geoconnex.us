type TSuperFetchSimple = {
    url: string;
    init?: RequestInit | undefined;
    statusHandlers?: Record<
        number,
        {
            shouldTerminate: boolean;
            action: (response?: Response) => void | Promise<void>;
        }
    >;
    onSuccess?: () => void;
    onCatch?: (error?: unknown) => void;
    onFinally?: () => void;
    rethrow?: boolean;
};

export type TSuperFetchArgs<T = unknown> = TSuperFetchSimple & {
    parse: (response: Response) => Promise<T>;
    cache?: Map<string, unknown>;
    getKey?: () => string;
};
