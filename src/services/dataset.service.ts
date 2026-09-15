import SparqlClient, { SimpleClient } from 'sparql-http-client';
import { Readable } from 'stream';

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

export class DatasetService {
    private url: string;
    private client: SparqlClient;
    private simple: SimpleClient;

    constructor(uri: string) {
        this.url = uri;
        this.client = new SparqlClient({ endpointUrl: uri });
        this.simple = new SimpleClient({ endpointUrl: uri });
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
        const query = `
            PREFIX hyf: <https://www.opengis.net/def/schema/hy_features/hyf/>
            PREFIX schema: <https://schema.org/>
            PREFIX gsp: <http://www.opengis.net/ont/geosparql#>

            SELECT ?variableMeasured (COUNT(DISTINCT ?dataset) AS ?datasets)
            WHERE {
                VALUES ?mainstem { <${mainstemURI}> }

                ?monitoringLocation
                    hyf:referencedPosition/hyf:HY_IndirectPosition/hyf:linearElement ?mainstem ;
                    schema:subjectOf ?dataset .

                ?dataset schema:variableMeasured ?var .
                ?var schema:name ?variableMeasured .
            }
            GROUP BY ?variableMeasured
            ORDER BY DESC(?datasets)`;

        return this.fetch(query);
    }

    async getTypes(mainstemURI: string) {
        const query = `
            PREFIX hyf: <https://www.opengis.net/def/schema/hy_features/hyf/>
            PREFIX schema: <https://schema.org/>

            SELECT ?type (COUNT(DISTINCT ?dataset) AS ?datasets)
            WHERE {
                VALUES ?mainstem { <${mainstemURI}> }

                ?monitoringLocation
                    hyf:referencedPosition/hyf:HY_IndirectPosition/hyf:linearElement ?mainstem ;
                    hyf:HydroLocationType ?type ;
                    schema:subjectOf ?dataset .
            }
            GROUP BY ?type
            ORDER BY DESC(?datasets)`;

        return this.fetch(query);
    }

    async getDatasetCount(mainstemURI: string) {
        const query = `
            PREFIX hyf: <https://www.opengis.net/def/schema/hy_features/hyf/>
            PREFIX schema: <https://schema.org/>

            SELECT (COUNT(DISTINCT ?dataset) AS ?count)
            WHERE {
                VALUES ?mainstem { <${mainstemURI}> }

                ?monitoringLocation
                    hyf:referencedPosition/hyf:HY_IndirectPosition/hyf:linearElement ?mainstem ;
                    schema:subjectOf ?dataset .
            }`;

        return this.fetch(query);
    }

    async getTotalSites(mainstemURI: string) {
        const query = `
            PREFIX hyf: <https://www.opengis.net/def/schema/hy_features/hyf/>
            PREFIX schema: <https://schema.org/>
            PREFIX gsp: <http://www.opengis.net/ont/geosparql#>

            SELECT (COUNT(DISTINCT STR(?wkt)) AS ?totalSites)
            WHERE {
                VALUES ?mainstem { <${mainstemURI}> }

                ?monitoringLocation
                    hyf:referencedPosition/hyf:HY_IndirectPosition/hyf:linearElement ?mainstem .
                ?monitoringLocation gsp:hasGeometry/gsp:asWKT ?wkt .
            }`;

        return this.fetch(query);
    }

    getDatasets(mainstemIRI: string): Readable {
        const query = `
            PREFIX hyf: <https://www.opengis.net/def/schema/hy_features/hyf/>
            PREFIX schema: <https://schema.org/>
            PREFIX gsp: <http://www.opengis.net/ont/geosparql#>

            SELECT DISTINCT ?mainstem ?datasets
            WHERE {
                VALUES ?mainstem { <${mainstemIRI}> }
                ?monitoringLocation hyf:HydroLocationType ?type .
                ?monitoringLocation hyf:referencedPosition/hyf:HY_IndirectPosition/hyf:linearElement ?mainstem .
                ?monitoringLocation schema:subjectOf ?dataset .
                ?monitoringLocation gsp:hasGeometry/gsp:asWKT ?wkt .
                ?dataset schema:variableMeasured ?var .
                ?dataset schema:url ?url .
                ?dataset schema:distribution ?distribution .
                ?dataset schema:description ?datasetDescription .
                ?dataset schema:temporalCoverage ?temporalCoverage .
                ?dataset schema:name ?siteName .
                ?var schema:name ?variableMeasured .
                ?var schema:unitText ?variableUnit .
                ?var schema:measurementTechnique ?measurementTechnique .
                ?distribution schema:name ?distributionName .
                ?distribution schema:contentUrl ?distributionURL .
                ?distribution schema:encodingFormat ?distributionFormat .
                BIND(CONCAT(
                    '{"monitoringLocation":"', STR(?monitoringLocation),
                    '","siteName":"', STR(?siteName),
                    '","datasetDescription":"', STR(?datasetDescription),
                    '","type":"', STR(?type),
                    '","url":"', STR(?url),
                    '","variableMeasured":"', STR(?variableMeasured),
                    '","variableUnit":"', STR(?variableUnit),
                    '","measurementTechnique":"', STR(?measurementTechnique),
                    '","temporalCoverage":"', STR(?temporalCoverage),
                    '","distributionName":"', STR(?distributionName),
                    '","distributionURL":"', STR(?distributionURL),
                    '","distributionFormat":"', STR(?distributionFormat),
                    '","wkt":"', STR(?wkt), '"}'
                ) AS ?datasets)
            }
    `;

        console.log('query', query);

        const stream = this.stream(query);

        return stream;
    }
}
