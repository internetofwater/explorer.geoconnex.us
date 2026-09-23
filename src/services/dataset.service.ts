import SparqlClient from 'sparql-http-client';
import { Readable } from 'stream';
import type { FactoryService } from '@/services/factory.service';

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

    private async fetch<T extends Record<string, string | number>>(
        query: string
    ): Promise<T> {
        const response = await fetch(
            `${this.url}?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Accept: 'application/sparql-results+json',
                },
            }
        );

        return (await response.json()) as T;
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

    async getVariablesMeasured(mainstemURI: string) {
        const query =
            this.deps.factoryService.createGetVariablesMeasured(mainstemURI);

        return this.fetch(query);
    }

    async getTypes(mainstemURI: string) {
        const query = this.deps.factoryService.createGetTypes(mainstemURI);

        return this.fetch(query);
    }

    async getDatasetCount(mainstemURI: string) {
        const query =
            this.deps.factoryService.createGetDatasetCount(mainstemURI);

        return this.fetch(query);
    }

    async getTotalSites(mainstemURI: string) {
        const query = this.deps.factoryService.createGetTotalSites(mainstemURI);

        return this.fetch(query);
    }

    getDatasets(mainstemURI: string): Readable {
        const query = this.deps.factoryService.createGetDatasets(mainstemURI);

        console.log('query', query);

        const stream = this.stream(query);

        return stream;
    }
}
