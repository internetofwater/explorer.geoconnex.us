type Props = {
    className: string;
};

const OpenIcon: React.FC<Props> = (props) => {
    const { className } = props;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 -960 960 960"
            fill="currentColor"
            aria-labelledby="icon-title-open icon-desc-open"
        >
            <title id="icon-title-open">Open Icon</title>
            <desc id="icon-desc-open">Icon to indicate opening an item</desc>
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
        </svg>
    );
};

export default OpenIcon;
