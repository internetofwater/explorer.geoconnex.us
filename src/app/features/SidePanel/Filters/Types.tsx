import MultiSelect from '@/app/components/common/MultiSelect';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    types: string[];
};

export const Types: React.FC<Props> = (props) => {
    const { types } = props;
    const { filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

    const handleTypeOptionClick = (type: string) => {
        const newSelectedTypes =
            filter?.types && filter.types.includes(type)
                ? filter.types.filter((item) => item !== type)
                : [...(filter?.types ?? []), type];
        dispatch(
            setFilter({
                types: newSelectedTypes,
            })
        );
    };

    const handleSelectAll = (allSelected: boolean) => {
        if (allSelected) {
            const newTypes = Array.from(
                new Set([...(filter.types ?? []), ...types])
            );
            dispatch(
                setFilter({
                    types: newTypes,
                })
            );
        } else {
            const removeTypes = new Set(types);
            let filteredTypes: string[] = [];
            if (filter.types) {
                filteredTypes = filter.types.filter(
                    (type) => !removeTypes.has(type)
                );
            }
            dispatch(
                setFilter({
                    types: filteredTypes,
                })
            );
        }
    };

    return (
        <>
            <Typography variant="h6">Site Type</Typography>
            <label id="type-select-label" className="sr-only">
                Filter datasets by site type
            </label>
            <MultiSelect
                id="types"
                options={types}
                selectedOptions={filter.types}
                handleOptionClick={handleTypeOptionClick}
                searchable
                selectAll
                limit={100}
                handleSelectAll={handleSelectAll}
            />
        </>
    );
};
