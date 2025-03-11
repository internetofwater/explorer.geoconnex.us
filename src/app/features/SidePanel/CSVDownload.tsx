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
                        title="Download filtered datasets as CSV"
                        handleClick={() =>
                            convertGeoJSONToCSV(filteredDatasets)
                        }
                    >
                        <span>Download CSV</span>
                    </Button>
                </div>
            )}
        </>
    );
};
