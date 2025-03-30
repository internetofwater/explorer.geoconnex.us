import MultiSelect from '@/app/components/common/MultiSelect';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useDispatch, useSelector } from 'react-redux';

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

    const handleTypeOptionClick = (type: string) => {
        const newSelectedVariables =
            filter?.variables && filter.variables.includes(type)
                ? filter.variables.filter((item) => item !== type)
                : [...(filter?.variables ?? []), type];

        dispatch(
            setFilter({
                variables: newSelectedVariables,
            })
        );
    };

    const handleSelectAll = (allSelected: boolean) => {
        if (allSelected) {
            dispatch(
                setFilter({
                    variables: variables,
                })
            );
        } else {
            const removeVariables = new Set(variables);
            let filteredVariables: string[] = [];
            if (filter.variables) {
                filteredVariables = filter.variables.filter(
                    (type) => !removeVariables.has(type)
                );
            }

            dispatch(
                setFilter({
                    variables: filteredVariables,
                })
            );
        }
    };

    return (
        <>
            <Typography variant="h6">Variable</Typography>
            <label id="variables-select-label" className="sr-only">
                Filter datasets by variable
            </label>
            <MultiSelect
                id="variables"
                ariaLabel="variables-select-label"
                options={variables}
                selectedOptions={filter.variables}
                handleOptionClick={handleTypeOptionClick}
                searchable
                selectAll
                strictSearch
                limit={100}
                handleSelectAll={handleSelectAll}
            />
        </>
    );
};
