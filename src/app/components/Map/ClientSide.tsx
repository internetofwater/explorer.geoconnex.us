'use client';
// MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/app/contexts/MapContexts';
import { MapComponentProps } from '@/app/components/Map/types';
import {
    addClickFunctions,
    addControls,
    addHoverFunctions,
    addLayers,
    addMouseMoveFunctions,
    addSources,
} from '@/app/components/Map/utils';

import 'mapbox-gl/dist/mapbox-gl.css';
import FeatureService, {
    FeatureServiceOptions,
} from '@hansdo/mapbox-gl-arcgis-featureserver';

const MapComponent: React.FC<MapComponentProps> = (props) => {
    const { id, sources, layers, options, controls, accessToken } = props;

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { map, setMap } = useMap(id);

    useEffect(() => {
        if (!map && mapContainerRef.current) {
            mapboxgl.accessToken = accessToken;
            const newMap = new mapboxgl.Map({
                ...options,
                container: mapContainerRef.current,
            });

            const hoverPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });

            const persistentPopup = new mapboxgl.Popup();

            newMap.on('load', () => {
                const createFeatureService = (
                    sourceId: string,
                    map: mapboxgl.Map,
                    options: FeatureServiceOptions
                ) => new FeatureService(sourceId, map, options);

                setMap(newMap, hoverPopup, persistentPopup);
                addSources(newMap, sources, createFeatureService);
                addLayers(newMap, layers);
                addHoverFunctions(newMap, layers, hoverPopup, persistentPopup);
                addClickFunctions(newMap, layers, hoverPopup, persistentPopup);
                addMouseMoveFunctions(
                    newMap,
                    layers,
                    hoverPopup,
                    persistentPopup
                );
                addControls(newMap, controls);
            });

            newMap.on('style.load', () => {
                const createFeatureService = (
                    sourceId: string,
                    map: mapboxgl.Map,
                    options: FeatureServiceOptions
                ) => new FeatureService(sourceId, map, options);

                // Layers reset on style changes
                addSources(newMap, sources, createFeatureService);
                addLayers(newMap, layers);
                addHoverFunctions(newMap, layers, hoverPopup, persistentPopup);
                addClickFunctions(newMap, layers, hoverPopup, persistentPopup);
                addMouseMoveFunctions(
                    newMap,
                    layers,
                    hoverPopup,
                    persistentPopup
                );
            });
        }

        return () => {
            if (map) map.remove();
        };
    }, []);

    // Style the container using #map-container-${id} in a global css file
    return (
        <div
            data-testid={`map-container-${id}`}
            id={`map-container-${id}`}
            ref={mapContainerRef}
        />
    );
};

export default MapComponent;
