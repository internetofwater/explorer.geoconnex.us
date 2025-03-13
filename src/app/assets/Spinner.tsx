export const Spinner: React.FC = () => {
    return (
        <div
            className="relative flex items-center justify-center"
            aria-label="Spinning progress indicator"
        >
            <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <div className="absolute text-blue-500">75%</div>
        </div>
    );
};
