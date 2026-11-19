import { LOADING_TYPE } from '@/lib/state/loading/types';
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
            loadingManager.has({ type: LOADING_TYPE.ResultsHover })
        );
        setIsFetchingModalMetrics(
            loadingManager.has({ type: LOADING_TYPE.FetchModalMetrics })
        );
        setIsFetchingMainstemDatasets(
            loadingManager.has({ type: LOADING_TYPE.Datasets })
        );
        setIsFetchingDatasetCount(
            loadingManager.has({ type: LOADING_TYPE.DatasetCount })
        );
        setIsFetchingSearchResults(
            loadingManager.has({ type: LOADING_TYPE.SearchResults })
        );
        setIsRendering(loadingManager.has({ type: LOADING_TYPE.Rendering }));
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
