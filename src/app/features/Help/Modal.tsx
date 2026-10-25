import { useEffect, useState } from 'react';
import Modal from '@/app/components/common/Modal';
import { Typography } from '@/app/components/common/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/state/store';
import { setShowHelp } from '@/lib/state/main/slice';
import Button from '@/app/components/common/Button';
import { HELP_CONTENT } from '@/app/features/Help/consts';
import { getHelpSections } from '@/app/features/Help/utils';

/**
 * This component displays a modal with instructions on how to use the Geoconnex Explorer application.
 * It includes a welcome message, usage instructions, and an option to not show the help modal again.
 * It ties into local storage to remember user choices.
 *
 * @component
 */
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
            title="Geoconnex Explorer"
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
            <p className="mb-6">
                This application allows users to explore{' '}
                <strong>Mainstem Rivers</strong> in the{' '}
                <strong>contiguous United States</strong> and discover various{' '}
                <strong>datasets</strong> from across the web with a single
                click.
            </p>
            <Typography variant="h4" className="mb-2">
                How to Use This Application
            </Typography>
            {getHelpSections(HELP_CONTENT).map((section) => (
                <div key={section.title}>
                    <Typography variant="h6" className="mt-2">
                        {section.title}
                    </Typography>

                    {section.items && (
                        <ul className="ml-8">
                            {section.items.map((item, index) => (
                                <li
                                    key={index}
                                    className="list-disc break-words whitespace-normal"
                                >
                                    <Typography variant="body-small">
                                        {item}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    )}

                    {section.content && (
                        <Typography variant="body-small" className="ml-4">
                            {section.content}
                        </Typography>
                    )}
                </div>
            ))}
        </Modal>
    );
};
