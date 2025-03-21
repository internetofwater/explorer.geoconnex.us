import MultiSelect from '@/app/components/common/MultiSelect';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Variables: React.FC = () => {
    const { datasets, filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

    const [uniqueVariables, setUniqueVariables] = useState<string[]>([]);

    useEffect(() => {
        if (!datasets || !datasets?.features?.length) {
            return;
        }

        const newUniqueVariables = [...uniqueVariables];
        datasets.features.forEach((feature) => {
            if (feature.properties) {
                const variable =
                    feature.properties.variableMeasured.split(' / ')[0];
                if (!newUniqueVariables.includes(variable)) {
                    newUniqueVariables.push(variable);
                }
            }
        });

        newUniqueVariables.sort();

        if (
            JSON.stringify(uniqueVariables) !==
            JSON.stringify(newUniqueVariables)
        ) {
            dispatch(setFilter({ selectedVariables: newUniqueVariables }));
            setUniqueVariables(newUniqueVariables);
        }
    }, [datasets]);

    const handleTypeOptionClick = (type: string) => {
        const newSelectedVariables =
            filter?.selectedVariables && filter.selectedVariables.includes(type)
                ? filter.selectedVariables.filter((item) => item !== type)
                : [...(filter?.selectedVariables ?? []), type];

        dispatch(
            setFilter({
                selectedVariables: newSelectedVariables,
            })
        );
    };

    const handleSelectAll = (allSelected: boolean) => {
        if (allSelected) {
            dispatch(
                setFilter({
                    selectedVariables: uniqueVariables,
                })
            );
        } else {
            dispatch(
                setFilter({
                    selectedVariables: [],
                })
            );
        }
    };

    return (
        <>
            <Typography variant="h6">Variable</Typography>
            {uniqueVariables.length > 0 && (
                <>
                    <label id="variables-select-label" className="sr-only">
                        Filter datasets by variable
                    </label>
                    <MultiSelect
                        ariaLabel="variables-select-label"
                        options={uniqueVariables}
                        selectedOptions={filter.selectedVariables}
                        handleOptionClick={handleTypeOptionClick}
                        searchable
                        selectAll
                        limit={100}
                        handleSelectAll={handleSelectAll}
                    />
                </>
            )}
        </>
    );
};
