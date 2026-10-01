import { getVariablesMeasured } from '@/sparql/queries/getVariablesMeasured';
import { getTypes } from '@/sparql/queries/getTypes';
import { getDatasetCount } from '@/sparql/queries/getDatasetCount';
import { getTotalSites } from '@/sparql/queries/getTotalSites';
import { getDatasets } from '@/sparql/queries/getDatasets';
import { getDistributionNames } from '@/sparql/queries/getDistributionNames';

const Queries = {
    getVariablesMeasured,
    getTypes,
    getDistributionNames,
    getDatasetCount,
    getTotalSites,
    getDatasets,
};

export default Queries;
