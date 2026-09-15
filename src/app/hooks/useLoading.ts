import { LoadingItem } from '@/lib/state/loading/types';
import { RootState } from '@/lib/state/store';
import { loadingManager } from '@/managers/init';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// export const LoadingItem = {
//     ResultsHover: 'results-hover',
//     Datasets: 'datasets',
//     SearchResults: 'search-results',
//     Rendering: 'rendering',
// };
export const useLoading = () => {
    const loadingInstances = useSelector(
        (state: RootState) => state.loading.loadingInstances
    );

    const [isFetchingMainstemSummary, setIsFetchingMainstemSummary] =
        useState(false);
    const [isFetchingMainstemDatasets, setIsFetchingMainstemDatasets] =
        useState(false);
    const [isFetchingSearchResults, setIsFetchingSearchResults] =
        useState(false);
    const [isRendering, setIsRendering] = useState(false);

    useEffect(() => {
        setIsFetchingMainstemSummary(
            loadingManager.has({ item: LoadingItem.ResultsHover })
        );
        setIsFetchingMainstemDatasets(
            loadingManager.has({ item: LoadingItem.Datasets })
        );
        setIsFetchingSearchResults(
            loadingManager.has({ item: LoadingItem.SearchResults })
        );
        setIsRendering(loadingManager.has({ item: LoadingItem.Rendering }));
    }, [loadingInstances]);

    return {
        isFetchingMainstemSummary,
        isFetchingMainstemDatasets,
        isFetchingSearchResults,
        isRendering,
    };
};
