import Button from '@/app/components/common/Button';
import { convertGeoJSONToCSV } from '@/app/utils/csv';
import { getDatasets } from '@/lib/state/main/slice';
import { useSelector } from 'react-redux';

export const CSVDownload: React.FC = () => {
    const datasets = useSelector(getDatasets);

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
