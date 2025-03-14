import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { setShowHelp, setShowSidePanel, setView } from '@/lib/state/main/slice';
import Search from '@/app/features/SidePanel/Search';
import { Filters } from '@/app/features/SidePanel/Filters';
import { CSVDownload } from '@/app/features/SidePanel/CSVDownload';
import Collapsible from '@/app/components/common/Collapsible';
import CloseButton from '@/app/components/common/CloseButton';
import { Summary } from '@/app/features/SidePanel//Summary';
import HelpIcon from '@/app/assets/icons/Help';
import { Typography } from '@/app/components/common/Typography';

export const SidePanel: React.FC = () => {
    const { datasets, view, selectedSummary } = useSelector(
        (state: RootState) => state.main
    );

    const dispatch: AppDispatch = useDispatch();

    const handleHelpClick = () => {
        dispatch(setShowHelp(true));
    };

    return (
        <div className="w-full mt-1">
            <div className="mt-1 flex flex-col justify-between border-b border-gray-300 shadow-lg">
                <div className="flex justify-between" id="attribution">
                    {/* Mock-height to account for logo */}
                    <div className="ml-4 flex items-center h-16">
                        <Typography variant="h4">Application Name</Typography>
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
                        disabled={datasets.features.length === 0}
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
            <div id="scrollable-side-panel" className="overflow-y-auto">
                <Collapsible title="Search">
                    <Search />
                </Collapsible>
                {selectedSummary && (
                    <Collapsible title="Summary" open={true}>
                        <div className="pb-2">
                            <Summary summary={selectedSummary} />
                        </div>
                    </Collapsible>
                )}
                {datasets.features.length > 0 && (
                    <Collapsible title="Filters">
                        <Filters />
                        <div className="mt-5 mb-2">
                            <CSVDownload />
                        </div>
                    </Collapsible>
                )}
            </div>
        </div>
    );
};
