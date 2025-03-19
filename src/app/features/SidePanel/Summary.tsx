import { Typography } from '@/app/components/common/Typography';
import { Summary as SummaryObject } from '@/lib/state/main/slice';

export type Exclusions = {
    name?: boolean;
    length?: boolean;
    total?: boolean;
    variables?: boolean;
    types?: boolean;
    techniques?: boolean;
};

type Props = {
    summary: SummaryObject;
    exclusions?: Exclusions;
};

export const Summary: React.FC<Props> = (props) => {
    const { summary, exclusions = {} } = props;

    return (
        <div className="mt-1" aria-label="dataset-summary">
            {!exclusions['name'] && (
                <Typography variant="h5">{summary.name}</Typography>
            )}
            {summary.total > 0 ? (
                <ul className="pl-8">
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Length (km):</strong> {summary.length}
                        </Typography>
                    </li>
                    <li className="list-disc break-words whitespace-normal">
                        <Typography variant="body-small">
                            <strong>Datasets:</strong> {summary.total}
                        </Typography>
                    </li>
                    {summary.types.length > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                <strong>Types:</strong> {summary.types}
                            </Typography>
                        </li>
                    )}
                    {summary.variables.length > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                <strong>Variables Measured:</strong>{' '}
                                {summary.variables}
                            </Typography>
                        </li>
                    )}
                    {summary.techniques.length > 0 && (
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                <strong>Techniques:</strong>{' '}
                                {summary.techniques}
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
