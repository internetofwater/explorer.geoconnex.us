import { Typography } from '@/app/components/common/Typography';
import { FancyList } from '@/app/components/FancyList';
import { TMainstemMetrics } from '@/lib/state/mainstem/types';
import { formatNumber } from '@/app/utils/formatNumber';

export type Exclusions = {
    name?: boolean;
    length?: boolean;
    total?: boolean;
    variables?: boolean;
    types?: boolean;
    techniques?: boolean;
};

type Props = {
    summary: TMainstemMetrics;
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

    const types = summary.types.map(({ type }) => type);
    const variables = summary.variables.map(
        ({ variableMeasured }) => variableMeasured
    );

    return (
        <div className="mt-1" aria-label="dataset-summary">
            {!exclusions['name'] && (
                <Typography variant="h5">{summary.name}</Typography>
            )}
            {summary.datasetCount.count > 0 ? (
                <ul className="pl-8">
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Length (km):</strong>{' '}
                            {formatNumber(summary.length)}
                        </Typography>
                    </li>
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Total Sites:</strong>{' '}
                            {formatNumber(summary.totalSites.count)}
                        </Typography>
                    </li>
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Total Datasets:</strong>{' '}
                            {formatNumber(summary.datasetCount.count)}
                        </Typography>
                    </li>
                    {types.length > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                {types.length > 10 ? (
                                    <>
                                        <strong>Top 5 Types:</strong>{' '}
                                        <FancyList
                                            type="conjunction"
                                            items={types}
                                            max={5}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <strong>Types:</strong>{' '}
                                        <FancyList
                                            type="conjunction"
                                            items={types}
                                        />
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
                                        <FancyList
                                            type="conjunction"
                                            items={variables}
                                            max={5}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <strong>Variables Measured:</strong>{' '}
                                        <FancyList
                                            type="conjunction"
                                            items={variables}
                                        />
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
                            <strong>Length (km):</strong>{' '}
                            {formatNumber(summary.length)}
                        </li>
                    </ul>
                    <p className="mt-2 text-gray-500">No Datasets</p>
                </>
            )}
        </div>
    );
};
