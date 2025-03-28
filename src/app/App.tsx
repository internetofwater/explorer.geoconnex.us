'use client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { MainMap } from '@/app/features/MainMap';
import store, { AppDispatch, RootState } from '@/lib/state/store';
import { MapProvider, useMap } from '@/app/contexts/MapContexts';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import SidePanel from '@/app/features/SidePanel';
import Table from '@/app/features/Table';
import { MapTools } from '@/app/features/MapTools';
import { fetchDatasets, setShowSidePanel } from '@/lib/state/main/slice';
import IconButton from '@/app/components/common/IconButton';
import HamburgerIcon from '@/app/assets/icons/Hamburger';
import { HelpModal } from '@/app/features/HelpModal';
import { LoadingBar } from '@/app/features/Loading';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { About } from './features/About';

type Props = {
    accessToken: string;
};

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

        if (pathname && pathname.startsWith('/mainstems/')) {
            const match = pathname.match(/\/mainstems\/(\d+)/);
            const id = match ? match[1] : null;

            if (id) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                dispatch(fetchDatasets(id));
            }
        }
    }, [map]);

    useEffect(() => {
        if (!map) {
            return;
        }

        map.resize();
    }, [view]);

    const handleSidePanelControlClick = () => {
        dispatch(setShowSidePanel(true));
    };

    return (
        <>
            <HelpModal />
            <div className="flex">
                <div id="side-panel-control" className={`fixed left-2 top-3 `}>
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
                    w-full lg:w-[45vw] xl:w-[30vw] 2xl:w-[20vw] 
                     min-w-[300px] sm:min-w-[400px]
                    md:max-w-[400px]
                     flex overflow-hidden bg-primary
                     border lg:border-l-0 lg:border-t-0 lg:border-b-0
                     m-2 lg:m-0
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
                    <LoadingBar />
                    <Table />
                </div>
                <div
                    id="about"
                    className={`overflow-hidden absolute lg:relative ${
                        view === 'about' ? 'block' : 'hidden'
                    } w-full`}
                >
                    <About />
                </div>
            </div>
        </>
    );
};

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
