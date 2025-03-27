import { Typography } from '@/app/components/common/Typography';
import { Summary as SummaryObj } from '@/lib/state/main/slice';
import { SummarySection } from '@/app/features/SidePanel/Summary/Section';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/state/store';
import { Spinner } from '@/app/assets/Spinner';

export type Exclusions = {
    name?: boolean;
    length?: boolean;
    total?: boolean;
    variables?: boolean;
    types?: boolean;
    techniques?: boolean;
};

type Props = {
    summary: SummaryObj;
};

/**
 * This component displays a detailed summary of a dataset, including its name, length, total sites, total datasets, types, and variables measured.
 * Shows a loading spinner when data is being fetched.
 *
 * Props:
 * - summary: SummaryObj - The summary object from redux slice containing dataset details.
 *
 * @component
 */
export const ComplexSummary: React.FC<Props> = (props) => {
    const { loading } = useSelector((state: RootState) => state.main);

    const { summary } = props;

    return (
        <>
            {loading.item === 'datasets' && loading.loading ? (
                <div className="flex justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="mt-1" aria-label="dataset-summary">
                    {summary.totalDatasets > 0 ? (
                        <>
                            <ul className="pl-8 mb-2">
                                <li className="list-disc break-words whitespace-normal">
                                    <Typography variant="body">
                                        <strong>Total Length (km):</strong>{' '}
                                        {summary.length}
                                    </Typography>
                                </li>
                                <li className="list-disc break-words whitespace-normal">
                                    <Typography variant="body">
                                        <strong>Visible Sites:</strong>{' '}
                                        {summary.totalSites}
                                    </Typography>
                                </li>
                                <li className="list-disc break-words whitespace-normal">
                                    <Typography variant="body">
                                        <strong>Visible Datasets:</strong>{' '}
                                        {summary.totalDatasets}
                                    </Typography>
                                </li>
                            </ul>
                            <hr />
                            <div className="my-4">
                                <SummarySection
                                    title="Types"
                                    total={summary.totalDatasets}
                                    data={summary.types}
                                />
                            </div>
                            <hr />
                            <div className="my-4">
                                <SummarySection
                                    title="Variables Measured"
                                    total={summary.totalDatasets}
                                    data={summary.variables}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <ul className="pl-8">
                                <li className="list-disc break-words whitespace-normal">
                                    <strong>Length (km):</strong>{' '}
                                    {summary.length}
                                </li>
                            </ul>
                            <p className="mt-2 text-gray-500">No Datasets</p>
                        </>
                    )}
                </div>
            )}
        </>
    );
};
