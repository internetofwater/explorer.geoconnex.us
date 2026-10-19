export const LoadingType = {
    DatasetCount: 'dataset-count',
    Datasets: 'datasets',
    FetchModalMetrics: 'fetch-modal-metrics',
    Rendering: 'rendering',
    ResultsHover: 'results-hover',
    SearchResults: 'search-results',
    SummaryPoints: 'summary-points',
};

type TLoadingType = (typeof LoadingType)[keyof typeof LoadingType];

export type TLoadingInstance = {
    id: string;
    message: string;
    type: TLoadingType;
};

export type TInitialState = {
    loadingInstances: TLoadingInstance[];
};

export const initialState: TInitialState = {
    loadingInstances: [],
};
