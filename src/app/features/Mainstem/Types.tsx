import ReactSelect, {
    DESELECT_ALL_VALUE,
    SELECT_ALL_VALUE,
} from '@/app/components/common/ReactSelect';
import { TOption } from '@/app/components/common/ReactSelect/types';
import { TMainstemMetrics } from '@/lib/state/mainstem/types';
import { useMemo } from 'react';
import { MultiValue, SingleValue } from 'react-select';

type Props = {
    types: string[];
    onTypesChange: (types: Props['types']) => void;
    metricTypes: TMainstemMetrics['types'];
};

export const Types: React.FC<Props> = (props) => {
    const { types, onTypesChange, metricTypes } = props;

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
                const allTypes = metricTypes.map(({ type }) => type);
                onTypesChange(allTypes);
                return;
            }

            if (values.includes(DESELECT_ALL_VALUE)) {
                onTypesChange([]);
                return;
            }

            onTypesChange(values);
        } else {
            const { value } = option as TOption<string>;
            if (value === SELECT_ALL_VALUE) {
                const allTypes = metricTypes.map(({ type }) => type);
                onTypesChange(allTypes);

                return;
            }

            if (value === DESELECT_ALL_VALUE) {
                onTypesChange([]);
                return;
            }

            const newVariables = types.includes(value)
                ? types.filter((item) => item !== value)
                : [...types, value];
            onTypesChange(newVariables);
        }
    };

    const options: TOption<string>[] = useMemo(() => {
        if (!metricTypes) {
            return [];
        }

        return metricTypes.map(({ type }) => ({
            value: type,
            label: type,
        }));
    }, [metricTypes]);

    const selectedOptions: TOption<string>[] = useMemo(
        () => options.filter(({ value }) => types.includes(value)),
        [options, types]
    );

    return (
        <ReactSelect
            id="mainstem-types-select"
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            limit={100}
            isSearchable
            isMulti
            isAllSelectable
        />
    );
};
