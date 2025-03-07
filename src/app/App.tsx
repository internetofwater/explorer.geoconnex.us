'use client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { MainMap } from '@/app/features/MainMap';
import store, { AppDispatch, RootState } from '@/lib/state/store';
import { MapProvider, useMap } from '@/app/contexts/MapContexts';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import { SidePanel } from '@/app/features/SidePanel';
import Table from '@/app/features/Table';
import { MapTools } from '@/app/features/MapTools';
import { useLayoutEffect } from 'react';
import { setShowSidePanel } from '@/lib/state/main/slice';
import IconButton from '@/app/components/common/IconButton';
import { Hamburger } from '@/app/assets/icons/Hamburger';
import { HelpModal } from '@/app/features/HelpModal';

type Props = {
    accessToken: string;
};

export const App: React.FC<Props> = (props) => {
    const { accessToken } = props;

    const { view, showSidePanel } = useSelector(
        (state: RootState) => state.main
    );

    const dispatch: AppDispatch = useDispatch();

    const { map } = useMap(MAIN_MAP_ID);

    useLayoutEffect(() => {
        if (window.innerWidth > 1280) {
            dispatch(setShowSidePanel(true));
        }
    }, [map]);

    const handleSidePanelControlClick = () => {
        dispatch(setShowSidePanel(true));
    };

    return (
        <>
            <HelpModal />
            <div className="flex">
                <div id="side-panel-control" className={`fixed top-2 left-2`}>
                    {!showSidePanel && (
                        <IconButton
                            handleClick={() => handleSidePanelControlClick()}
                        >
                            <Hamburger />
                        </IconButton>
                    )}
                </div>
                <div
                    id="side-panel"
                    className={`
                      w-[70vw] lg:w-[45vw] xl:w-[30vw] 2xl:w-[20vw] 
                     min-w-[300px] sm:min-w-[400px]
                     max-w-[300px] sm:max-w-[400px]
                     h-fit lg:h-full
                     max-h-[88vh] lg:max-h-none
                     flex overflow-hidden bg-primary
                     border lg:border-l-0 lg:border-t-0 lg:border-b-0
                     m-2 lg:m-0
                     rounded-lg lg:rounded-none
                     ${showSidePanel ? 'block' : 'hidden'}`}
                >
                    <SidePanel />
                </div>
                <div
                    id="map"
                    className={`absolute  lg:relative
                        ${view === 'map' ? 'block' : 'hidden'}  w-full`}
                >
                    <MainMap accessToken={accessToken} />
                </div>
                <div
                    id="table"
                    className={`overflow-hidden absolute lg:relative ${
                        view === 'table' ? 'block' : 'hidden'
                    } w-full`}
                >
                    <Table />
                </div>
                <div id="tools" className={`fixed top-2 right-2`}>
                    {view === 'map' && <MapTools />}
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
