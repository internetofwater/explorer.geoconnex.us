import React from 'react';

type Props = {
    fill: string;
    stroke?: string;
    width?: number;
    height?: number;
};

const FilledSquare: React.FC<Props> = (props) => {
    const { fill = 'black', stroke, width = 30, height = 30 } = props;

    return (
        <svg width={width} height={height}>
            <rect
                width={width}
                height={height}
                fill={fill}
                stroke={stroke ?? fill}
                strokeWidth={2}
            />
        </svg>
    );
};

export default FilledSquare;
