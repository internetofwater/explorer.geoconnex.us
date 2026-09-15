export const LoadingItem = {
    ResultsHover: 'results-hover',
    Datasets: 'datasets',
    SearchResults: 'search-results',
    Rendering: 'rendering',
};

type TLoadingItem = (typeof LoadingItem)[keyof typeof LoadingItem];

export type TLoadingInstance = {
    id: string;
    message: string;
    item: TLoadingItem;
};

export type InitialState = {
    loadingInstances: TLoadingInstance[];
};

export const initialState: InitialState = {
    loadingInstances: [],
};
