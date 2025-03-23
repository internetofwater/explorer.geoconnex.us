import React from 'react';
import { Variables } from '@/app/features/SidePanel/Filters/Variables';
import { TemporalCoverage } from '@/app/features/SidePanel/Filters/TemporalCoverage';
import { Types } from '@/app/features/SidePanel/Filters/Types';

export const Filters: React.FC = () => {
    return (
        <>
            <Variables />
            <br />
            <Types />
            <br />
            <TemporalCoverage />
        </>
    );
};
