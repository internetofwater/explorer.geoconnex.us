export const getMessage = (count: number) => {
    if (count === 0) {
        return 'No datasets found for current selection.';
    }

    return `Located ${count} ${count === 1 ? 'dataset' : 'datasets'} based on current selection.`;
};
