import '@/app/components/common/Slider/Slider.css';
import { useState } from 'react';
import { v4 } from 'uuid';

type SliderLabel = {
    value: number;
    label: React.ReactNode;
};

type Props = {
    value: number;
    min: number;
    max: number;
    step?: number;
    orientation?: 'horizontal' | 'vertical';
    label?: string;
    labels?: SliderLabel[];
    onChange: (value: number) => void;
    wrapperClassname?: string;
    className?: string;
    invert?: boolean;
};

const Slider: React.FC<Props> = (props) => {
    const {
        value,
        min,
        max,
        step = 1,
        orientation = 'horizontal',
        label,
        labels = [],
        onChange,
        wrapperClassname = 'h-full',
        className = '',
        invert = false,
    } = props;

    const [id] = useState(`slider-${v4()}`);

    const isVertical = orientation === 'vertical';

    return (
        <div className={wrapperClassname}>
            {label && (
                <label
                    htmlFor={id}
                    className="block mb-0.5 text-md font-bold text-heading"
                >
                    {label}
                </label>
            )}
            <div
                className={[
                    'relative',
                    isVertical ? 'h-full' : 'w-full',
                    className,
                ].join(' ')}
            >
                <input
                    type="range"
                    data-custom
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={
                        isVertical
                            ? [
                                  'absolute  top-0',
                                  'h-full w-2',
                                  'appearance-none cursor-pointer rounded-full',
                                  'bg-secondary',
                                  '[writing-mode:vertical-lr]',
                                  invert
                                      ? '[direction:ltr]'
                                      : '[direction:rtl]', // min at bottom
                                  'shadow-md',
                              ].join(' ')
                            : [
                                  'h-2 w-full',
                                  'appearance-none cursor-pointer rounded-full',
                                  'bg-secondary',
                                  'shadow-md',
                              ].join(' ')
                    }
                />

                {labels.map(({ value: labelValue, label }) => {
                    const percent = ((labelValue - min) / (max - min)) * 100;

                    return (
                        <span
                            key={labelValue}
                            className={
                                isVertical
                                    ? 'absolute left-5 text-sm text-body w-fit'
                                    : 'absolute -bottom-6 text-sm text-body -translate-x-1/2 w-fit'
                            }
                            style={
                                isVertical
                                    ? {
                                          bottom:
                                              percent > 0
                                                  ? `calc(${percent} - 0.625rem)` // Minus half the line height
                                                  : `${percent}%`,
                                      }
                                    : { left: `${percent}%` }
                            }
                        >
                            {label}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default Slider;
