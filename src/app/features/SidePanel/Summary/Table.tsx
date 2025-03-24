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
                <div className="max-w-full w-full">
                    <table className="divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-1 text-left font-normal">
                                    <Typography
                                        variant="body"
                                        className="max-w-[45%]"
                                    >
                                        <strong>{title}</strong>
                                    </Typography>
                                </th>
                                <th
                                    className="px-4 py-1 text-center font-normal"
                                    style={{ width: '27.5%' }}
                                >
                                    <Typography
                                        variant="body"
                                        className="max-w-[27.5%]"
                                    >
                                        <strong>Count</strong>
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
                </div>
            )}
        </>
    );
};
