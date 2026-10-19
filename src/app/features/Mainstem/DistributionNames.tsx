import ReactSelect, {
    DESELECT_ALL_VALUE,
    SELECT_ALL_VALUE,
} from '@/app/components/common/ReactSelect';
import { TOption } from '@/app/components/common/ReactSelect/types';
import { Typography } from '@/app/components/common/Typography';
import { TMainstemMetrics } from '@/lib/state/mainstem/types';
import { useMemo } from 'react';
import { MultiValue, SingleValue } from 'react-select';

type Props = {
    distributionNames: string[];
    onDistributionNamesChange: (
        distributionNames: Props['distributionNames']
    ) => void;
    metricDistributionNames: TMainstemMetrics['distributionNames'];
    disabled?: boolean;
};

export const DistributionNames: React.FC<Props> = (props) => {
    const {
        distributionNames,
        onDistributionNamesChange,
        metricDistributionNames,
        disabled = false,
    } = props;

    const handleChange = (
        option: SingleValue<TOption<string>> | MultiValue<TOption<string>>
    ) => {
        if (!option) {
            return;
        }

        if (Array.isArray(option)) {
            const values = (option as TOption<string>[]).map(
                ({ value }) => value
            );

            if (values.includes(SELECT_ALL_VALUE)) {
                const allDistributionNames = metricDistributionNames.map(
                    ({ distributionName }) => distributionName
                );
                onDistributionNamesChange(allDistributionNames);
                return;
            }

            if (values.includes(DESELECT_ALL_VALUE)) {
                onDistributionNamesChange([]);
                return;
            }

            onDistributionNamesChange(values);
        } else {
            const { value } = option as TOption<string>;
            if (value === SELECT_ALL_VALUE) {
                const allDistributionNames = metricDistributionNames.map(
                    ({ distributionName }) => distributionName
                );
                onDistributionNamesChange(allDistributionNames);

                return;
            }

            if (value === DESELECT_ALL_VALUE) {
                onDistributionNamesChange([]);
                return;
            }

            const newVariables = distributionNames.includes(value)
                ? distributionNames.filter((item) => item !== value)
                : [...distributionNames, value];
            onDistributionNamesChange(newVariables);
        }
    };

    const options: TOption<string>[] = useMemo(() => {
        if (!metricDistributionNames) {
            return [];
        }

        return metricDistributionNames.map(({ distributionName }) => ({
            value: distributionName,
            label: distributionName,
        }));
    }, [metricDistributionNames]);

    const selectedOptions: TOption<string>[] = useMemo(
        () => options.filter(({ value }) => distributionNames.includes(value)),
        [options, distributionNames]
    );

    return (
        <div>
            <label htmlFor="mainstem-distribution-names-select">
                <Typography variant="body" as="span">
                    Distribution Names
                </Typography>
            </label>
            <ReactSelect
                id="mainstem-distribution-names-select"
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                customClassnames={{ control: '!min-h-[8.125rem]' }}
                limit={100}
                isSearchable
                isMulti
                isAllSelectable
                isDisabled={disabled}
            />
        </div>
    );
};
