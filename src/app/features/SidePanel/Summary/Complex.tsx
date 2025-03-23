import { Typography } from '@/app/components/common/Typography';
import { Summary as SummaryObj } from '@/lib/state/main/slice';
// import { useState } from 'react';
import { SummaryEntry } from '@/app/features/SidePanel/Summary/Entry';
import { PieChart } from './PieChart';
import { useEffect, useState } from 'react';
import RadioGroup from '@/app/components/common/RadioGroup';

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

    const [topTypes, setTopTypes] = useState<number>(5);
    const [topTypeOptions, setTopTypeOptions] = useState<
        {
            value: number;
            label: string;
        }[]
    >([]);

    const [topVariables, setTopVariables] = useState<number>(5);
    const [topVariableOptions, setTopVariableOptions] = useState<
        {
            value: number;
            label: string;
        }[]
    >([]);

    const typesLength = Object.keys(summary.types).length;
    const variablesLength = Object.keys(summary.variables).length;

    useEffect(() => {
        if (typesLength > 10) {
            setTopTypeOptions([
                {
                    value: 5,
                    label: 'Top 5',
                },
                {
                    value: 10,
                    label: 'Top 10',
                },
                {
                    value: 20,
                    label: 'Top 20',
                },
            ]);
        } else if (typesLength > 5) {
            setTopTypeOptions([
                {
                    value: 5,
                    label: 'Top 5',
                },
                {
                    value: 10,
                    label: 'Top 10',
                },
            ]);
        }
    }, [typesLength]);

    useEffect(() => {
        if (variablesLength > 10) {
            setTopVariableOptions([
                {
                    value: 5,
                    label: 'Top 5',
                },
                {
                    value: 10,
                    label: 'Top 10',
                },
                {
                    value: 20,
                    label: 'Top 20',
                },
            ]);
        } else if (variablesLength > 5) {
            setTopVariableOptions([
                {
                    value: 5,
                    label: 'Top 5',
                },
                {
                    value: 10,
                    label: 'Top 10',
                },
            ]);
        }
    }, [variablesLength]);

    const handleTopTypesChange = (top: number) => {
        setTopTypes(top);
    };

    const handleTopVariablesChange = (top: number) => {
        setTopVariables(top);
    };

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
                    <PieChart
                        labels={Object.keys(summary.types).slice(0, topTypes)}
                        values={Object.values(summary.types).slice(0, topTypes)}
                        top={topTypes}
                    />
                    {topTypeOptions.length > 0 && (
                        <RadioGroup
                            value={topTypes}
                            options={topTypeOptions}
                            handleChange={handleTopTypesChange}
                            ariaLabelPrefix="Select Types"
                            keyPrefix="top-types"
                        />
                    )}
                    <SummaryEntry
                        total={summary.totalDatasets}
                        length={typesLength}
                        title="Types"
                        data={summary.types}
                    />
                    <PieChart
                        labels={Object.keys(summary.variables).slice(
                            0,
                            topVariables
                        )}
                        values={Object.values(summary.variables).slice(
                            0,
                            topVariables
                        )}
                        top={topVariables}
                    />
                    {topVariableOptions.length > 0 && (
                        <RadioGroup
                            value={topVariables}
                            options={topVariableOptions}
                            handleChange={handleTopVariablesChange}
                            ariaLabelPrefix="Select Variables"
                            keyPrefix="top-variables"
                        />
                    )}
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
