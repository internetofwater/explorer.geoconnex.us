import Queries from '@/sparql/queries';
import { TQueryOptions } from '@/sparql/queries/types';

export class FactoryService {
    createGetVariablesMeasured(uri: string): string {
        return Queries.getVariablesMeasured(uri);
    }

    createGetTypes(uri: string): string {
        return Queries.getTypes(uri);
    }

    createGetDatasetCount(uri: string, options: TQueryOptions): string {
        return Queries.getDatasetCount(uri, options);
    }

    createGetTotalSites(uri: string): string {
        return Queries.getTotalSites(uri);
    }

    createGetDistributionNames(uri: string): string {
        return Queries.getDistributionNames(uri);
    }

    createGetDatasets(uri: string, options: TQueryOptions): string {
        return Queries.getDatasets(uri, options);
    }
}
