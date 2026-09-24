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
        query: string
    ): Promise<TGraphResponse<T>> {
        const response = await fetch(
            `${this.url}?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Accept: 'application/sparql-results+json',
                },
            }
        );

        return (await response.json()) as TGraphResponse<T>;
    }

    async getSummary(mainstemURI: string) {
        console.log('mainstemURI', mainstemURI);

        const [datasetCount, totalSites, variablesMeasured, types] =
            await Promise.all([
                this.getDatasetCount(mainstemURI),
                this.getTotalSites(mainstemURI),
                this.getVariablesMeasured(mainstemURI),
                this.getTypes(mainstemURI),
            ]);

        return {
            datasetCount,
            totalSites,
            variablesMeasured,
            types,
        };
    }

    async getVariablesMeasured(
        mainstemURI: string
    ): Promise<TVariablesMeasured> {
        const query =
            this.deps.factoryService.createGetVariablesMeasured(mainstemURI);

        return parseGetVariablesMeasured(await this.fetch(query));
    }

    async getTypes(mainstemURI: string): Promise<TTypes> {
        const query = this.deps.factoryService.createGetTypes(mainstemURI);

        return parseGetTypes(await this.fetch(query));
    }

    async getDatasetCount(mainstemURI: string): Promise<TDatasetCount> {
        const query =
            this.deps.factoryService.createGetDatasetCount(mainstemURI);

        return parseGetDatasetCount(await this.fetch(query));
    }

    async getTotalSites(mainstemURI: string): Promise<TTotalSites> {
        const query = this.deps.factoryService.createGetTotalSites(mainstemURI);

        return parseGetTotalSites(await this.fetch(query));
    }

    getDatasets(mainstemURI: string): Readable {
        const query = this.deps.factoryService.createGetDatasets(mainstemURI);

        console.log('query', query);

        const stream = this.stream(query);

        return stream;
    }
}
