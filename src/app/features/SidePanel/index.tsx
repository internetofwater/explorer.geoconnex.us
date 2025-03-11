import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { setShowSidePanel, setView } from '@/lib/state/main/slice';
import Search from '@/app/features/SidePanel/Search';
import { Filters } from '@/app/features/SidePanel/Filters';
import { CSVDownload } from '@/app/features/SidePanel/CSVDownload';
import Collapsible from '@/app/components/common/Collapsible';
import CloseButton from '@/app/components/common/CloseButton';
import { Summary } from '@/app/features/SidePanel//Summary';

type Props = {
    className?: string;
};

export const SidePanel: React.FC<Props> = (props) => {
    const { className } = props;

    const { datasets, view, selectedSummary } = useSelector(
        (state: RootState) => state.main
    );

    const dispatch: AppDispatch = useDispatch();

    return (
        <div className="w-full mt-1">
            {/* <Image
                src={logo}
                alt="Internet of Water logo"
                layout="responsive"
                style={{
                    marginLeft: '1rem',
                    width: '60%',
                    height: 'auto',
                }}
            /> */}

            <div className="mt-1 flex justify-between border-b border-gray-300 shadow-lg">
                <div className="flex w-[60%]">
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
                <div
                    id="side-panel-close"
                    className="mr-1 text-black block lg:hidden"
                >
                    <CloseButton
                        title="Close search bar"
                        onClick={() => dispatch(setShowSidePanel(false))}
                        className="text-gray-900 hover:text-gray-700 text-lg"
                        closeIconClassName="w-10 h-10"
                    />
                </div>
            </div>
            <div
                id="scrollable-side-panel"
                className="overflow-y-auto h-fit lg:h-full max-h-[80vh] lg:max-h-none"
            >
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
