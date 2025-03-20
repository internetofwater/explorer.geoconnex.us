import React, { JSX } from 'react';

type Props<T extends string | number> = {
    options: { value: T; label: string }[];
    ariaLabelPrefix: string;
    vertical?: boolean;
    handleChange: (value: T) => void;
};

const RadioGroup = <T extends string | number>(
    props: Props<T>
): JSX.Element => {
    const { options, ariaLabelPrefix, vertical = false, handleChange } = props;

    return (
        <div
            className={`flex ${
                vertical ? 'flex-col space-y-2' : 'flex-row space-x-2'
            } `}
        >
            {options.map((option, index) => (
                <label key={index} className="inline-flex items-center">
                    <input
                        type="radio"
                        name="option"
                        value={option.value}
                        aria-label={`${ariaLabelPrefix} ${option.label}`}
                        onChange={() => handleChange(option.value)}
                    />
                    <span className="ml-2">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default RadioGroup;
