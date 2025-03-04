import {
    Map,
    SourceSpecification,
    Popup,
    ScaleControl,
    FullscreenControl,
    NavigationControl,
} from 'mapbox-gl';
import {
    MainLayerDefinition,
    MapComponentProps,
    SourceConfig,
    Sources,
} from '@/app/components/Map/types';
import { FeatureServiceOptions } from '@hansdo/mapbox-gl-arcgis-featureserver';

export const addSources = (
    map: Map,
    sourceConfigs: SourceConfig[],
    featureService: (
        sourceId: string,
        map: Map,
        options: FeatureServiceOptions
    ) => void
) => {
    sourceConfigs.forEach((sourceConfig) => {
        switch (sourceConfig.type) {
            case Sources.ESRI:
                if (!map.getSource(sourceConfig.id)) {
                    featureService(
                        sourceConfig.id,
                        map,
                        sourceConfig.definition as FeatureServiceOptions
                    );
                }
                break;

            case Sources.VectorTile:
                if (!map.getSource(sourceConfig.id)) {
                    map.addSource(
                        sourceConfig.id,
                        sourceConfig.definition as SourceSpecification
                    );
                }
                break;
            case Sources.GeoJSON:
            default:
                if (!map.getSource(sourceConfig.id)) {
                    map.addSource(
                        sourceConfig.id,
                        sourceConfig.definition as SourceSpecification
                    );
                }
                break;
        }
    });
};

export const addLayers = (
    map: Map,
    layerDefinitions: MainLayerDefinition[]
) => {
    layerDefinitions.forEach((layer) => {
        if (layer.config && !map.getLayer(layer.id)) {
            map.addLayer(layer.config);
        }
        if ((layer?.subLayers ?? []).length > 0) {
            layer.subLayers!.forEach((subLayer) => {
                if (subLayer.config && !map.getLayer(subLayer.id)) {
                    map.addLayer(subLayer.config);
                }
            });
        }
    });
};

export const addHoverFunctions = (
    map: Map,
    layerDefinitions: MainLayerDefinition[],
    hoverPopup: Popup,
    persistentPopup: Popup
) => {
    layerDefinitions.forEach((layer) => {
        if (layer.hoverFunction) {
            map.on(
                'mouseenter',
                layer.id,
                layer.hoverFunction(map, hoverPopup, persistentPopup)
            );
            if (layer.customHoverExitFunction) {
                map.on(
                    'mouseleave',
                    layer.id,
                    layer.customHoverExitFunction(
                        map,
                        hoverPopup,
                        persistentPopup
                    )
                );
            } else {
                map.on('mouseleave', layer.id, () => {
                    map.getCanvas().style.cursor = '';
                    hoverPopup.remove();
                });
            }
        }
        if ((layer?.subLayers ?? []).length > 0) {
            layer.subLayers!.forEach((subLayer) => {
                if (subLayer.hoverFunction) {
                    map.on(
                        'mouseenter',
                        subLayer.id,
                        subLayer.hoverFunction(map, hoverPopup, persistentPopup)
                    );
                    if (subLayer.customHoverExitFunction) {
                        map.on(
                            'mouseleave',
                            subLayer.id,
                            subLayer.customHoverExitFunction(
                                map,
                                hoverPopup,
                                persistentPopup
                            )
                        );
                    } else {
                        map.on('mouseleave', subLayer.id, () => {
                            map.getCanvas().style.cursor = '';
                            hoverPopup.remove();
                        });
                    }
                }
            });
        }
    });
};

export const addMouseMoveFunctions = (
    map: Map,
    layerDefinitions: MainLayerDefinition[],
    hoverPopup: Popup,
    persistentPopup: Popup
) => {
    layerDefinitions.forEach((layer) => {
        if (layer.mouseMoveFunction) {
            map.on(
                'mousemove',
                layer.id,
                layer.mouseMoveFunction(map, hoverPopup, persistentPopup)
            );
        }
        if ((layer?.subLayers ?? []).length > 0) {
            layer.subLayers!.forEach((subLayer) => {
                if (subLayer.mouseMoveFunction) {
                    map.on(
                        'mousemove',
                        subLayer.id,
                        subLayer.mouseMoveFunction(
                            map,
                            hoverPopup,
                            persistentPopup
                        )
                    );
                }
            });
        }
    });
};

export const addClickFunctions = (
    map: Map,
    layerDefinitions: MainLayerDefinition[],
    hoverPopup: Popup,
    persistentPopup: Popup
) => {
    layerDefinitions.forEach((layer) => {
        if (layer.clickFunction) {
            map.on(
                'click',
                layer.id,
                layer.clickFunction(map, hoverPopup, persistentPopup)
            );
        }
        if ((layer?.subLayers ?? []).length > 0) {
            layer.subLayers!.forEach((subLayer) => {
                if (subLayer.clickFunction) {
                    map.on(
                        'click',
                        subLayer.id,
                        subLayer.clickFunction(map, hoverPopup, persistentPopup)
                    );
                }
            });
        }
    });
};

export const addControls = (
    map: Map,
    controls: MapComponentProps['controls']
) => {
    if (controls) {
        const { scaleControl, navigationControl, fullscreenControl } = controls;
        if (scaleControl) {
            const scaleControlOptions =
                typeof scaleControl === 'boolean' ? {} : scaleControl;
            map.addControl(new ScaleControl(scaleControlOptions));
        }
        if (navigationControl) {
            const navigationControlOptions =
                typeof navigationControl === 'boolean' ? {} : navigationControl;
            map.addControl(
                new NavigationControl(navigationControlOptions),
                'bottom-right' // TODO: add ability to position
            );
        }
        if (fullscreenControl) {
            const fullscreenControlOptions =
                typeof fullscreenControl === 'boolean' ? {} : fullscreenControl;
            map.addControl(new FullscreenControl(fullscreenControlOptions));
        }
    }
};
