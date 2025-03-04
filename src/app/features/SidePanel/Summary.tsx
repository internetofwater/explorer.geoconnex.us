import { Summary as SummaryObject } from '@/lib/state/main/slice';

type Props = {
    summary: SummaryObject;
};

export const Summary: React.FC<Props> = (props) => {
    const { summary } = props;

    return (
        <>
            {summary.total > 0 ? (
                <ul className="pl-4">
                    {/* showSummary confirms summary existence */}
                    <li className="list-disc list-inside break-words whitespace-normal">
                        Length (km): {summary!.length}
                    </li>
                    <li className="list-disc list-inside break-words whitespace-normal">
                        Datasets: {summary!.total}
                    </li>
                    {summary!.types.length > 0 && (
                        <li className="list-disc list-inside break-words whitespace-normal">
                            Types: {summary!.types}
                        </li>
                    )}
                    {summary!.variables.length > 0 && (
                        <li className="list-disc list-inside break-words whitespace-normal">
                            Variables Measures: {summary!.variables}
                        </li>
                    )}
                    {summary!.techniques.length > 0 && (
                        <li className="list-disc list-inside break-words whitespace-normal">
                            Techniques: {summary!.techniques}
                        </li>
                    )}
                </ul>
            ) : (
                <>
                    <ul className="pl-4">
                        <li className="list-disc list-inside break-words whitespace-normal">
                            Length (km): {summary!.length}
                        </li>
                    </ul>
                    <p className="mt-2 text-gray-500">No Datasets</p>
                </>
            )}
        </>
    );
};
