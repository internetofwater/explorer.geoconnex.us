import { LoadingType } from '@/lib/state/loading/types';
import { RootState } from '@/lib/state/store';
import { loadingManager } from '@/managers/init';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useLoading = () => {
    const loadingInstances = useSelector(
        (state: RootState) => state.loading.loadingInstances
    );

    const [isFetchingMainstemSummary, setIsFetchingMainstemSummary] =
        useState(false);
    const [isFetchingModalMetrics, setIsFetchingModalMetrics] = useState(false);
    const [isFetchingMainstemDatasets, setIsFetchingMainstemDatasets] =
        useState(false);
    const [isFetchingDatasetCount, setIsFetchingDatasetCount] = useState(false);
    const [isFetchingSearchResults, setIsFetchingSearchResults] =
        useState(false);
    const [isRendering, setIsRendering] = useState(false);

    useEffect(() => {
        setIsFetchingMainstemSummary(
            loadingManager.has({ type: LoadingType.ResultsHover })
        );
        setIsFetchingModalMetrics(
            loadingManager.has({ type: LoadingType.FetchModalMetrics })
        );
        setIsFetchingMainstemDatasets(
            loadingManager.has({ type: LoadingType.Datasets })
        );
        setIsFetchingDatasetCount(
            loadingManager.has({ type: LoadingType.DatasetCount })
        );
        setIsFetchingSearchResults(
            loadingManager.has({ type: LoadingType.SearchResults })
        );
        setIsRendering(loadingManager.has({ type: LoadingType.Rendering }));
    }, [loadingInstances]);

    return {
        isFetchingMainstemSummary,
        isFetchingMainstemDatasets,
        isFetchingModalMetrics,
        isFetchingDatasetCount,
        isFetchingSearchResults,
        isRendering,
    };
};
