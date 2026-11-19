type TRounded<T> = T extends number
    ? string
    : T extends number[]
      ? string[]
      : T extends Record<string, number>
        ? { [K in keyof T]: string }
        : never;

export const round = <T extends number | number[] | Record<string, number>>(
    value: T,
    digits: number
): TRounded<T> => {
    if (typeof value === 'number') {
        return value.toFixed(digits) as TRounded<T>;
    }

    if (Array.isArray(value)) {
        return value.map((t) => t.toFixed(digits)) as TRounded<T>;
    }

    const result: Record<string, string> = {};

    for (const [key, val] of Object.entries(value)) {
        result[key] = val.toFixed(digits);
    }

    return result as TRounded<T>;
};
