import { DatasetService } from '@/services/dataset.service';
import { FactoryService } from '@/services/factory.service';
import SparqlClient from 'sparql-http-client';
import { RiverRunnerService } from '@/services/river-runner/river-runner.service';
import { RiverRunnerDataService } from '@/services/river-runner/river-runner.data';
import { RiverRunnerStateService } from '@/services/river-runner/river-runner.state';
import store from '@/lib/state/store';
import { loadingManager, notificationManager } from '@/managers/init';

export const GRAPH_SOURCE = 'https://qlever.internetofwater.app';

export const factoryService = new FactoryService();

export const datasetService = new DatasetService(GRAPH_SOURCE, {
    factoryService,
    client: new SparqlClient({ endpointUrl: GRAPH_SOURCE }),
});

const riverRunnerStateService = new RiverRunnerStateService(store);

export const riverRunnerDataService = new RiverRunnerDataService({
    stateService: riverRunnerStateService,
    loadingManager,
    notificationManager,
});

export const riverRunnerService = new RiverRunnerService({
    stateService: riverRunnerStateService,
    dataService: riverRunnerDataService,
    loadingManager,
    notificationManager,
});
