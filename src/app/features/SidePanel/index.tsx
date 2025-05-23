import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import {
    getDatasetsLength,
    getSelectedSummary,
    setSearchResultIds,
    setShowHelp,
    setShowSidePanel,
    setView,
} from '@/lib/state/main/slice';
import Search from '@/app/features/SidePanel/Search';
import { Filters } from '@/app/features/SidePanel/Filters';
import { CSVDownload } from '@/app/features/SidePanel/CSVDownload';
import Collapsible from '@/app/components/common/Collapsible';
import CloseButton from '@/app/components/common/CloseButton';
import HelpIcon from '@/app/assets/icons/Help';
import { Typography } from '@/app/components/common/Typography';
import { useEffect, useState } from 'react';
import { Results } from '@/app/features/SidePanel/Results';
import { Dataset, MainstemData } from '@/app/types';
import { ComplexSummary } from '@/app/features/SidePanel/Summary/Complex';
import { useMap } from '@/app/contexts/MapContexts';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import Button from '@/app/components/common/Button';
import Image from 'next/image';
import { FeatureCollection, Point } from 'geojson';

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

    const [results, setResults] = useState<MainstemData[]>([]);

    const { map } = useMap(MAIN_MAP_ID);

    const { showResults, selectedMainstem } = useSelector(
        (state: RootState) => state.main
    );

    // Total length of unfiltered features from datasets feature collection
    const datasetsLength = useSelector(getDatasetsLength);

    // Summary information for filtered datasets within map bounds
    const selectedSummary = useSelector((state: RootState) =>
        getSelectedSummary(state, map)
    );

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const ids = results.map((result) => result.id);
        // Pass ids to redux state to enable
        dispatch(setSearchResultIds(ids));
    }, [results]);

    const handleHelpClick = () => {
        dispatch(setShowHelp(true));
    };

    return (
        <div className="w-full">
            <div className="pt-2 flex flex-col justify-between bg-primary">
                <div className="flex justify-between" id="attribution">
                    <div className="ml-4 flex items-center gap-x-4 h-16">
                        <a
                            href="https://internetofwater.org/"
                            aria-label="Link to Internet of Water site"
                            target="_blank"
                        >
                            <Image
                                src={'/IoWCoalitionLogoMark.png'}
                                alt="Internet of Water Logo"
                                width={35}
                                height={50}
                            />
                        </a>
                        <Typography variant="h3" as="h1">
                            Geoconnex Explorer
                        </Typography>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div
                            id="side-panel-close"
                            className="block lg:hidden mr-2 text-black"
                        >
                            <CloseButton
                                onClick={() =>
                                    dispatch(setShowSidePanel(false))
                                }
                                className="text-gray-900 hover:text-gray-700 text-md"
                                closeIconClassName="w-8 h-8"
                            />
                        </div>
                        <button
                            title="Show Help Modal"
                            onClick={handleHelpClick}
                            className="w-8 mr-2 text-gray-900 hover:text-gray-700 text-lg"
                        >
                            <HelpIcon />
                        </button>
                    </div>
                </div>
                <div className="flex mt-2 mb-1 ml-2 gap-x-2">
                    <Button
                        title="Switch to Map View"
                        onClick={() => dispatch(setView('map'))}
                        className="min-w-24 min-h-10"
                    >
                        Map
                    </Button>
                    <Button
                        title="Switch to Table View"
                        onClick={() => dispatch(setView('table'))}
                        className="min-w-24 min-h-10"
                        disabled={datasetsLength === 0}
                    >
                        Table
                    </Button>
                    <Button
                        title="Switch to About View"
                        onClick={() => dispatch(setView('about'))}
                        className="min-w-24 min-h-10"
                    >
                        About
                    </Button>
                </div>
            </div>
            <div
                className={`
                w-full 
                py-3 px-2 
                flex flex-col justify-center 
                bg-primary-opaque
                text-black  
                border-b border-gray-300`}
            >
                <Search setResults={setResults} />
            </div>

            <div id="scrollable-side-panel" className="overflow-y-auto">
                {/* Results makes async call, ensure mounting */}
                <div className={`${results.length > 0 ? 'block' : 'hidden'}`}>
                    <Collapsible title="Results" open={showResults}>
                        <div className="py-2 border-b border-gray-300">
                            {results.length && (
                                <Typography
                                    variant="body-small"
                                    className="text-center"
                                >
                                    Results sorted by{' '}
                                    <strong>Outlet Drainage Area</strong>.
                                    {results.length === 500 && (
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
                        <Results results={results} />
                    </Collapsible>
                </div>
                {selectedMainstem && datasetsLength > 0 && (
                    <Collapsible title="Filters">
                        <div className="p-4">
                            <Filters />
                            <div className="mt-5 mb-2">
                                <CSVDownload
                                    datasets={datasets}
                                    selectedMainstem={selectedMainstem}
                                />
                            </div>
                        </div>
                    </Collapsible>
                )}
                {selectedMainstem && (
                    <Collapsible
                        title={
                            selectedMainstem.name_at_outlet ||
                            'URI: ' + selectedMainstem.id
                        }
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
