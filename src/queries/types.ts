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
