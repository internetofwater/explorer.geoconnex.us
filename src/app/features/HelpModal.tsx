import { useEffect, useState } from 'react';
import Modal from '@/app/components/common/Modal';
import { Typography } from '@/app/components/common/Typography';

export const HelpModal: React.FC = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [showHelpAgain, setShowHelpAgain] = useState(true);

    useEffect(() => {
        const showHelp = localStorage.getItem('showHelp');
        if (!showHelp || showHelp === 'true') {
            setShowHelp(true);
            setShowHelpAgain(true);
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
        setShowHelp(false);
    };

    return (
        <Modal
            title="Application Name"
            open={showHelp}
            handleClose={handleHelpClose}
        >
            <Typography variant="h4" className="mb-2">
                Welcome!
            </Typography>
            <p className="mb-5 ml-2">
                This application shows <strong>Mainstems</strong>,{' '}
                <strong>Associated Datasets</strong>, and{' '}
                <strong>Two-digit Hydrologic Regions</strong> from the{' '}
                <a href="https://reference.geoconnex.us/" target="_blank">
                    Geoconnex Reference Service
                </a>
                .
            </p>
            <Typography variant="h5" className="mb-2">
                How to Use This Application
            </Typography>
            <Typography variant="h6" className="mt-2">
                Search for Mainstems
            </Typography>
            <ul className="ml-8">
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body">
                        Use the <strong>Search Bar</strong> (left side of the
                        screen) to find a Mainstem by its{' '}
                        <strong>Name at Outlet</strong> or{' '}
                        <strong>Uniform Resource Identifier (URI)</strong>.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body">
                        Search results will appear in the search bar and be{' '}
                        <strong>highlighted in yellow</strong> on the map.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body">
                        Hover over a result to see the Mainstem&apos;s location
                        in <strong>pink</strong>.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body">
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
                    <Typography variant="body">
                        After selecting a Mainstem, use the{' '}
                        <strong>Search Bar</strong> to filter datasets.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body">
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
                    <Typography variant="body">
                        Select a <strong>Hydrologic Region</strong> or{' '}
                        <strong>zoom in</strong> to reveal Mainstems.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body">
                        Hover over a Mainstem to display its{' '}
                        <strong>Name at Outlet</strong>.
                    </Typography>
                </li>
                <li className="list-disc break-words whitespace-normal">
                    <Typography variant="body">
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
                    <Typography variant="body">
                        Once you&apos;ve found and filtered datasets, click
                        Download CSV in the filter menu of the Search Bar to
                        export results.
                    </Typography>
                </li>
            </ul>
            <Typography variant="h6" className="mt-4">
                Get Started{' '}
            </Typography>
            <p className="ml-2 mb-6">
                Try searching for a Mainstem using the{' '}
                <strong>Search Bar</strong> or selecting a{' '}
                <strong>Hydrologic Region</strong> to begin exploring!
            </p>
            <label className="bottom-4 flex items-center">
                <input
                    type="checkbox"
                    name="show-help-again"
                    checked={!showHelpAgain}
                    onChange={(e) => handleDontShowClick(e)}
                    className="mr-2 w-6 h-6"
                />
                <strong>Don&apos;t Show Again</strong>
            </label>
        </Modal>
    );
};
