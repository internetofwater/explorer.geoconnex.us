import React, { useEffect, useState } from 'react';
import { Variables } from '@/app/features/SidePanel/Filters/Variables';
import { TemporalCoverage } from '@/app/features/SidePanel/Filters/TemporalCoverage';
import { Types } from '@/app/features/SidePanel/Filters/Types';
import { getUnfilteredDatasetsInBounds } from '@/lib/state/main/slice';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/state/store';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import { useMap } from '@/app/contexts/MapContexts';

export const Filters: React.FC = () => {
    const { map } = useMap(MAIN_MAP_ID);

    const datasets = useSelector((state: RootState) =>
        getUnfilteredDatasetsInBounds(state, map)
    );

    const [types, setTypes] = useState<string[]>([]);
    const [variables, setVariables] = useState<string[]>([]);
    const [minTime, setMinTime] = useState<Date | null>(null);
    const [maxTime, setMaxTime] = useState<Date | null>(null);

    useEffect(() => {
        if (!datasets || !datasets?.features?.length) {
            return;
        }

        const newTypes: string[] = [];
        const newVariables: string[] = [];
        let minTime: Date | null = null;
        let maxTime: Date | null = null;
        datasets.features.forEach((feature) => {
            if (feature.properties) {
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
        newTypes.sort();
        newVariables.sort();
        setTypes(newTypes);
        setVariables(newVariables);
        setMinTime(minTime);
        setMaxTime(maxTime);
    }, [datasets]);

    return (
        <>
            <Variables variables={variables} />
            <br />
            <Types types={types} />
            <br />
            <TemporalCoverage minTime={minTime} maxTime={maxTime} />
        </>
    );
};
