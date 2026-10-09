import CloseButton from '@/app/components/common/CloseButton';
import { Typography } from '@/app/components/common/Typography';

type Props = {
    open: boolean;
    title: string;
    handleClose: () => void;
    children: React.ReactNode;
    action?: React.ReactNode;
    width?: string;
};

/**
 * Renders a modal dialog with a title, body content, and action buttons.
 * It supports closing the modal by clicking outside of the content area.
 *
 * Props:
 * - open: boolean - Whether the modal is open.
 * - title: string - The title of the modal.
 * - handleClose: () => void - Function to handle closing the modal.
 * - children: React.ReactNode - The content to be rendered within the modal body.
 * - action: React.ReactNode - The action buttons to be rendered within the modal footer.
 *
 *
 * @component
 */
const Modal: React.FC<Props> = (props) => {
    const { open, title, handleClose } = props;

    return (
        <>
            {open && (
                <div
                    id="modal-overlay"
                    data-testid="modal-overlay"
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).id === 'modal-overlay') {
                            handleClose();
                        }
                    }}
                >
                    <div
                        data-testid="modal-content"
                        className={`w-[45rem] bg-primary-opaque text-black rounded-lg shadow-lg max-w-[80vw] max-h-[93svh] relative overflow-x-hidden overflow-y-auto`}
                    >
                        <div
                            id="modal-header"
                            className="border-b border-gray-300 md sticky top-0 bg-primary-opaque flex items-start justify-center p-2 "
                        >
                            <Typography
                                variant="h2"
                                as="h3"
                                className="text-left flex-grow pl-4"
                            >
                                {title}
                            </Typography>
                            <CloseButton
                                onClick={() => handleClose()}
                                className="text-gray-900 hover:text-gray-700 text-md ml-auto"
                                closeIconClassName="w-8 h-8"
                            />
                        </div>
                        <div id="modal-body" className="p-6">
                            {props.children}
                        </div>
                        {props?.action && (
                            <div
                                id="modal-action"
                                className="sticky border-t border-gray-300 bottom-0 flex items-center  bg-primary-opaque p-4"
                            >
                                {props.action}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
