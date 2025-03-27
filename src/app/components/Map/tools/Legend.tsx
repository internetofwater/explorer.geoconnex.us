import CircleIcon from '@/app/assets/icons/Circle';
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

/**
 * Renders a legend for map layers, displaying layer names, colors, and symbols.
 *
 * Props:
 * - getLayerName: (id: string) => string - Function to get the name of a layer by its ID.
 * - getLayerColor: (id: string) => string - Function to get the color of a layer by its ID.
 * - getLayerConfig: (id: string) => null | LayerSpecification - Function to get the configuration of a layer by its ID.
 * - visibleLayers: { [key in string]: boolean } - Object representing the visibility of layers.
 * - layerDefinitions: MainLayerDefinition[] - Array of layer definitions.
 * - symbols?: { [key in string]: React.ReactNode } - Optional object representing custom symbols for layers.
 * - custom?: React.ReactNode - Optional custom React node to be rendered.
 *
 * @component
 */
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
                    <li
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
                                    <CircleIcon
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
                        <span>{getLayerName(sublayer.id)}</span>
                    </li>
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
                return null;
            }

            return (
                <li
                    key={`legend-entry-${layer.id}`}
                    className="py-1 text-text-default"
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
                                        <CircleIcon
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
                    {layer.subLayers && <ul>{renderSubLayers(layer)}</ul>}
                </li>
            );
        });
    };

    const renderLegend = useCallback(() => {
        return <ul>{renderLayers(layerDefinitions)}</ul>;
    }, [layerDefinitions, visibleLayers]);

    return (
        <>
            <h6 className="text-lg font-bold mb-1">Legend</h6>
            {renderLegend()}
            {custom}
        </>
    );
};
