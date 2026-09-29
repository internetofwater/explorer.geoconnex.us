export type TOption<T extends string | number | null = string | number> = {
    value: T;
    label: string;
};
