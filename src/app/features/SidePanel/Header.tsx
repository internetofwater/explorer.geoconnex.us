import Button from '@/app/components/common/Button';
import CloseButton from '@/app/components/common/CloseButton';
import Image from 'next/image';
import HelpIcon from '@/app/assets/icons/Help';
import { Typography } from '@/app/components/common/Typography';
import { InitialState, MODE, TMode } from '@/lib/state/main/slice';
import IconButton from '@/app/components/common/IconButton';
import DataSearchIcon from '@/app/assets/icons/DataSearch';

type Props = {
    mode: TMode;
    onHelpClick: () => void;
    onViewChange: (view: InitialState['view']) => void;
    onHideSidePanel: () => void;
    onModeChange: () => void;
    isTableEnabled: boolean;
};

export const Header: React.FC<Props> = (props) => {
    const {
        mode,
        onHelpClick,
        onViewChange,
        onHideSidePanel,
        onModeChange,
        isTableEnabled,
    } = props;
    return (
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
            <div className="flex justify-between mt-2 mb-1 ml-3 mr-3">
                <IconButton
                    onClick={onModeChange}
                    variant="alternative"
                    title={`Change application mode to ${mode === MODE.RiverRunner ? 'mainstem search' : 'river runner.'}`}
                >
                    <DataSearchIcon />
                </IconButton>
                <div className="flex gap-x-2">
                    {mode === MODE.Mainstems && (
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
