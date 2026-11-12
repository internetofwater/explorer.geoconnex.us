type Props = {
    zIndex?: number;
};

export const Blur: React.FC<Props> = (props) => {
    const { zIndex = 9998 } = props;

    return (
        <div
            className="absolute top-0 left-0 w-svw h-svh  backdrop-blur-md"
            style={{ zIndex }}
        />
    );
};
