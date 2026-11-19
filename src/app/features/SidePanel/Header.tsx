import Button from '@/app/components/common/Button';
import CloseButton from '@/app/components/common/CloseButton';
import HelpIcon from '@/app/assets/icons/Help';
import { InitialState } from '@/lib/state/main/slice';
import IconButton from '@/app/components/common/IconButton';
import DataSearchIcon from '@/app/assets/icons/DataSearch';
import KayakIcon from '@/app/assets/icons/Kayak';
import { Title } from './Title';
import { useMode } from '@/app/hooks/useMode';

type Props = {
    onHelpClick: () => void;
    onViewChange: (view: InitialState['view']) => void;
    onHideSidePanel: () => void;
    isTableEnabled: boolean;
};

export const Header: React.FC<Props> = (props) => {
    const { onHelpClick, onViewChange, onHideSidePanel, isTableEnabled } =
        props;

    const { mode, inMainstemsMode, inRiverRunnerMode, toggleMode } = useMode();

    return (
        <div className="pt-2 flex flex-col justify-between bg-primary">
            <div className="flex justify-between" id="attribution">
                <Title mode={mode} />
                <div className="flex justify-center items-center gap-4 mr-2 ">
                    <button
                        title="Show Help Modal"
                        onClick={onHelpClick}
                        className="w-10 text-gray-900 hover:text-gray-700 hover:scale-110 transition-transform text-lg"
                    >
                        <HelpIcon />
                    </button>
                    <div
                        id="side-panel-close"
                        className="block lg:hidden text-black"
                    >
                        <CloseButton
                            onClick={onHideSidePanel}
                            className="text-gray-900 hover:text-gray-700 text-md mt-1"
                            closeIconClassName="w-10 h-auto"
                        />
                    </div>
                </div>
            </div>
            <div className={`flex justify-between my-2 mx-3`}>
                <IconButton
                    onClick={toggleMode}
                    variant="alternative"
                    title={`Change application mode to ${inRiverRunnerMode ? 'mainstem search' : 'river runner.'}`}
                >
                    {inRiverRunnerMode ? <DataSearchIcon /> : <KayakIcon />}
                </IconButton>
                <div className="flex gap-x-2">
                    {inMainstemsMode && (
                        <>
                            <Button
                                title="Switch to Map View"
                                onClick={() => onViewChange('map')}
                                className="min-w-24 min-h-10"
                            >
                                Map
                            </Button>
                            <Button
                                title="Switch to Table View"
                                onClick={() => onViewChange('table')}
                                className="min-w-24 min-h-10"
                                disabled={isTableEnabled}
                            >
                                Table
                            </Button>
                        </>
                    )}
                    <Button
                        title="Switch to About View"
                        onClick={() => onViewChange('about')}
                        className="min-w-24 min-h-10"
                    >
                        About
                    </Button>
                </div>
            </div>
        </div>
    );
};
