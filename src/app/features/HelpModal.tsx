import { useEffect, useState } from 'react';
import Modal from '@/app/components/common/Modal';
import { Typography } from '@/app/components/common/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { setShowHelp } from '@/lib/state/main/slice';
import Button from '../components/common/Button';

export const HelpModal: React.FC = () => {
    const { showHelp } = useSelector((state: RootState) => state.main);

    const dispatch: AppDispatch = useDispatch();

    const [showHelpAgain, setShowHelpAgain] = useState(true);

    useEffect(() => {
        const showHelp = localStorage.getItem('showHelp');
        if (!showHelp || showHelp === 'true') {
            dispatch(setShowHelp(true));
            setShowHelpAgain(true);
        } else if (showHelp === 'false') {
            setShowHelpAgain(false);
        }
    }, []);

    const handleDontShowClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { checked } = event.target;
        if (checked) {
            localStorage.setItem('showHelp', 'false');
            setShowHelpAgain(false);
        } else {
            localStorage.setItem('showHelp', 'true');
            setShowHelpAgain(true);
        }
    };

    const handleHelpClose = () => {
        dispatch(setShowHelp(false));
    };

    return (
        <Modal
            title="Application Name"
            open={showHelp}
            handleClose={handleHelpClose}
            action={
                <div className="w-full flex justify-between items-center ml-2">
                    <Button
                        title="Continue to application"
                        onClick={handleHelpClose}
                    >
                        Continue
                    </Button>
                    <span className="flex w-1/2 justify-center items-center">
                        <input
                            type="checkbox"
                            id="show-help-again"
                            name="show-help-again"
                            checked={!showHelpAgain}
                            onChange={(e) => handleDontShowClick(e)}
                            className="ml-auto mr-2 w-5 h-5 "
                        />
                        <label htmlFor="show-help-again">
                            <Typography variant="small">
                                <strong>
                                    <em>Don&apos;t Show Again</em>
                                </strong>
                            </Typography>
                        </label>
                    </span>
                </div>
            }
        >
            <Typography variant="h4" className="mb-2">
                Welcome!
            </Typography>
            <p className="mb-6 ml-4">
                This application allows users to explore{' '}
                <strong>Mainstem Rivers</strong> in the{' '}
                <strong>Continental United States</strong> and discover various{' '}
                <strong>datasets</strong> from across the web with a single
                click.
            </p>
            <Typography variant="h4" className="mb-2">
                How to Use This Application
            </Typography>
            <Typography variant="h6" className="mt-2">
                Search for Mainstems
            </Typography>
            <ul className="ml-8">
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        Use the <strong>Search Bar</strong> (left side of the
                        screen) to find a Mainstem by its{' '}
                        <strong>Name at Outlet</strong> or{' '}
                        <strong>Uniform Resource Identifier (URI)</strong>.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        Search results will appear in the search bar and be{' '}
                        <strong>highlighted in yellow</strong> on the map.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        Hover over a result to see the Mainstem&apos;s location
                        in <strong>pink</strong>.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        <strong>Click a Mainstem</strong> to view its related
                        datasets.
                    </Typography>
                </li>
            </ul>
            <Typography variant="h6" className=" mt-2">
                Find and Filter Datasets
            </Typography>
            <ul className="ml-8">
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        After selecting a Mainstem, use the{' '}
                        <strong>Search Bar</strong> to filter datasets.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        View datasets either <strong>on the map</strong> or in
                        the <strong>Table tab</strong>.
                    </Typography>
                </li>
            </ul>
            <Typography variant="h6" className="mt-2">
                Search Visually{' '}
            </Typography>
            <ul className="ml-8">
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        Select a <strong>Hydrologic Region</strong> or{' '}
                        <strong>zoom in</strong> to reveal Mainstems.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        Hover over a Mainstem to display its{' '}
                        <strong>Name at Outlet</strong>.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        <strong>Click a Mainstem</strong> to fetch related
                        datasets and see a summary in the{' '}
                        <strong>Search Bar</strong>.
                    </Typography>
                </li>
            </ul>
            <Typography variant="h6" className="mt-2">
                Download Data{' '}
            </Typography>
            <ul className="ml-8">
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body-small">
                        Once you&apos;ve found and filtered datasets, click
                        Download CSV in the filter menu of the Search Bar to
                        export results.
                    </Typography>
                </li>
            </ul>
            <Typography variant="h6" className="mt-4">
                Get Started{' '}
            </Typography>
            <p className="ml-4">
                Try searching for a Mainstem using the{' '}
                <strong>Search Bar</strong> or selecting a{' '}
                <strong>Hydrologic Region</strong> to begin exploring!
            </p>
        </Modal>
    );
};
