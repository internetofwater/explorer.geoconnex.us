'use client';
import React, { lazy } from 'react';
import { MapComponentProps } from '@/app/components/Map/types';

const ClientSideMap = lazy(() => import('./ClientSide'));

const Map: React.FC<MapComponentProps> = (props) => {
    return (
        <>
            <ClientSideMap {...props} />
        </>
    );
};

export default Map;
