import { FeatureCollection, Geometry, Point } from 'geojson';
import * as XLSX from 'xlsx';
import { Dataset } from '@/app/types';

export const convertGeoJSONToCSV = (
    geojson: FeatureCollection<Point, Dataset>
) => {
    // TODO: add name of mainstem and call getHeaderValue the add cells in the same order as the Table headers
    const datasets = geojson.features.map((feature) => feature.properties);

    const worksheet = XLSX.utils.json_to_sheet(datasets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datasets');

    const csvData = XLSX.write(workbook, {
        bookType: 'csv',
        type: 'array',
    }) as BlobPart;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'datasets.csv';

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the download by simulating a click
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
};

export const getHeaderValue = (key: string) => {
    switch (key) {
        case 'siteName':
            return 'Site Name';
        case 'type':
            return 'Type';
        case 'variableMeasured':
            return 'Variable Measured';
        case 'variableUnit':
            return 'Variable Unit';
        case 'measurementTechnique':
            return 'Measurement Technique';
        case 'temporalCoverage':
            return 'Temporal Coverage';
        case 'monitoringLocation':
            return 'Monitoring Location';
        case 'datasetDescription':
            return 'Dataset Description';
        case 'distributionFormat':
            return 'Distribution Format';
        case 'distributionName':
            return 'Distribution Name';
        case 'distributionURL':
            return 'Distribution URL';
        case 'url':
            return 'URL';
        default:
            return key;
    }
};
