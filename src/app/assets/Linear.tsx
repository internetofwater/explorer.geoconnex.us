export const Linear: React.FC = () => {
    return (
        <div
            className="w-full bg-gray-200 h-2 overflow-hidden"
            aria-label="Linear progress indicator"
        >
            <div className="bg-blue-500 h-2 rounded-full animate-linear"></div>
        </div>
    );
};
