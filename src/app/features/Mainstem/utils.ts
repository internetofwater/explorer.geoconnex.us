import { formatNumber } from '@/app/utils/formatNumber';

export const getMessage = (count: number) => {
    if (count === 0) {
        return 'No Datasets Found.';
    }

    return `${formatNumber(count)} ${count === 1 ? 'Dataset' : 'Datasets'} Found.`;
};
