export const formatNumber = (value: number) =>
    value.toLocaleString('en-US', {
        maximumFractionDigits: 100, // Max
    });
