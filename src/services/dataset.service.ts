import SparqlClient from 'sparql-http-client';
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

    constructor(uri: string) {
        this.url = uri;
        this.client = new SparqlClient({ endpointUrl: uri });
    }

    private stream(query: string): Readable {
        const stream = this.client.query.select(query);

        return stream;
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

        console.log('result', query);
        // const result = await this.get(query, signal);
        const stream = this.stream(query);

        console.log('result', query);

        return stream;
    }
}
