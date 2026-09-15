import { useSelector } from 'react-redux';
import { Linear } from '../assets/Linear';
import { RootState } from '@/lib/state/store';

// Global loading bar, visible at top of map and table view
export const LoadingBar: React.FC = () => {
    const hasLoadingInstances = useSelector(
        (state: RootState) => state.loading.loadingInstances.length > 0
    );

    return (
        <>
            {hasLoadingInstances && (
                <div id="loading-bar" className="absolute top-0 h-1.5 w-full">
                    <Linear />
                </div>
            )}
        </>
    );
};
