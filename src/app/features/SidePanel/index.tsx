import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import {
    getDatasets,
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
import { MainstemData } from '@/app/types';
import { ComplexSummary } from '@/app/features/SidePanel/Summary/Complex';
import { useMap } from '@/app/contexts/MapContexts';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';

const SidePanel: React.FC = () => {
    const [results, setResults] = useState<MainstemData[]>([]);

    const { map } = useMap(MAIN_MAP_ID);

    const { view, showResults } = useSelector((state: RootState) => state.main);

    const datasetsLength = useSelector(getDatasetsLength);
    const datasets = useSelector(getDatasets);

    const selectedSummary = useSelector((state: RootState) =>
        getSelectedSummary(state, map)
    );

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const ids = results.map((result) => result.id);
        dispatch(setSearchResultIds(ids));
    }, [results]);

    const handleHelpClick = () => {
        dispatch(setShowHelp(true));
    };

    return (
        <div className="w-full mt-1">
            <div className="mt-1 flex flex-col justify-between border-b border-gray-300 shadow-lg">
                <div className="flex justify-between" id="attribution">
                    {/* Mock-height to account for logo */}
                    <div className="ml-4 flex items-center h-16">
                        <Typography variant="h4" as="h1">
                            Geoconnex Explorer
                        </Typography>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div
                            id="side-panel-close"
                            className="mr-2 text-black block lg:hidden"
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
                <div className="flex w-[60%] mt-2">
                    <button
                        title="Map Tab"
                        aria-label="Tab to show map"
                        onClick={() => dispatch(setView('map'))}
                        className={`${
                            view === 'map'
                                ? 'bg-primary -mb-px border-b-transparent'
                                : 'bg-primary-darker text-gray-900'
                        } hover:bg-primary 
                        border-t border-x border-gray-300 
                        py-3 px-4 mx-2 
                        text-black hover:text-black font-bold 
                        rounded-t-lg
                        w-[50%] `}
                    >
                        Map
                    </button>
                    <button
                        title="Table Tab"
                        aria-label="Tab to show table"
                        onClick={() => dispatch(setView('table'))}
                        disabled={datasetsLength === 0}
                        className={`${
                            view === 'table'
                                ? 'bg-primary -mb-px border-b-transparent'
                                : 'bg-primary-darker text-gray-900'
                        } hover:enabled:bg-primary 
                        disabled:opacity-50
                        border-t border-x border-gray-300
                        py-3 px-4
                      text-black hover::enabled:text-black font-bold 
                        rounded-t-lg
                        w-[50%]`}
                    >
                        Table
                    </button>
                </div>
            </div>
            <div className="w-full py-3 px-2 bg-white flex flex-col justify-center border-b border-gray-300  text-black ">
                <Search setResults={setResults} />
            </div>

            <div id="scrollable-side-panel" className="overflow-y-auto">
                {/* Results makes async call, ensure mounting */}
                <div className={`${results.length > 0 ? 'block' : 'hidden'}`}>
                    <Collapsible title="Results" open={showResults}>
                        <Results results={results} />
                    </Collapsible>
                </div>
                {datasetsLength > 0 && (
                    <Collapsible title="Filters">
                        <div className="p-4">
                            <Filters />
                            <div className="mt-5 mb-2">
                                <CSVDownload datasets={datasets} />
                            </div>
                        </div>
                    </Collapsible>
                )}
                {selectedSummary && (
                    <Collapsible title={selectedSummary.name} open={true}>
                        <div className="p-4">
                            <ComplexSummary
                                summary={selectedSummary}
                                exclusions={{ name: true }}
                            />
                        </div>
                    </Collapsible>
                )}
            </div>
        </div>
    );
};

export default SidePanel;
