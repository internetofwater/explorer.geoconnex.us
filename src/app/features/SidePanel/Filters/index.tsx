import React, { useEffect, useState } from 'react';
import { Variables } from '@/app/features/SidePanel/Filters/Variables';
import { TemporalCoverage } from '@/app/features/SidePanel/Filters/TemporalCoverage';
import { Types } from '@/app/features/SidePanel/Filters/Types';
import { getUnfilteredDatasetsInBounds } from '@/lib/state/main/slice';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/state/store';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import { useMap } from '@/app/contexts/MapContexts';
import { SiteNames } from '@/app/features/SidePanel/Filters/SiteNames';
import { DistributionNames } from '@/app/features/SidePanel/Filters/DistributionNames';

/**
 * This component displays various filters for datasets, including site names, variables, types, distribution names, and temporal coverage.
 * It fetches unfiltered datasets within the map bounds and updates the filter options based on the dataset properties.
 *
 * @component
 */
export const Filters: React.FC = () => {
    const { map } = useMap(MAIN_MAP_ID);

    const datasets = useSelector((state: RootState) =>
        getUnfilteredDatasetsInBounds(state, map)
    );

    const [distributionNames, setDistributionNames] = useState<string[]>([]);
    const [siteNames, setSiteNames] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [variables, setVariables] = useState<string[]>([]);
    const [minTime, setMinTime] = useState<Date | null>(null);
    const [maxTime, setMaxTime] = useState<Date | null>(null);

    useEffect(() => {
        if (!datasets || !datasets?.features?.length) {
            return;
        }

        const newDistributionNames: string[] = [];
        const newSiteNames: string[] = [];
        const newTypes: string[] = [];
        const newVariables: string[] = [];
        let minTime: Date | null = null;
        let maxTime: Date | null = null;
        datasets.features.forEach((feature) => {
            if (feature.properties) {
                if (
                    !newDistributionNames.includes(
                        feature.properties.distributionName
                    )
                ) {
                    newDistributionNames.push(
                        feature.properties.distributionName
                    );
                }
                if (!newSiteNames.includes(feature.properties.siteName)) {
                    newSiteNames.push(feature.properties.siteName);
                }

                if (!newTypes.includes(feature.properties.type)) {
                    newTypes.push(feature.properties.type);
                }

                const variable =
                    feature.properties.variableMeasured.split(' / ')[0];
                if (!newVariables.includes(variable)) {
                    newVariables.push(variable);
                }

                const [startTemporal, endTemporal] =
                    feature.properties.temporalCoverage.split('/');
                const startDate = new Date(startTemporal);
                const endDate = new Date(endTemporal);

                minTime = !minTime || startDate < minTime ? startDate : minTime;
                maxTime = !maxTime || endDate > maxTime ? endDate : maxTime;
            }
        });

        newDistributionNames.sort();
        newSiteNames.sort();
        newTypes.sort();
        newVariables.sort();

        setDistributionNames(newDistributionNames);
        setSiteNames(newSiteNames);
        setTypes(newTypes);
        setVariables(newVariables);
        setMinTime(minTime);
        setMaxTime(maxTime);
    }, [datasets]);

    return (
        <>
            <div className="mb-3">
                <SiteNames siteNames={siteNames} />
            </div>
            <div className="mb-3">
                <Variables variables={variables} />
            </div>
            <div className="mb-3">
                <Types types={types} />
            </div>
            <div className="mb-3">
                <DistributionNames distributionNames={distributionNames} />
            </div>
            <TemporalCoverage minTime={minTime} maxTime={maxTime} />
        </>
    );
};
