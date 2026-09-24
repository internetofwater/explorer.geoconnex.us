import Queries from '@/sparql/queries';

export type TBasicOptions = {
    limit?: number;
};

export type TBuildSparqlQuery = (options?: TBasicOptions) => string;

export type TSparqlQuery = TBuildSparqlQuery & { example: () => string };

export type TMainstemQuery = ((
    uri: string,
    options?: TBasicOptions
) => string) & {
    example: () => string;
};

export type TQueries = typeof Queries;

export type TQuery = keyof typeof Queries;

export type TBinding<T> = {
    type: string;
    datatype?: string;
    value: T;
};

export type TGraphResponse<T extends Record<string, unknown>> = {
    head: {
        vars: (keyof T)[];
    };
    results: {
        bindings: {
            [K in keyof T]: TBinding<T>;
        }[];
    };
};
