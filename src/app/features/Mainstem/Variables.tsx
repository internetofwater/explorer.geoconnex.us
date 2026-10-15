import ReactSelect, {
    DESELECT_ALL_VALUE,
    SELECT_ALL_VALUE,
} from '@/app/components/common/ReactSelect';
import { TOption } from '@/app/components/common/ReactSelect/types';
import { Typography } from '@/app/components/common/Typography';
import { TMainstemMetrics } from '@/lib/state/mainstem/types';
import { useMemo } from 'react';
import { MultiValue, SingleValue } from 'react-select';

type Props = {
    variables: string[];
    onVariablesChange: (variables: Props['variables']) => void;
    metricVariables: TMainstemMetrics['variables'];
    disabled?: boolean;
};

export const Variables: React.FC<Props> = (props) => {
    const {
        variables,
        onVariablesChange,
        metricVariables,
        disabled = false,
    } = props;

    const handleChange = (
        option: SingleValue<TOption<string>> | MultiValue<TOption<string>>
    ) => {
        if (!option) {
            return;
        }

        if (Array.isArray(option)) {
            const values = (option as TOption<string>[]).map(
                ({ value }) => value
            );

            if (values.includes(SELECT_ALL_VALUE)) {
                const allVariables = metricVariables.map(
                    ({ variableMeasured }) => variableMeasured
                );
                onVariablesChange(allVariables);
                return;
            }

            if (values.includes(DESELECT_ALL_VALUE)) {
                onVariablesChange([]);
                return;
            }

            onVariablesChange(values);
        } else {
            const { value } = option as TOption<string>;
            if (value === SELECT_ALL_VALUE) {
                const allVariables = metricVariables.map(
                    ({ variableMeasured }) => variableMeasured
                );
                onVariablesChange(allVariables);

                return;
            }

            if (value === DESELECT_ALL_VALUE) {
                onVariablesChange([]);
                return;
            }

            const newVariables = variables.includes(value)
                ? variables.filter((item) => item !== value)
                : [...variables, value];
            onVariablesChange(newVariables);
        }
    };

    const options: TOption<string>[] = useMemo(() => {
        if (!metricVariables) {
            return [];
        }

        return metricVariables.map(({ variableMeasured }) => ({
            value: variableMeasured,
            label: variableMeasured,
        }));
    }, [metricVariables]);

    const selectedOptions: TOption<string>[] = useMemo(
        () => options.filter(({ value }) => variables.includes(value)),
        [options, variables]
    );

    return (
        <div>
            <label htmlFor="mainstem-variables-select">
                <Typography variant="body" as="span">
                    Variables Measured
                </Typography>
            </label>
            <ReactSelect
                id="mainstem-variables-select"
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                customClassnames={{ control: '!min-h-[8.125rem]' }}
                limit={100}
                isSearchable
                isMulti
                isAllSelectable
                isDisabled={disabled}
            />
        </div>
    );
};
