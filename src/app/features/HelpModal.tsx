import { useEffect, useState } from 'react';
import Modal from '@/app/components/common/Modal';
import { MagnifyingGlass } from '@/app/assets/icons/MagnifyingGlass';
import { Pointer } from '@/app/assets/icons/Pointer';

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
        <Modal open={showHelp} handleClose={handleHelpClose}>
            <div>
                <h2 className="text-4xl font-extrabold mb-4 text-center">
                    Modal Title
                </h2>
                <div className="overflow-y-auto max-h-[72vh] pr-2">
                    <h4 className="text-2xl font-bold mb-2">Welcome!</h4>
                    <p className="mb-5">
                        This application shows <strong>Mainstems</strong>,{' '}
                        <strong>Associated Datasets</strong>, and{' '}
                        <strong>Two-digit Hydrologic Regions</strong> from the{' '}
                        <a
                            href="https://reference.geoconnex.us/"
                            target="_blank"
                        >
                            Geoconnex Reference Service
                        </a>
                        .
                    </p>
                    <h4 className="text-2xl font-bold mb-2">How to Use:</h4>
                    <div className="flex mb-5 ">
                        <div className="w-[15%] mr-2">
                            <MagnifyingGlass />
                        </div>
                        <p className="w-[85%]">
                            To search for <strong>Mainstems</strong>, use the
                            Search Bar on the left side of the screen. You can
                            search by the <strong>Name at Outlet</strong> or the{' '}
                            <strong>Uniform Resource Identifier (URI)</strong>.
                            After you search, relevant results will appear in
                            the search bar and highlighted in yellow on the map.
                            If you hover over the results, you will see the{' '}
                            <strong>Mainstem</strong> location in pink on the
                            map.
                        </p>
                    </div>
                    <p className="mb-5">
                        Click on a <strong>Mainstem</strong> from the search
                        results or the map to find related datasets. After
                        selecting a <strong>Mainstem</strong>, you can filter
                        datasets in the Search Bar. You can view datasets on the
                        map or in the <i className="font-semibold">Table</i> tab
                        in the Search Bar.
                    </p>
                    <div className="flex mb-5">
                        <p className="w-[87%]">
                            Alternatively, you can search visually by selecting
                            a <strong>Hydrologic Region</strong> or zooming in
                            to display
                            <strong>Mainstems</strong>. Hover over a{' '}
                            <strong>Mainstem</strong> to display the{' '}
                            <strong>Name at Outlet</strong>. Select it to fetch
                            associated datasets and display a summary of
                            information in the Search Bar.
                        </p>
                        <div className="w-[13%] ml-2">
                            <Pointer />
                        </div>
                    </div>
                    <p className="mb-5">
                        Once you find and filter datasets, you can export the
                        results by using the{' '}
                        <i className="font-semibold">Download CSV</i> button in
                        the filter menu of the search bar.
                    </p>
                </div>
                <label className="text-lg mt-1 flex items-center">
                    <input
                        type="checkbox"
                        name="show-help-again"
                        checked={!showHelpAgain}
                        onChange={(e) => handleDontShowClick(e)}
                        className="mr-2 w-6 h-6"
                    />
                    Don&apos;t Show Again
                </label>
            </div>
        </Modal>
    );
};
