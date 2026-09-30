import SparqlClient from 'sparql-http-client';
import { Readable } from 'stream';
import type { FactoryService } from '@/services/factory.service';
import { TGraphResponse } from '@/sparql/queries/types';
import { TDatasetCount } from '@/sparql/queries/getDatasetCount';
import { parseGetDatasetCount } from '@/sparql/tranformers/getDatasetCount';
import { TTotalSites } from '@/sparql/queries/getTotalSites';
import { parseGetTotalSites } from '@/sparql/tranformers/getTotalSites';
import { TVariablesMeasured } from '@/sparql/queries/getVariablesMeasured';
import { parseGetVariablesMeasured } from '@/sparql/tranformers/getVariablesMeasured';
import { TTypes } from '@/sparql/queries/getTypes';
import { parseGetTypes } from '@/sparql/tranformers/getTypes';
import { TMainstemRequest } from '@/lib/state/mainstem/types';
import { getDefaultRequest } from '@/lib/state/mainstem/utils';

export type SparqlResult = {
    datasets: {
        value: string; // JSON string that should be parsed into Dataset
        datatype: {
            value: string;
        };
        language: string;
        direction: string;
    };
    mainstem: {
        value: string;
    };
};

export type TDatasetServiceDependencies = {
    factoryService: FactoryService;
};

interface IResultWithId<T> {
    result: T;
    requestId: number;
}

type TServiceOptions = {
    signal: AbortSignal;
};

type TServiceOptionsWithRequest = TServiceOptions & {
    request?: TMainstemRequest;
};

type TServiceOptionsIdentifiedWithRequest = TServiceOptionsWithRequest & {
    requestId?: number;
};

export class DatasetService {
    private url: string;
    private client: SparqlClient;
    private deps: TDatasetServiceDependencies;

    constructor(uri: string, deps: TDatasetServiceDependencies) {
        this.url = uri;
        // Dependency?
        this.client = new SparqlClient({ endpointUrl: uri });
        this.deps = deps;
    }

    private stream(query: string): Readable {
        const stream = this.client.query.select(query);

        return stream;
    }

    private async fetch<T extends Record<string, unknown>>(
        query: string,
        signal: AbortSignal
    ): Promise<TGraphResponse<T>> {
        const response = await fetch(
            `${this.url}?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Accept: 'application/sparql-results+json',
                },
                signal,
            }
        );

        return (await response.json()) as TGraphResponse<T>;
    }

    async getSummary(uri: string, options: TServiceOptions) {
        const { signal } = options;

        const [{ result }, totalSites, variables, types] = await Promise.all([
            this.getDatasetCount(uri, { signal }),
            this.getTotalSites(uri, { signal }),
            this.getVariablesMeasured(uri, { signal }),
            this.getTypes(uri, { signal }),
        ]);

        return {
            datasetCount: result,
            totalSites,
            variables,
            types,
        };
    }

    async getVariablesMeasured(
        uri: string,
        options: TServiceOptions
    ): Promise<TVariablesMeasured> {
        const query = this.deps.factoryService.createGetVariablesMeasured(uri);

        return parseGetVariablesMeasured(
            await this.fetch(query, options.signal)
        );
    }

    async getTypes(uri: string, options: TServiceOptions): Promise<TTypes> {
        const query = this.deps.factoryService.createGetTypes(uri);

        return parseGetTypes(await this.fetch(query, options.signal));
    }

    async getDatasetCount(
        uri: string,
        options: TServiceOptionsIdentifiedWithRequest
    ): Promise<IResultWithId<TDatasetCount>> {
        const { request = getDefaultRequest(), requestId = -1 } = options;

        const query = this.deps.factoryService.createGetDatasetCount(
            uri,
            request
        );

        return {
            result: parseGetDatasetCount(
                await this.fetch(query, options.signal)
            ),
            requestId,
        };
    }

    async getTotalSites(
        uri: string,
        options: TServiceOptions
    ): Promise<TTotalSites> {
        const query = this.deps.factoryService.createGetTotalSites(uri);

        return parseGetTotalSites(await this.fetch(query, options.signal));
    }

    getDatasets(uri: string, request: TMainstemRequest): Readable {
        const query = this.deps.factoryService.createGetDatasets(uri, {
            variables: request.variables,
            types: request.types,
        });

        console.log('query', query);

        const stream = this.stream(query);

        return stream;
    }
}
