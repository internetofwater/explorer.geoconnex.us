import { Typography } from '@/app/components/common/Typography';
import { Summary as SummaryObj } from '@/lib/state/main/slice';
// import { useState } from 'react';
import { SummaryEntry } from '@/app/features/SidePanel/Summary/Entry';

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

    // const [top, setTop] = useState<number>(5);

    const typesLength = Object.keys(summary.types).length;
    const variablesLength = Object.keys(summary.variables).length;

    // const topOptions: {
    //     value: number;
    //     label: string;
    // }[] = [
    //     {
    //         value: 5,
    //         label: 'Top 5',
    //     },
    //     {
    //         value: 10,
    //         label: 'Top 10',
    //     },
    //     {
    //         value: 20,
    //         label: 'Top 20',
    //     },
    // ];

    // const handleTopChange = (top: number) => {
    //     setTop(top);
    // };

    // const limitedTypes = useMemo(
    //     () => Object.fromEntries(Object.entries(summary.types).slice(0, top)),
    //     [summary.types, top]
    // );

    // const limitedVariables = useMemo(
    //     () =>
    //         Object.fromEntries(Object.entries(summary.variables).slice(0, top)),
    //     [summary.variables, top]
    // );

    // const typesLength = Object.keys(summary.types).length;

    return (
        <div className="mt-1" aria-label="dataset-summary">
            {!exclusions['name'] && (
                <Typography variant="h5">{summary.name}</Typography>
            )}
            {/* <RadioGroup
                value={top}
                options={topOptions}
                handleChange={handleTopChange}
                ariaLabelPrefix="Select"
            /> */}
            {summary.totalDatasets > 0 ? (
                <ul className="pl-8">
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
                            <strong>Datasets:</strong> {summary.totalDatasets}
                        </Typography>
                    </li>
                    <SummaryEntry
                        total={summary.totalDatasets}
                        length={typesLength}
                        title="Types"
                        data={summary.types}
                    />
                    <SummaryEntry
                        total={summary.totalDatasets}
                        length={variablesLength}
                        title="Variables Measured"
                        data={summary.variables}
                    />
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
