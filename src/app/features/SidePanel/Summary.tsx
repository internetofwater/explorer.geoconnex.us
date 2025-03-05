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
        <div className="mt-1">
            {!exclusions['name'] && (
                <h6 className="text-lg font-bold">{summary.name}</h6>
            )}
            {summary.total > 0 ? (
                <ul className="pl-4">
                    <li className="list-disc list-inside break-words whitespace-normal">
                        <strong>Length (km):</strong> {summary.length}
                    </li>
                    <li className="list-disc list-inside break-words whitespace-normal">
                        <strong>Datasets:</strong> {summary.total}
                    </li>
                    {summary.types.length > 0 && (
                        <li className="list-disc list-inside break-words whitespace-normal">
                            <strong>Types:</strong> {summary.types}
                        </li>
                    )}
                    {summary.variables.length > 0 && (
                        <li className="list-disc list-inside break-words whitespace-normal">
                            <strong>Variables Measured:</strong>{' '}
                            {summary.variables}
                        </li>
                    )}
                    {summary.techniques.length > 0 && (
                        <li className="list-disc list-inside break-words whitespace-normal">
                            <strong>Techniques:</strong> {summary.techniques}
                        </li>
                    )}
                </ul>
            ) : (
                <>
                    <ul className="pl-4">
                        <li className="list-disc list-inside break-words whitespace-normal">
                            <strong>Length (km):</strong> {summary.length}
                        </li>
                    </ul>
                    <p className="mt-2 text-gray-500">No Datasets</p>
                </>
            )}
        </div>
    );
};
