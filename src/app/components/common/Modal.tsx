import CloseButton from '@/app/components/common/CloseButton';
import { Typography } from '@/app/components/common/Typography';

type Props = {
    open: boolean;
    title: string;
    handleClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<Props> = (props) => {
    const { open, title, handleClose } = props;

    return (
        <>
            {open && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).id === 'modal-overlay') {
                            handleClose();
                        }
                    }}
                >
                    <div className="bg-white rounded-lg shadow-lg w-[45rem] max-w-[80vw] max-h-[93vh] relative overflow-x-hidden overflow-y-auto">
                        <div className="sticky flex p-6 top-0 bg-white items-center justify-center">
                            <Typography
                                variant="h3"
                                className="text-center flex-grow"
                            >
                                {title}
                            </Typography>
                            <CloseButton
                                handleClick={() => handleClose()}
                                className="text-gray-500 hover:text-gray-700 text-md ml-auto"
                                closeIconClassName="w-8 h-8"
                            />
                        </div>
                        <div className="p-6">{props.children}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
