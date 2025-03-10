type Props = {
    className: string;
};

const CloseIcon: React.FC<Props> = (props) => {
    const { className } = props;

    return (
        <svg
            data-testid="close-button-icon"
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="icon-title-close icon-desc-close"
        >
            <title id="icon-title-close">Close Icon</title>
            <desc id="icon-desc-close">A simple x to close page elements</desc>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
};

export default CloseIcon;
