export const getMessage = (count: number) => {
    if (count === 0) {
        return 'No Datasets Found.';
    }

    return `${count} ${count === 1 ? 'Dataset' : 'Datasets'} Found.`;
};
