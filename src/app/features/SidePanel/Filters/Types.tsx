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
    types: string[];
};

/**
 * Filter component with multiselect for selecting/deselecting site types
 *
 * Props:
 * - types: string[] - List of site types
 *
 * @component
 */
export const Types: React.FC<Props> = (props) => {
    const { types } = props;
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
                        types,
                    })
                );
                return;
            }

            dispatch(
                setFilter({
                    types: values,
                })
            );
        } else {
            const { value } = option as TOption<string>;
            if (value === SELECT_ALL_VALUE) {
                dispatch(
                    setFilter({
                        types,
                    })
                );
                return;
            }

            const newSelectedTypes =
                filter?.types && filter.types.includes(value)
                    ? filter.types.filter((item) => item !== value)
                    : [...(filter?.types ?? []), value];
            dispatch(
                setFilter({
                    types: newSelectedTypes,
                })
            );
        }
    };

    const options: TOption<string>[] = useMemo(
        () => types.map((d) => ({ value: d, label: d })),
        [types]
    );

    const selectedOptions: TOption<string>[] = useMemo(
        () => options.filter(({ value }) => filter.types?.includes(value)),
        [options, filter.types]
    );

    return (
        <>
            <Typography variant="h6">Site Type</Typography>
            <label id="type-select-label" className="sr-only">
                Filter datasets by site type
            </label>

            <ReactSelect
                id="types"
                aria-labelledby="type-select-label"
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
