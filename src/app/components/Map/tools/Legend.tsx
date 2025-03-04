import Circle from '@/app/assets/icons/Circle';
import Line from '@/app/assets/icons/Line';
import Square from '@/app/assets/icons/Square';
import { LayerType, MainLayerDefinition } from '@/app/components/Map/types';
import { LayerSpecification } from 'mapbox-gl';
import { useCallback } from 'react';

type Props = {
    getLayerName: (id: string) => string;
    getLayerColor: (id: string) => string;
    getLayerConfig: (id: string) => null | LayerSpecification;
    visibleLayers: { [key in string]: boolean };
    layerDefinitions: MainLayerDefinition[];
    symbols?: { [key in string]: React.ReactNode };
    custom?: React.ReactNode;
};

export const Legend: React.FC<Props> = (props) => {
    const {
        visibleLayers,
        layerDefinitions,
        getLayerName,
        getLayerColor,
        getLayerConfig,
        symbols = {},
        custom = <></>,
    } = props;

    const renderSubLayers = (layer: MainLayerDefinition) => {
        return layer.subLayers
            ?.filter(
                (sublayer) => sublayer.legend && visibleLayers[sublayer.id]
            )
            .map((sublayer) => {
                const type = getLayerConfig(sublayer.id)?.type ?? 'none';
                const color = getLayerColor(sublayer.id);

                return (
                    <div
                        key={`legend-entry-${layer.id}-${sublayer.id}`}
                        className="ml-6 p-1 flex items-center"
                    >
                        {color && typeof color === 'string' && (
                            <div className="mr-1">
                                {type === LayerType.Line && (
                                    <Line
                                        key={`legend-entry-${layer.id}-${sublayer.id}`}
                                        color={color}
                                    />
                                )}
                                {type === LayerType.Circle && (
                                    <Circle
                                        key={`legend-entry-${layer.id}-${sublayer.id}`}
                                        color={color}
                                    />
                                )}
                                {type === LayerType.Fill && (
                                    <Square
                                        key={`legend-entry-${layer.id}-${sublayer.id}`}
                                        fill={color}
                                    />
                                )}
                                {type === LayerType.Symbol &&
                                    symbols[sublayer.id] && (
                                        <span
                                            key={`legend-entry-${layer.id}-${sublayer.id}`}
                                        >
                                            {symbols[sublayer.id]}
                                        </span>
                                    )}
                            </div>
                        )}
                        {getLayerName(sublayer.id)}
                    </div>
                );
            });
    };

    const renderLayers = (layers: MainLayerDefinition[]) => {
        return layers.map((layer) => {
            const type = getLayerConfig(layer.id)?.type ?? 'none';
            const color = getLayerColor(layer.id);

            if (
                !layer.legend &&
                !layer.subLayers?.some((subLayer) => subLayer.legend)
            ) {
                return;
            }

            return (
                <div
                    key={`legend-entry-${layer.id}`}
                    className="py-1 text-black"
                >
                    {layer.legend && (
                        <div className="flex items-center">
                            {color && typeof color === 'string' && (
                                <div className="mr-1">
                                    {type === LayerType.Line && (
                                        <Line
                                            key={`legend-entry-${layer.id}`}
                                            color={color}
                                        />
                                    )}
                                    {type === LayerType.Circle && (
                                        <Circle
                                            key={`legend-entry-${layer.id}`}
                                            color={color}
                                        />
                                    )}
                                    {type === LayerType.Fill && (
                                        <Square
                                            key={`legend-entry-${layer.id}`}
                                            fill={color}
                                        />
                                    )}
                                    {type === LayerType.Symbol &&
                                        symbols[layer.id] && (
                                            <span
                                                key={`legend-entry-${layer.id}`}
                                            >
                                                {symbols[layer.id]}
                                            </span>
                                        )}
                                </div>
                            )}
                            <span
                                className={type === 'none' ? 'font-bold' : ''}
                            >
                                {getLayerName(layer.id)}
                            </span>
                        </div>
                    )}
                    {layer.subLayers && renderSubLayers(layer)}
                </div>
            );
        });
    };

    const renderLegend = useCallback(() => {
        return renderLayers(layerDefinitions);
    }, [layerDefinitions, visibleLayers]);

    return (
        <>
            <h6 className="text-lg font-bold mb-1">Legend</h6>
            {renderLegend()}
            {custom}
        </>
    );
};
