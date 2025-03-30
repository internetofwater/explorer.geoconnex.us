import Button from '@/app/components/common/Button';
import { Dataset, MainstemData } from '@/app/types';
import { convertGeoJSONToCSV } from '@/app/utils/csv';
import { FeatureCollection, Point } from 'geojson';

type Props = {
    datasets: FeatureCollection<Point, Dataset>;
    selectedMainstem: MainstemData;
};

/**
 * Renders a button that when clicked generates a CSV file from the provided datasets
 *
 * Props:
 * - datasets: FeatureCollection<Point, Dataset> - Datasets to convert from feature collection to CSV file.
 * - selectedMainstem: MainstemData - Properties of the current selected mainstem for determining the CSV file name.
 *
 * @component
 */
export const CSVDownload: React.FC<Props> = (props) => {
    const { datasets, selectedMainstem } = props;

    // Exclude `:`, invalid sheet and file name char
    const fileName =
        selectedMainstem.name_at_outlet || 'URI ' + selectedMainstem.id;

    return (
        <>
            {datasets.features.length > 0 && (
                <div id="csvButton">
                    <Button
                        title="Download filtered datasets as CSV"
                        onClick={() => convertGeoJSONToCSV(datasets, fileName)}
                    >
                        <span>Download CSV</span>
                    </Button>
                </div>
            )}
        </>
    );
};
