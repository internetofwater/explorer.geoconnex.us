type TShowMoreProps = {
    count: number;
};

export const ShowMoreBadge: React.FC<TShowMoreProps> = (props) => {
    const { count } = props;

    return ` + ${count} more`;
};
