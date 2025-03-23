import React, { JSX } from 'react';

type Props<T extends string | number> = {
    value: T;
    options: { value: T; label: string }[];
    ariaLabelPrefix: string;
    keyPrefix: string;
    vertical?: boolean;
    handleChange: (value: T) => void;
};

const RadioGroup = <T extends string | number>(
    props: Props<T>
): JSX.Element => {
    const {
        value,
        options,
        ariaLabelPrefix,
        keyPrefix,
        vertical = false,
        handleChange,
    } = props;

    console.log('value?', keyPrefix, value, options);

    return (
        <div
            className={`flex ${
                vertical ? 'flex-col space-y-2' : 'flex-row space-x-2'
            } `}
        >
            {options.map((option, index) => (
                <label
                    key={`${keyPrefix}-${index}`}
                    className="inline-flex items-center"
                >
                    <input
                        type="radio"
                        value={option.value}
                        checked={value === option.value}
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
