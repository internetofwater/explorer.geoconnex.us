import { Typography } from '@/app/components/common/Typography';
import { Summary as SummaryObj } from '@/lib/state/main/slice';

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
    exclusions?: Exclusions;
};

/**
 * This component displays a summary of a dataset, including its name, length, total sites, total datasets, types, and variables measured.
 * It supports optional exclusions for each of these fields.
 *
 * Props:
 * - summary: SummaryObj - The summary object containing dataset details.
 * - exclusions?: Exclusions - Optional exclusions to hide specific fields.
 *
 * @component
 */
export const SimpleSummary: React.FC<Props> = (props) => {
    const { summary, exclusions = {} } = props;

    const types = Object.keys(summary.types);
    const variables = Object.keys(summary.variables);

    return (
        <div className="mt-1" aria-label="dataset-summary">
            {!exclusions['name'] && (
                <Typography variant="h5">{summary.name}</Typography>
            )}
            {summary.totalDatasets > 0 ? (
                <ul className="pl-8">
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Length (km):</strong> {summary.length}
                        </Typography>
                    </li>
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Total Sites:</strong> {summary.totalSites}
                        </Typography>
                    </li>
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Total Datasets:</strong>{' '}
                            {summary.totalDatasets}
                        </Typography>
                    </li>
                    {types.length > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                {types.length > 10 ? (
                                    <>
                                        <strong>Top 5 Types:</strong>{' '}
                                        {types.slice(0, 5).join(', ')} +{' '}
                                        {types.length - 5} more
                                    </>
                                ) : (
                                    <>
                                        <strong>Types:</strong>{' '}
                                        {types.join(', ')}
                                    </>
                                )}
                            </Typography>
                        </li>
                    )}
                    {variables.length > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                {variables.length > 10 ? (
                                    <>
                                        <strong>
                                            Top 5 Variables Measured:
                                        </strong>{' '}
                                        {variables.slice(0, 5).join(', ')} +{' '}
                                        {variables.length - 5} more
                                    </>
                                ) : (
                                    <>
                                        <strong>Variables Measured:</strong>{' '}
                                        {variables.join(', ')}
                                    </>
                                )}
                            </Typography>
                        </li>
                    )}
                </ul>
            ) : (
                <>
                    <ul className="pl-8">
                        <li className="list-disc break-words whitespace-normal">
                            <strong>Length (km):</strong> {summary.length}
                        </li>
                    </ul>
                    <p className="mt-2 text-gray-500">No Datasets</p>
                </>
            )}
        </div>
    );
};
