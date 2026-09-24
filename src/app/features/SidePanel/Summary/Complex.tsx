import { Typography } from '@/app/components/common/Typography';
import { Summary as SummaryObj } from '@/lib/state/main/slice';
import { SummarySection } from '@/app/features/SidePanel/Summary/Section';
import { Spinner } from '@/app/assets/Spinner';
import { useLoading } from '@/app/hooks/useLoading';
import { useMemo } from 'react';

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
    const { summary } = props;

    const { isFetchingMainstemDatasets } = useLoading();

    const types = useMemo(
        () =>
            summary.types.reduce<
                Record<string, (typeof summary.types)[number]['datasets']>
            >((acc, { datasets, type }) => {
                acc[type] = datasets;
                return acc;
            }, {}),
        [summary.types]
    );

    const variables = useMemo(
        () =>
            summary.variables.reduce<
                Record<string, (typeof summary.types)[number]['datasets']>
            >((acc, { datasets, variableMeasured }) => {
                acc[variableMeasured] = datasets;
                return acc;
            }, {}),
        [summary.variables]
    );

    return (
        <>
            {isFetchingMainstemDatasets ? (
                <div className="flex justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="mt-1" aria-label="dataset-summary">
                    {summary.datasetCount.count > 0 ? (
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
                                        {summary.totalSites.count}
                                    </Typography>
                                </li>
                                <li className="list-disc break-words whitespace-normal">
                                    <Typography variant="body">
                                        <strong>Visible Datasets:</strong>{' '}
                                        {summary.datasetCount.count}
                                    </Typography>
                                </li>
                            </ul>
                            <hr />
                            <div className="my-4">
                                <SummarySection
                                    title="Site Types"
                                    total={summary.datasetCount.count}
                                    data={types}
                                />
                            </div>
                            <hr />
                            <div className="my-4">
                                <SummarySection
                                    title="Variables Measured"
                                    total={summary.datasetCount.count}
                                    data={variables}
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
