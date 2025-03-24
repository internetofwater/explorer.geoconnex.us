import { Typography } from '@/app/components/common/Typography';
import { Summary as SummaryObj } from '@/lib/state/main/slice';
import { SummarySection } from '@/app/features/SidePanel/Summary/Section';

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

export const ComplexSummary: React.FC<Props> = (props) => {
    const { summary, exclusions = {} } = props;

    return (
        <div className="mt-1" aria-label="dataset-summary">
            {!exclusions['name'] && (
                <Typography variant="h5">{summary.name}</Typography>
            )}

            {summary.totalDatasets > 0 ? (
                <>
                    <ul className="pl-8 mb-2">
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                <strong>Length (km):</strong> {summary.length}
                            </Typography>
                        </li>
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                <strong>Sites:</strong> {summary.totalSites}
                            </Typography>
                        </li>
                        <li className="list-disc break-words whitespace-normal">
                            <Typography variant="body-small">
                                <strong>Datasets:</strong>{' '}
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
                            <strong>Length (km):</strong> {summary.length}
                        </li>
                    </ul>
                    <p className="mt-2 text-gray-500">No Datasets</p>
                </>
            )}
        </div>
    );
};
