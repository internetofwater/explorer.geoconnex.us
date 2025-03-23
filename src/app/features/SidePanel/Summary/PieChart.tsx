import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    labels: string[];
    values: number[];
    top: number;
};

const colors = [
    [0, 123, 255], // Blue
    [40, 167, 69], // Green
    [255, 193, 7], // Yellow
    [220, 53, 69], // Red
    [23, 162, 184], // Cyan
    [108, 117, 125], // Gray
    [255, 99, 132], // Light Red
    [54, 162, 235], // Light Blue
    [255, 206, 86], // Light Yellow
    [75, 192, 192], // Light Cyan
    [153, 102, 255], // Light Purple
    [255, 159, 64], // Light Orange
    [102, 51, 153], // Dark Purple
    [255, 69, 0], // Dark Orange
    [0, 255, 127], // Spring Green
    [255, 20, 147], // Deep Pink
    [0, 255, 255], // Aqua
    [255, 140, 0], // Dark Orange
    [75, 0, 130], // Indigo
    [139, 69, 19], // Saddle Brown
];

export const PieChart: React.FC<Props> = (props) => {
    const { labels, values, top } = props;
    const data: ChartData<'doughnut', number[], string> = {
        labels,
        datasets: [
            {
                label: 'Count',
                data: values,
                backgroundColor: colors
                    .slice(0, top)
                    .map((color) => `rgba(${color.join(', ')}, 0.2)`),
                borderColor: colors
                    .slice(0, top)
                    .map((color) => `rgba(${color.join(', ')}, 1)`),
                borderWidth: 1,
            },
        ],
    };

    return (
        <Doughnut
            data={data}
            options={{ plugins: { legend: { display: false } } }}
        />
    );
};
