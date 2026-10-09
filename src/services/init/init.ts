import { DatasetService } from '@/services/dataset.service';
import { FactoryService } from '@/services/factory.service';
import SparqlClient from 'sparql-http-client';

export const GRAPH_SOURCE = 'https://qlever.internetofwater.app';

export const factoryService = new FactoryService();

export const datasetService = new DatasetService(GRAPH_SOURCE, {
    factoryService,
    client: new SparqlClient({ endpointUrl: GRAPH_SOURCE }),
});
