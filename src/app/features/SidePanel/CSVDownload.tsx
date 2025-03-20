import Button from '@/app/components/common/Button';
import { Dataset } from '@/app/types';
import { convertGeoJSONToCSV } from '@/app/utils/csv';
import { FeatureCollection, Geometry } from 'geojson';

type Props = {
    datasets: FeatureCollection<Geometry, Dataset>;
};

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
