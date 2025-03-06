import CloseButton from '@/app/components/common/CloseButton';

type Props = {
    open: boolean;
    handleClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<Props> = (props) => {
    const { open, handleClose } = props;

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
                    <div className="bg-white p-8 rounded-lg shadow-lg w-[45rem] max-w-[80vw] max-h-[93vh] relative overflow-hidden">
                        <span className="absolute top-2 right-2">
                            <CloseButton
                                handleClick={() => handleClose()}
                                className="text-gray-500 hover:text-gray-700 text-lg"
                                closeIconClassName="w-10 h-10"
                            />
                        </span>
                        {props.children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
