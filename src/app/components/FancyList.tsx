import { Fragment } from 'react';
import { ShowMoreBadge } from '@/app/components/ShowMoreBadge';

type Props = {
    items: string[];
    max?: number;
    type?: Intl.ListFormatType;
};

export const FancyList: React.FC<Props> = (props) => {
    const { items, max, type = 'disjunction' } = props;

    const listFormatOptions = new Intl.ListFormat('en', {
        style: 'long',
        type,
    });

    return (
        <>
            {listFormatOptions
                .formatToParts(items.slice(0, max))
                .map(({ type, value }, index) => (
                    <Fragment key={`list-part-${index}`}>
                        {type === 'literal' ? <strong>{value}</strong> : value}
                    </Fragment>
                ))}
            {max !== undefined && items.length > max && (
                <strong>
                    <ShowMoreBadge count={items.length - max} />
                </strong>
            )}
        </>
    );
};
