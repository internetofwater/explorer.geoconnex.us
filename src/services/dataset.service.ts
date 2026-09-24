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

    async getSummary(uri: string, signal: AbortSignal) {
        console.log('uri', uri);

        const [datasetCount, totalSites, variables, types] = await Promise.all([
            this.getDatasetCount(uri, signal),
            this.getTotalSites(uri, signal),
            this.getVariablesMeasured(uri, signal),
            this.getTypes(uri, signal),
        ]);

        return {
            datasetCount,
            totalSites,
            variables,
            types,
        };
    }

    async getVariablesMeasured(
        uri: string,
        signal: AbortSignal
    ): Promise<TVariablesMeasured> {
        const query = this.deps.factoryService.createGetVariablesMeasured(uri);

        return parseGetVariablesMeasured(await this.fetch(query, signal));
    }

    async getTypes(uri: string, signal: AbortSignal): Promise<TTypes> {
        const query = this.deps.factoryService.createGetTypes(uri);

        return parseGetTypes(await this.fetch(query, signal));
    }

    async getDatasetCount(
        uri: string,
        signal: AbortSignal
    ): Promise<TDatasetCount> {
        const query = this.deps.factoryService.createGetDatasetCount(uri);

        return parseGetDatasetCount(await this.fetch(query, signal));
    }

    async getTotalSites(
        uri: string,
        signal: AbortSignal
    ): Promise<TTotalSites> {
        const query = this.deps.factoryService.createGetTotalSites(uri);

        return parseGetTotalSites(await this.fetch(query, signal));
    }

    getDatasets(uri: string): Readable {
        const query = this.deps.factoryService.createGetDatasets(uri);

        const stream = this.stream(query);

        return stream;
    }
}
