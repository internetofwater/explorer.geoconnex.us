'use client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { MainMap } from '@/app/features/MainMap';
import store, { AppDispatch, RootState } from '@/lib/state/store';
import { MapProvider, useMap } from '@/app/contexts/MapContexts';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import SidePanel from '@/app/features/SidePanel';
import Table from '@/app/features/Table';
import { MapTools } from '@/app/features/MapTools';
import {
    fetchDatasets,
    setLoading,
    setShowSidePanel,
} from '@/lib/state/main/slice';
import IconButton from '@/app/components/common/IconButton';
import HamburgerIcon from '@/app/assets/icons/Hamburger';
import { HelpModal } from '@/app/features/HelpModal';
import { LoadingBar } from '@/app/features/Loading';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
    accessToken: string;
};

/**
 * This component manages the state and display of the map, table, and side panel.
 * Also handles fetch when accessing app with /mainstems/[uri] route.
 *
 * Props:
 * - accessToken: The access token required for accessing the map.
 * @component
 */
export const App: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { view, showSidePanel } = useSelector(
        (state: RootState) => state.main
    );
    const pathname = usePathname();

    const dispatch: AppDispatch = useDispatch();

    const { map } = useMap(MAIN_MAP_ID);

    useEffect(() => {
        // Ensure map is loaded
        if (!map) {
            return;
        }

        // Get the mainstem id on initial load and fetch data from geoconnex
        if (pathname && pathname.startsWith('/mainstems/')) {
            const match = pathname.match(/\/mainstems\/(\d+)/);
            const id = match ? match[1] : null;

            if (id) {
                dispatch(
                    setLoading({
                        item: 'datasets',
                        loading: true,
                    })
                );
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                dispatch(fetchDatasets(id));
            }
        }
    }, [map]);

    const handleSidePanelControlClick = () => {
        dispatch(setShowSidePanel(true));
    };

    return (
        <>
            <HelpModal />
            <div className="flex">
                <div
                    id="side-panel-control"
                    className={`fixed left-2 ${
                        view === 'table'
                            ? 'top-[unset] bottom-6 lg:top-3 lg:bottom-[unset]'
                            : 'top-3'
                    }`}
                >
                    {!showSidePanel && (
                        <IconButton
                            onClick={() => handleSidePanelControlClick()}
                        >
                            <HamburgerIcon />
                        </IconButton>
                    )}
                </div>
                <div
                    id="side-panel"
                    className={`
                     w-[90vw] lg:w-[45vw] xl:w-[30vw] 2xl:w-[20vw] 
                     min-w-[300px] sm:min-w-[400px]
                     max-w-[300px] sm:max-w-[400px]
                     flex overflow-hidden bg-primary
                     m-2 lg:m-0
                     border lg:border-l-0 lg:border-t-0 lg:border-b-0
                     rounded-lg lg:rounded-none
                     shadow-lg
                     ${showSidePanel ? 'block' : 'hidden'}`}
                >
                    <SidePanel />
                </div>
                <div id="tools" className={`fixed top-3 right-2`}>
                    {view === 'map' && <MapTools />}
                </div>
                <div
                    id="map"
                    className={`absolute  lg:relative
                        ${view === 'map' ? 'block' : 'hidden'}  w-full`}
                >
                    <LoadingBar />
                    <MainMap accessToken={accessToken} />
                </div>
                <div
                    id="table"
                    className={`overflow-hidden absolute lg:relative ${
                        view === 'table' ? 'block' : 'hidden'
                    } w-full`}
                >
                    {/* Conserve memory, only render table on view */}
                    {view === 'table' && (
                        <>
                            <LoadingBar />
                            <Table />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

/**
 * This component wraps the main App component with Redux and Map context providers
 * to allow access to the global state and map context across the application.
 *
 * Props:
 * - accessToken: The access token required for accessing the map.
 * @component
 */
export const AppProvider: React.FC<Props> = (props) => {
    const { accessToken } = props;

    return (
        <Provider store={store}>
            <MapProvider mapIds={[MAIN_MAP_ID]}>
                <App accessToken={accessToken} />
            </MapProvider>
        </Provider>
    );
};

export default AppProvider;
