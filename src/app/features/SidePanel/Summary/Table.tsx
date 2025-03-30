import { Typography } from '@/app/components/common/Typography';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    total: number;
    title: string;
    length: number;
    data: Record<string, number>;
    handleMouseEnter: (index: number) => void;
    handleMouseLeave: () => void;
}

/**
 * This component displays a summary table with a title, count, and percentage for each data entry.
 * It includes functionality to show more or less data entries based on user interaction.
 *
 * Props:
 * - total: number - The total count used to calculate percentages.
 * - title: string - The title of the table.
 * - length: number - The length of the data entries.
 * - data: Record<string, number> - The data entries to be displayed in the table.
 * - handleMouseEnter: (index: number) => void - Function to handle mouse enter events on table rows.
 * - handleMouseLeave: () => void - Function to handle mouse leave events on table rows.
 *
 * @component
 */
export const SummaryTable: React.FC<Props> = (props) => {
    const { total, title, length, data, handleMouseEnter, handleMouseLeave } =
        props;
    const [visibleCount, setVisibleCount] = useState(5);

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 5);
    };

    const handleShowLess = () => {
        setVisibleCount((prevCount) => Math.max(prevCount - 5, 5));
    };

    const limitedData = useMemo(
        () => Object.fromEntries(Object.entries(data).slice(0, visibleCount)),
        [data, visibleCount]
    );

    useEffect(() => {
        if (length < visibleCount) {
            // set visible count to the lowest multiple of 5 that contains length
            const visibleCount = Math.max(Math.ceil(length / 5) * 5, 5);
            setVisibleCount(visibleCount);
        }
    }, [length]);

    const showMore = length > visibleCount;
    const showLess = visibleCount > 5;

    return (
        <>
            {length > 0 && (
                <>
                    <div className="max-w-full w-full overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-1 font-normal">
                                        <Typography
                                            variant="body"
                                            className="text-center"
                                        >
                                            <strong>{title}</strong>
                                        </Typography>
                                    </th>
                                    <th
                                        className="px-4 py-1 font-normal"
                                        style={{ width: '27.5%' }}
                                    >
                                        <Typography
                                            variant="body"
                                            className="text-center"
                                        >
                                            <strong>Site Count</strong>
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(limitedData).map(
                                    ([key, count], index) => {
                                        let percentage: string | number =
                                            Math.round((count / total) * 100);
                                        if (percentage < 1) {
                                            percentage = '<1';
                                        }
                                        return (
                                            <tr
                                                key={index}
                                                onMouseEnter={() =>
                                                    handleMouseEnter(index)
                                                }
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <td
                                                    className="px-6 py-2 "
                                                    title={key}
                                                >
                                                    <Typography
                                                        variant="body-small"
                                                        className="overflow-hidden overflow-ellipsis"
                                                    >
                                                        {key}
                                                    </Typography>
                                                </td>
                                                <td className="px-6 py-2 text-center">
                                                    <Typography variant="body-small">
                                                        {count}
                                                    </Typography>
                                                </td>
                                                <td className="px-6 py-2">
                                                    <Typography variant="body-small">
                                                        {percentage}%
                                                    </Typography>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                    {showMore && (
                        <button
                            title={`Show more ${title}`}
                            onClick={handleShowMore}
                            className="mt-2 px-1 border border-gray-500 rounded-lg"
                        >
                            <Typography variant="body-small">
                                <strong>Show more</strong>
                            </Typography>
                        </button>
                    )}
                    {showMore && showLess && <> / </>}
                    {showLess && (
                        <button
                            title={`Show less ${title}`}
                            onClick={handleShowLess}
                            className="mt-2 px-1 border border-gray-500 rounded-lg"
                        >
                            <Typography variant="body-small">
                                <strong>Show less</strong>
                            </Typography>
                        </button>
                    )}
                </>
            )}
        </>
    );
};
