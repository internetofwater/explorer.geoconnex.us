import ReactSelect, {
    SELECT_ALL_VALUE,
} from '@/app/components/common/ReactSelect';
import { TOption } from '@/app/components/common/ReactSelect/types';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiValue, SingleValue } from 'react-select';

type Props = {
    variables: string[];
};

/**
 * Filter component with multiselect for selecting/deselecting variables measured
 *
 * Props:
 * - variables: string[] - List of variables measured
 *
 * @component
 */
export const Variables: React.FC<Props> = (props) => {
    const { variables } = props;

    const { filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

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
                dispatch(
                    setFilter({
                        variables,
                    })
                );
                return;
            }

            dispatch(
                setFilter({
                    variables: values,
                })
            );
        } else {
            const { value } = option as TOption<string>;
            if (value === SELECT_ALL_VALUE) {
                dispatch(
                    setFilter({
                        variables,
                    })
                );
                return;
            }

            const newSelectedVariables =
                filter?.variables && filter.variables.includes(value)
                    ? filter.variables.filter((item) => item !== value)
                    : [...(filter?.variables ?? []), value];
            dispatch(
                setFilter({
                    variables: newSelectedVariables,
                })
            );
        }
    };

    const options: TOption<string>[] = useMemo(
        () => variables.map((d) => ({ value: d, label: d })),
        [variables]
    );

    const selectedOptions: TOption<string>[] = useMemo(
        () => options.filter(({ value }) => filter.variables?.includes(value)),
        [options, filter.variables]
    );

    return (
        <>
            <Typography variant="h6">Variable</Typography>
            <label id="variables-select-label" className="sr-only">
                Filter datasets by variable
            </label>
            <ReactSelect
                id="variables"
                aria-labelledby="variables-select-label"
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                limit={100}
                isSearchable
                isMulti
                isAllSelectable
            />
        </>
    );
};
