export const LOADING_TYPE = {
    DatasetCount: 'dataset-count',
    Datasets: 'datasets',
    FetchModalMetrics: 'fetch-modal-metrics',
    Rendering: 'rendering',
    ResultsHover: 'results-hover',
    SearchResults: 'search-results',
    SummaryPoints: 'summary-points',

    // River Runner Types
    RiverRunnerLoad: 'river-runner-load',
    RiverRunnerInit: 'river-runner-init',
} as const;

type TLoadingType = (typeof LOADING_TYPE)[keyof typeof LOADING_TYPE];

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
