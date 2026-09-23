import Queries from '@/queries';

export class FactoryService {
    createGetVariablesMeasured(uri: string): string {
        return Queries.getVariablesMeasured(uri);
    }
}
