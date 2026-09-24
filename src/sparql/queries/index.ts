import { getVariablesMeasured } from '@/sparql/queries/getVariablesMeasured';
import { getTypes } from '@/sparql/queries/getTypes';
import { getDatasetCount } from '@/sparql/queries/getDatasetCount';
import { getTotalSites } from '@/sparql/queries/getTotalSites';
import { getDatasets } from '@/sparql/queries/getDatasets';

const Queries = {
    getVariablesMeasured,
    getTypes,
    getDatasetCount,
    getTotalSites,
    getDatasets,
};

export default Queries;
