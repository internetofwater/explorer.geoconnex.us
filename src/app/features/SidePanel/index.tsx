import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import {
    getDatasetsLength,
    getSelectedSummary,
    InitialState,
    setSearchResultIds,
    setShowHelp,
    setShowSidePanel,
    setView,
} from '@/lib/state/main/slice';
import Search from '@/app/features/SidePanel/Search';
import { Filters } from '@/app/features/SidePanel/Filters';
import { CSVDownload } from '@/app/features/SidePanel/CSVDownload';
import Collapsible from '@/app/components/common/Collapsible';
import { Typography } from '@/app/components/common/Typography';
import { useEffect, useMemo, useState } from 'react';
import { Results } from '@/app/features/SidePanel/Results';
import { Dataset, MainstemData } from '@/app/types';
import { ComplexSummary } from '@/app/features/SidePanel/Summary/Complex';
import { useMap } from '@/app/contexts/MapContexts';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import { FeatureCollection, Point } from 'geojson';
import { useAppSelector } from '@/lib/state/hooks';
import { Header } from '@/app/features/SidePanel/Header';
import { Intro } from '../Help/Intro';

const hasSelectedAMainstem = (
    selected: MainstemData | null
): selected is MainstemData => Boolean(selected);

type Props = {
    datasets: FeatureCollection<Point, Dataset>;
};

/**
 * This component manages the state and display of search results, filter component, and selected
 * mainstem summaries.
 *
 *  @component
 */
const SidePanel: React.FC<Props> = (props) => {
    const { datasets } = props;

    const [searchResults, setSearchResults] = useState<MainstemData[]>([]);

    const { map } = useMap(MAIN_MAP_ID);

    const showResults = useAppSelector((state) => state.main.showResults);

    const selected = useAppSelector((state) => state.mainstem.selected);

    // Total length of unfiltered features from datasets feature collection
    const datasetsLength = useSelector(getDatasetsLength);

    // Summary information for filtered datasets within map bounds
    const selectedSummary = useSelector((state: RootState) =>
        getSelectedSummary(state, map)
    );

    const dispatch: AppDispatch = useDispatch();

    const searchResultIds = useMemo(
        () => searchResults.map(({ id }) => id),
        [searchResults]
    );

    useEffect(() => {
        // Pass ids to redux state to enable
        dispatch(setSearchResultIds(searchResultIds));
    }, [searchResultIds]);

    const handleHelpClick = () => {
        dispatch(setShowHelp(true));
    };

    const handleViewChange = (view: InitialState['view']) => {
        dispatch(setView(view));
    };

    const handleHideSidePanel = () => {
        dispatch(setShowSidePanel(false));
    };

    const handleSearchResultsChange = (results: typeof searchResults) => {
        setSearchResults(results);
    };

    const isResultsVisible = searchResults.length > 0;
    const isSummaryVisible = hasSelectedAMainstem(selected);
    const isTableEnabled = datasetsLength > 0;
    const isFiltersVisible = isSummaryVisible && isTableEnabled;
    const isIntroVisible =
        !isResultsVisible && !isSummaryVisible && !isFiltersVisible;

    return (
        <div className="w-full">
            <div className="relative bg-primary-opaque z-[--z-side-panel]">
                <Header
                    onHelpClick={handleHelpClick}
                    onViewChange={handleViewChange}
                    onHideSidePanel={handleHideSidePanel}
                    isTableEnabled={isTableEnabled}
                />
                <div
                    className={`
                w-full 
                py-3 px-2 
                flex flex-col justify-center 
                bg-primary-opaque
                text-black  
                border-b border-gray-300`}
                >
                    <Search onSearchResultsChange={handleSearchResultsChange} />
                </div>
            </div>
            <div id="scrollable-side-panel" className="overflow-y-auto">
                {isIntroVisible && <Intro />}
                {/* Results makes async call, ensure mounting */}
                <div className={`${isResultsVisible ? 'block' : 'hidden'}`}>
                    <Collapsible title="Results" open={showResults}>
                        <div className="py-2 border-b border-gray-300">
                            {searchResults.length && (
                                <Typography
                                    variant="body-small"
                                    className="text-center"
                                >
                                    Results sorted by{' '}
                                    <strong>Outlet Drainage Area</strong>.
                                    {searchResults.length === 500 && (
                                        <>
                                            <br />
                                            Showing top <strong>
                                                500
                                            </strong>{' '}
                                            results.
                                        </>
                                    )}
                                </Typography>
                            )}
                        </div>
                        <Results results={searchResults} />
                    </Collapsible>
                </div>
                {isFiltersVisible && (
                    <Collapsible title="Filters" className="border-b">
                        <div className="p-4">
                            <Filters />
                            <div className="mt-5 mb-2">
                                <CSVDownload
                                    datasets={datasets}
                                    selectedMainstem={selected}
                                />
                            </div>
                        </div>
                    </Collapsible>
                )}
                {isSummaryVisible && (
                    <Collapsible
                        title={selected.name_at_outlet || 'URI: ' + selected.id}
                        open={true}
                    >
                        {selectedSummary && (
                            <div className="p-4">
                                <ComplexSummary summary={selectedSummary} />
                            </div>
                        )}
                    </Collapsible>
                )}
            </div>
        </div>
    );
};

export default SidePanel;
