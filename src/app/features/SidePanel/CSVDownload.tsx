import Button from '@/app/components/common/Button';
import { convertGeoJSONToCSV } from '@/app/utils/csv';
import { RootState } from '@/lib/state/store';
import { useSelector } from 'react-redux';

export const CSVDownload: React.FC = () => {
    const { filteredDatasets } = useSelector((state: RootState) => state.main);

    return (
        <>
            {filteredDatasets.features.length > 0 && (
                <div id="csvButton">
                    <Button
                        onClick={() => convertGeoJSONToCSV(filteredDatasets)}
                    >
                        <i className="fas fa-download mr-2"></i>
                        <span>Download CSV</span>
                    </Button>
                </div>
            )}
        </>
    );
};
