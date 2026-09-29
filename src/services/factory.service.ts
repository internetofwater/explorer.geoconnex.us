import Queries from '@/sparql/queries';
import { TOptions } from '@/sparql/queries/types';

export class FactoryService {
    createGetVariablesMeasured(uri: string): string {
        return Queries.getVariablesMeasured(uri);
    }

    createGetTypes(uri: string): string {
        return Queries.getTypes(uri);
    }

    createGetDatasetCount(uri: string): string {
        return Queries.getDatasetCount(uri);
    }

    createGetTotalSites(uri: string): string {
        return Queries.getTotalSites(uri);
    }

    createGetDatasets(uri: string, options: TOptions): string {
        return Queries.getDatasets(uri, options);
    }
}
