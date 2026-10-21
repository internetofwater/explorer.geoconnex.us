type Props = {
    className?: string;
};

const RightArrow: React.FC<Props> = (props) => {
    const { className } = props;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 -960 960 960"
            fill="currentColor"
            aria-hidden="true"
        >
            <title id="icon-title-right-arrow">Right Arrow Icon</title>
            <desc id="icon-desc-right-arrow">
                A right arrow icon used show if a collapsed element is visible
            </desc>
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
        </svg>
    );
};

export default RightArrow;
