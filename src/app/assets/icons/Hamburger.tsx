const HamburgerIcon: React.FC = () => {
    return (
        <svg
            data-testid="hamburger-icon"
            width="24"
            height="24"
            className=" text-secondary"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="icon-title-expand icon-desc-expand"
        >
            <title id="icon-title-expand">Expand Icon</title>
            <desc id="icon-desc-expand">
                This icon is used for showing hidden page elements
            </desc>
            <rect
                y="9"
                width="33"
                height="4"
                rx="2"
                stroke="currentColor"
                fill="currentColor"
            />
            <rect
                width="33"
                height="4"
                rx="2"
                stroke="currentColor"
                fill="currentColor"
            />
            <rect
                y="18"
                width="33"
                height="4"
                rx="2"
                stroke="currentColor"
                fill="currentColor"
            />
        </svg>
    );
};

export default HamburgerIcon;
