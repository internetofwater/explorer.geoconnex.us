import { getVariablesMeasured } from '@/queries/getVariablesMeasured';
import { getTypes } from '@/queries/getTypes';
import { getDatasetCount } from '@/queries/getDatasetCount';
import { getTotalSites } from '@/queries/getTotalSites';
import { getDatasets } from '@/queries/getDatasets';

const Queries = {
    getVariablesMeasured,
    getTypes,
    getDatasetCount,
    getTotalSites,
    getDatasets,
};

export default Queries;
