type Props = {
    className: string;
};

const CloseIcon: React.FC<Props> = (props) => {
    const { className } = props;

    return (
        <svg
            data-testid="close-button-icon"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            aria-hidden="true"
        >
            <title id="icon-title-close">Close Icon</title>
            <desc id="icon-desc-close">A simple x to close page elements</desc>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
    );
};

export default CloseIcon;
