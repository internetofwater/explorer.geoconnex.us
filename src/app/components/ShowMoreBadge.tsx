import { formatNumber } from '@/app/utils/formatNumber';

type TShowMoreProps = {
    count: number;
};

export const ShowMoreBadge: React.FC<TShowMoreProps> = (props) => {
    const { count } = props;

    return ` + ${formatNumber(count)} more`;
};
