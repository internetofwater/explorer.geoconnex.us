import MultiSelect from '@/app/components/common/MultiSelect';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Types: React.FC = () => {
    const { datasets, filter } = useSelector((state: RootState) => state.main);
    const dispatch: AppDispatch = useDispatch();

    const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

    useEffect(() => {
        if (!datasets || !datasets?.features?.length) {
            return;
        }

        const newUniqueTypes = [...uniqueTypes];
        datasets.features.forEach((feature) => {
            if (feature.properties) {
                if (!newUniqueTypes.includes(feature.properties.type)) {
                    newUniqueTypes.push(feature.properties.type);
                }
            }
        });

        if (JSON.stringify(uniqueTypes) !== JSON.stringify(newUniqueTypes)) {
            dispatch(setFilter({ selectedTypes: newUniqueTypes }));

            setUniqueTypes(newUniqueTypes);
        }
    }, [datasets]);

    const handleTypeOptionClick = (type: string) => {
        const newSelectedTypes =
            filter?.selectedTypes && filter.selectedTypes.includes(type)
                ? filter.selectedTypes.filter((item) => item !== type)
                : [...(filter?.selectedTypes ?? []), type];
        dispatch(
            setFilter({
                selectedTypes: newSelectedTypes,
            })
        );
    };

    const handleSelectAll = (allSelected: boolean) => {
        if (allSelected) {
            dispatch(
                setFilter({
                    selectedTypes: uniqueTypes,
                })
            );
        } else {
            dispatch(
                setFilter({
                    selectedTypes: [],
                })
            );
        }
    };

    return (
        <>
            <Typography variant="h6">Type</Typography>
            {uniqueTypes.length > 0 && (
                <>
                    <label id="type-select-label" className="sr-only">
                        Filter datasets by type
                    </label>
                    <MultiSelect
                        options={uniqueTypes}
                        selectedOptions={filter.selectedTypes}
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
