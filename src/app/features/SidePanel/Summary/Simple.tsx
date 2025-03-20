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

export const SimpleSummary: React.FC<Props> = (props) => {
    const { summary, exclusions = {} } = props;

    const typesLength = Object.keys(summary.types).length;
    const variablesLength = Object.keys(summary.variables).length;
    // const typesLength = Object.keys(summary.types).length;

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
                    {typesLength > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                {typesLength > 10 ? (
                                    <>
                                        <strong>Top 5 Types:</strong>{' '}
                                        {Object.keys(summary.types)
                                            .slice(0, 5)
                                            .join(', ')}{' '}
                                        + {typesLength - 5} more
                                    </>
                                ) : (
                                    <>
                                        <strong>Types:</strong>{' '}
                                        {Object.keys(summary.types).join(', ')}
                                    </>
                                )}
                            </Typography>
                        </li>
                    )}
                    {variablesLength > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                {variablesLength > 10 ? (
                                    <>
                                        <strong>
                                            Top 5 Variables Measured:
                                        </strong>{' '}
                                        {Object.keys(summary.variables)
                                            .slice(0, 5)
                                            .join(', ')}{' '}
                                        + {variablesLength - 5} more
                                    </>
                                ) : (
                                    <>
                                        <strong>Variables Measured:</strong>{' '}
                                        {Object.keys(summary.variables).join(
                                            ', '
                                        )}
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
