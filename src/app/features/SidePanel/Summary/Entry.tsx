import { Typography } from '@/app/components/common/Typography';
import { useMemo, useState } from 'react';

interface Props {
    total: number;
    title: string;
    length: number;
    data: Record<string, number>;
}

export const SummaryEntry: React.FC<Props> = (props) => {
    const { total, title, length, data } = props;
    const [visibleCount, setVisibleCount] = useState(5);

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 5);
    };

    const limitedData = useMemo(
        () => Object.fromEntries(Object.entries(data).slice(0, visibleCount)),
        [data, visibleCount]
    );

    return (
        <>
            {length > 0 && (
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        <strong>{title}:</strong>
                    </Typography>
                    <ul className="list-disc ml-4">
                        {Object.entries(limitedData)
                            .slice(0, visibleCount)
                            .map(([key, count], index) => {
                                let percentage: string | number = Math.round(
                                    (count / total) * 100
                                );
                                if (percentage < 1) {
                                    percentage = '<1';
                                }
                                return (
                                    <li key={index}>
                                        <Typography variant="body-small">
                                            {key}: {count} ({percentage}%)
                                        </Typography>
                                    </li>
                                );
                            })}
                    </ul>
                    {length > visibleCount && (
                        <button onClick={handleShowMore}>
                            <Typography variant="body-small">
                                + {Math.min(5, length - visibleCount)} more
                            </Typography>
                        </button>
                    )}
                </li>
            )}
        </>
    );
};
