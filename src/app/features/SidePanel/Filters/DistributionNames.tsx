import MultiSelect from '@/app/components/common/MultiSelect';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useDispatch, useSelector } from 'react-redux';

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

    const handleTypeOptionClick = (type: string) => {
        const newSelectedDistributionNames =
            filter?.distributionNames && filter.distributionNames.includes(type)
                ? filter.distributionNames.filter((item) => item !== type)
                : [...(filter?.distributionNames ?? []), type];
        dispatch(
            setFilter({
                distributionNames: newSelectedDistributionNames,
            })
        );
    };

    const handleSelectAll = (allSelected: boolean) => {
        if (allSelected) {
            const newDistributionNames = Array.from(
                new Set([
                    ...(filter.distributionNames ?? []),
                    ...distributionNames,
                ])
            );
            dispatch(
                setFilter({
                    distributionNames: newDistributionNames,
                })
            );
        } else {
            const removeDistributionNames = new Set(distributionNames);
            let filteredDistributionNames: string[] = [];
            if (filter.distributionNames) {
                filteredDistributionNames = filter.distributionNames.filter(
                    (type) => !removeDistributionNames.has(type)
                );
            }
            dispatch(
                setFilter({
                    distributionNames: filteredDistributionNames,
                })
            );
        }
    };

    return (
        <>
            <Typography variant="h6">Distribution Name</Typography>
            <label id="distribution-name-select-label" className="sr-only">
                Filter datasets by Distribution Name
            </label>
            <MultiSelect
                id="distribution-names"
                ariaLabel="distribution-name-select-label"
                options={distributionNames}
                selectedOptions={filter.distributionNames}
                handleOptionClick={handleTypeOptionClick}
                searchable
                selectAll
                limit={100}
                handleSelectAll={handleSelectAll}
            />
        </>
    );
};
