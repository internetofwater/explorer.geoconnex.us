import { Datasets, TDatasets, TRawGetDatasets } from '../queries/getDatasets';

export const parseGetDatasets = (response: TRawGetDatasets): TDatasets => {
    const result = response.map(
        ({
            datasetDescription,
            distributionName,
            monitoringLocation,
            siteName,
            temporalCoverage,
            type,
            variableMeasured,
            variableUnit,
            wkt,
        }) => ({
            datasetDescription: datasetDescription.value,
            distributionName: distributionName.value,
            monitoringLocation: monitoringLocation.value,
            siteName: siteName.value,
            temporalCoverage: temporalCoverage.value,
            type: type.value,
            variableMeasured: variableMeasured.value,
            variableUnit: variableUnit.value,
            wkt: wkt.value,
        })
    );

    return Datasets.parse(result);
};
