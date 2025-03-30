import MultiSelect from '@/app/components/common/MultiSelect';
import { Typography } from '@/app/components/common/Typography';
import { setFilter } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useDispatch, useSelector } from 'react-redux';

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

    const handleTypeOptionClick = (type: string) => {
        const newSelectedSiteNames =
            filter?.siteNames && filter.siteNames.includes(type)
                ? filter.siteNames.filter((item) => item !== type)
                : [...(filter?.siteNames ?? []), type];
        dispatch(
            setFilter({
                siteNames: newSelectedSiteNames,
            })
        );
    };

    const handleSelectAll = (allSelected: boolean) => {
        if (allSelected) {
            const newSiteNames = Array.from(
                new Set([...(filter.siteNames ?? []), ...siteNames])
            );
            dispatch(
                setFilter({
                    siteNames: newSiteNames,
                })
            );
        } else {
            const removeSiteNames = new Set(siteNames);
            let filteredSiteNames: string[] = [];
            if (filter.siteNames) {
                filteredSiteNames = filter.siteNames.filter(
                    (type) => !removeSiteNames.has(type)
                );
            }
            dispatch(
                setFilter({
                    siteNames: filteredSiteNames,
                })
            );
        }
    };

    return (
        <>
            <Typography variant="h6">Site Name</Typography>
            <label id="site-name-select-label" className="sr-only">
                Filter datasets by Site Name
            </label>
            <MultiSelect
                id="site-names"
                ariaLabel="site-name-select-label"
                options={siteNames}
                selectedOptions={filter.siteNames}
                handleOptionClick={handleTypeOptionClick}
                searchable
                selectAll
                limit={100}
                handleSelectAll={handleSelectAll}
            />
        </>
    );
};
