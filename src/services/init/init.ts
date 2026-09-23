import { DatasetService } from '@/services/dataset.service';
import { FactoryService } from '@/services/factory.service';

export const factoryService = new FactoryService();

export const datasetService = new DatasetService('https://graph.geoconnex.us', {
    factoryService,
});
