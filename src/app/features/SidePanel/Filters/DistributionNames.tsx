import ReactSelect, {
    DESELECT_ALL_VALUE,
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
    distributionNames: string[];
};

/**
 * Filter component with multiselect for selecting/deselecting distribution names
 *
 * Props:
 * - distributionNames: string[] - List of distribution names
 *
 * @component
 */
export const DistributionNames: React.FC<Props> = (props) => {
    const { distributionNames } = props;
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
                        distributionNames,
                    })
                );
                return;
            }

            if (values.includes(DESELECT_ALL_VALUE)) {
                dispatch(
                    setFilter({
                        distributionNames: [],
                    })
                );
                return;
            }

            dispatch(
                setFilter({
                    distributionNames: values,
                })
            );
        } else {
            const { value } = option as TOption<string>;

            if (value === SELECT_ALL_VALUE) {
                dispatch(
                    setFilter({
                        distributionNames,
                    })
                );
                return;
            }

            if (value === DESELECT_ALL_VALUE) {
                dispatch(
                    setFilter({
                        distributionNames: [],
                    })
                );
                return;
            }

            const newSelectedDistributionNames =
                filter?.distributionNames &&
                filter.distributionNames.includes(value)
                    ? filter.distributionNames.filter((item) => item !== value)
                    : [...(filter?.distributionNames ?? []), value];
            dispatch(
                setFilter({
                    distributionNames: newSelectedDistributionNames,
                })
            );
        }
    };

    const options: TOption<string>[] = useMemo(
        () => distributionNames.map((d) => ({ value: d, label: d })),
        [distributionNames]
    );

    const selectedOptions: TOption<string>[] = useMemo(
        () =>
            options.filter(({ value }) =>
                filter.distributionNames?.includes(value)
            ),
        [options, filter.distributionNames]
    );

    return (
        <>
            <Typography variant="h6">Distribution Name</Typography>
            <label id="distribution-name-select-label" className="sr-only">
                Filter datasets by Distribution Name
            </label>
            <ReactSelect
                id="distribution-names"
                aria-labelledby="distribution-name-select-label"
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                menuPlacement="top"
                isSearchable
                isMulti
                isAllSelectable
            />
        </>
    );
};
