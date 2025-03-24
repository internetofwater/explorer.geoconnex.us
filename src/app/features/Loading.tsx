import { useSelector } from 'react-redux';
import { Linear } from '../assets/Linear';
import { RootState } from '@/lib/state/store';

export const LoadingBar: React.FC = () => {
    const { loading } = useSelector((state: RootState) => state.main);

    return (
        <>
            {loading && (
                <div id="loading-bar" className="absolute bottom-0 h-1 w-full">
                    <Linear />
                </div>
            )}
        </>
    );
};
