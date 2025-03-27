import { useSelector } from 'react-redux';
import { Linear } from '../assets/Linear';
import { RootState } from '@/lib/state/store';

// Global loading bar, visible at top of map and table view
export const LoadingBar: React.FC = () => {
    const { loading } = useSelector((state: RootState) => state.main);

    return (
        <>
            {loading.loading && (
                <div id="loading-bar" className="absolute top-0 h-1.5 w-full">
                    <Linear />
                </div>
            )}
        </>
    );
};
