import { Typography } from '@/app/components/common/Typography';
import { colors, PieChart } from '@/app/features/SidePanel/Summary/PieChart';
import {
    ChangeEvent,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { SummaryData } from '@/lib/state/main/slice';
import { SummaryTable } from '@/app/features/SidePanel/Summary/Table';
import { Chart } from 'chart.js';

type TopOptions = {
    value: number;
    label: string;
}[];

const getOptions = (length: number): TopOptions => {
    if (length > 10) {
        return [
            {
                value: 5,
                label: 'Top 5',
            },
            {
                value: 10,
                label: 'Top 10',
            },
            {
                value: 20,
                label: 'Top 20',
            },
        ];
    } else if (length > 5) {
        return [
            {
                value: 5,
                label: 'Top 5',
            },
            {
                value: 10,
                label: 'Top 10',
            },
        ];
    }

    return [];
};

type Props = {
    title: string;
    total: number;
    data: SummaryData;
};

export const SummarySection: React.FC<Props> = (props) => {
    const { title, total, data } = props;

    const [top, setTop] = useState<number>(5);
    const [topOptions, setTopOptions] = useState<TopOptions>([]);

    const [showTable, setShowTable] = useState(true);
    const [showLegend, setShowLegend] = useState(false);

    const chartRef = useRef<Chart<'doughnut', number[], string>>(null);

    useLayoutEffect(() => {
        if (chartRef.current) {
            chartRef.current.resize();
        }
    }, [showLegend]);

    const length = useMemo(() => Object.keys(data).length, [data]);

    useEffect(() => {
        const topVariableOptions = getOptions(length);
        setTopOptions(topVariableOptions);
    }, [length]);

    const handleTopVariablesChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setTop(Number(event.target.value));
    };

    const handleTableMouseEnter = (index: number) => {
        const chart = chartRef.current;
        if (index <= top - 1 && chart) {
            const chartArea = chart.chartArea;
            const tooltip = chart.tooltip;
            if (tooltip) {
                tooltip.setActiveElements([{ datasetIndex: 0, index }], {
                    x: (chartArea.left + chartArea.right) / 2,
                    y: (chartArea.top + chartArea.bottom) / 2,
                });
            }
            chart.update('active');
        }
    };

    const handleTableMouseLeave = () => {
        const chart = chartRef.current;
        if (chart) {
            const tooltip = chart.tooltip;
            if (tooltip) {
                chart.update('active');
                tooltip.setActiveElements([], { x: 0, y: 0 });
            }
        }
    };

    return (
        <>
            <Typography variant="h6">{title}</Typography>
            <div className="flex flex-col justify-center items-center h-64 w-full mt-4 mx-2 mb-1">
                <div className="flex justify-center h-64 w-full">
                    <div className={`${showLegend ? 'w-1/2' : 'w-full'} h-64`}>
                        <PieChart
                            labels={Object.keys(data).slice(0, top)}
                            values={Object.values(data).slice(0, top)}
                            top={top}
                            ref={chartRef}
                        />
                    </div>
                    {showLegend && (
                        <div className="w-1/2 h-56 max-h-56 overflow-y-auto ml-2">
                            {Object.entries(data)
                                .slice(0, top)
                                .map(([key], index) => (
                                    <div
                                        className="flex"
                                        key={`${title}-legend-${key}`}
                                    >
                                        <div
                                            className={`min-w-8 h-4 border mr-1`}
                                            style={{
                                                borderColor: `rgba(${colors[
                                                    index
                                                ].join(', ')}, 1)`,
                                                backgroundColor: `rgba(${colors[
                                                    index
                                                ].join(', ')}, 0.2)`,
                                            }}
                                        ></div>
                                        <Typography variant="body-small">
                                            {key}
                                        </Typography>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                {topOptions.length > 0 && (
                    <select
                        aria-label="Top variables pie chart"
                        onChange={(e) => handleTopVariablesChange(e)}
                        className="static ml-auto -mt-6 z-[1]"
                    >
                        {topOptions.map(({ label, value }) => (
                            <option key={`top-variable-${value}`} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <button
                title={`${showLegend ? 'Hide' : 'Show'} ${title}`}
                onClick={() => setShowLegend(!showLegend)}
                className="mt-2 mr-2 px-1 border border-gray-500 rounded-lg"
            >
                <Typography variant="body-small">
                    <strong>{showLegend ? 'Hide' : 'Show'} legend</strong>
                </Typography>
            </button>
            <button
                title={`${showTable ? 'Hide' : 'Show'} ${title}`}
                onClick={() => setShowTable(!showTable)}
                className="mt-2 mb-2 px-1 border border-gray-500 rounded-lg"
            >
                <Typography variant="body-small">
                    <strong>{showTable ? 'Hide' : 'Show'} table</strong>
                </Typography>
            </button>
            {showTable && (
                <SummaryTable
                    total={total}
                    length={length}
                    title={title}
                    data={data}
                    handleMouseEnter={handleTableMouseEnter}
                    handleMouseLeave={handleTableMouseLeave}
                />
            )}
        </>
    );
};
