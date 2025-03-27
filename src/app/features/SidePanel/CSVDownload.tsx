import Button from '@/app/components/common/Button';
import { Dataset } from '@/app/types';
import { convertGeoJSONToCSV } from '@/app/utils/csv';
import { FeatureCollection, Point } from 'geojson';

type Props = {
    datasets: FeatureCollection<Point, Dataset>;
};

/**
 * Renders a button that when clicked generates a CSV file from the provided datasets
 *
 * Props:
 * - datasets: FeatureCollection<Point, Dataset> - Datasets to convert from feature collection to CSV file.
 *
 * @component
 */
export const CSVDownload: React.FC<Props> = (props) => {
    const { datasets } = props;

    return (
        <>
            {datasets.features.length > 0 && (
                <div id="csvButton">
                    <Button
                        title="Download filtered datasets as CSV"
                        onClick={() => convertGeoJSONToCSV(datasets)}
                    >
                        <span>Download CSV</span>
                    </Button>
                </div>
            )}
        </>
    );
};
