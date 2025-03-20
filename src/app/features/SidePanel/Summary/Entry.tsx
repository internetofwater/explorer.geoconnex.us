import { Typography } from '@/app/components/common/Typography';
import { SummaryData } from '@/lib/state/main/slice';

type Props = {
    top: number;
    total: number;
    title: string;
    length: number;
    data: SummaryData;
};

export const SummaryEntry: React.FC<Props> = (props) => {
    const { top, total, title, length, data } = props;

    return (
        <>
            {length > 0 && (
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        <strong>{title}:</strong>
                    </Typography>
                    <ul className="list-disc ml-4">
                        {Object.entries(data).map(([key, count], index) => {
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
                    {length > top && (
                        <Typography variant="body-small">
                            + {length - top} more
                        </Typography>
                    )}
                </li>
            )}
        </>
    );
};
