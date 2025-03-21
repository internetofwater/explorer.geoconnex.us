import CloseButton from '@/app/components/common/CloseButton';
import { Typography } from '@/app/components/common/Typography';

type Props = {
    open: boolean;
    title: string;
    handleClose: () => void;
    children: React.ReactNode;
    action: React.ReactNode;
};

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
                        className="bg-white text-black rounded-lg shadow-lg w-[45rem] max-w-[80vw] max-h-[93svh] relative overflow-x-hidden overflow-y-auto"
                    >
                        <div
                            id="modal-header"
                            className="border-b border-gray-300 md sticky top-0 bg-white flex items-center justify-center p-6 "
                        >
                            <Typography
                                variant="h3"
                                className="text-center flex-grow"
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
                        <div
                            id="modal-action"
                            className="sticky border-t border-gray-300 bottom-0 flex items-center  bg-white p-4"
                        >
                            {props.action}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
