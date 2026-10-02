export const LoadingType = {
    ResultsHover: 'results-hover',
    FetchModalMetrics: 'fetch-modal-metrics',
    DatasetCount: 'dataset-count',
    Datasets: 'datasets',
    SearchResults: 'search-results',
    Rendering: 'rendering',
};

type TLoadingType = (typeof LoadingType)[keyof typeof LoadingType];

export type TLoadingInstance = {
    id: string;
    message: string;
    type: TLoadingType;
};

export type InitialState = {
    loadingInstances: TLoadingInstance[];
};

export const initialState: InitialState = {
    loadingInstances: [],
};
