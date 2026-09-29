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
    siteNames: string[];
};

/**
 * Filter component with multiselect for selecting/deselecting site names
 *
 * Props:
 * - siteNames: string[] - List of site names
 *
 * @component
 */
export const SiteNames: React.FC<Props> = (props) => {
    const { siteNames } = props;
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
                        siteNames,
                    })
                );
                return;
            }

            if (values.includes(DESELECT_ALL_VALUE)) {
                dispatch(
                    setFilter({
                        siteNames: [],
                    })
                );
                return;
            }

            dispatch(
                setFilter({
                    siteNames: values,
                })
            );
        } else {
            const { value } = option as TOption<string>;
            if (value === SELECT_ALL_VALUE) {
                dispatch(
                    setFilter({
                        siteNames,
                    })
                );
                return;
            }

            if (value === DESELECT_ALL_VALUE) {
                dispatch(
                    setFilter({
                        siteNames: [],
                    })
                );
                return;
            }

            const newSelectedSiteNames =
                filter?.siteNames && filter.siteNames.includes(value)
                    ? filter.siteNames.filter((item) => item !== value)
                    : [...(filter?.siteNames ?? []), value];
            dispatch(
                setFilter({
                    siteNames: newSelectedSiteNames,
                })
            );
        }
    };

    const options: TOption<string>[] = useMemo(
        () => siteNames.map((d) => ({ value: d, label: d })),
        [siteNames]
    );

    const selectedOptions: TOption<string>[] = useMemo(
        () => options.filter(({ value }) => filter.siteNames?.includes(value)),
        [options, filter.siteNames]
    );

    return (
        <>
            <Typography variant="h6">Site Name</Typography>
            <label id="site-name-select-label" className="sr-only">
                Filter datasets by Site Name
            </label>
            <ReactSelect
                id="site-names"
                aria-labelledby="site-name-select-label"
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
