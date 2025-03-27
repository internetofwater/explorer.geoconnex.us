import { useCallback } from 'react';
import { MainLayerDefinition } from '@/app/components/Map/types';

type Props = {
    handleChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        isPrimary: boolean
    ) => void;
    getLayerName: (id: string) => string;
    getLayerColor: (id: string) => string;
    visibleLayers: { [key in string]: boolean };
    layerDefinitions: MainLayerDefinition[];
};

/**
 * Renders a list of toggle switches for controlling the visibility of map layers.
 *
 * Props:
 * - handleChange: (event: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => void - Function to handle changes in the toggle switches.
 * - getLayerName: (id: string) => string - Function to get the name of a layer by its ID.
 * - getLayerColor: (id: string) => string - Function to get the color of a layer by its ID.
 * - visibleLayers: { [key in string]: boolean } - Object representing the visibility of layers.
 * - layerDefinitions: MainLayerDefinition[] - Array of layer definitions.
 *
 * @component
 */
export const Toggles: React.FC<Props> = ({
    visibleLayers,
    layerDefinitions,
    getLayerName,
    handleChange,
}) => {
    const renderToggles = useCallback(() => {
        return layerDefinitions
            .filter((layer) => layer.controllable)
            .map((layer) => (
                <li
                    key={`layer-control-${layer.id}`}
                    className="p-1 text-text-default"
                >
                    <div className="flex items-center justify-between">
                        <label
                            className="font-large mr-1"
                            htmlFor={`toggle-${layer.id}`}
                        >
                            <input
                                type="checkbox"
                                id={`toggle-${layer.id}`}
                                name={layer.id}
                                checked={visibleLayers[layer.id]}
                                onChange={(e) => handleChange(e, true)}
                                className="mr-1"
                                aria-labelledby={`toggle-label-${layer.id}`}
                            />
                            <span id={`toggle-label-${layer.id}`}>
                                {getLayerName(layer.id)}
                            </span>
                        </label>
                    </div>

                    {(layer.subLayers ?? []).length > 0 && (
                        <ul className="ml-6">
                            {(layer.subLayers ?? [])
                                .filter((sublayer) => sublayer.controllable)
                                .map((sublayer) => (
                                    <li
                                        key={`layer-control-${layer.id}-${sublayer.id}`}
                                        className="p-1 flex items-center justify-between"
                                    >
                                        <label
                                            className="font-large mr-1"
                                            htmlFor={`toggle-${sublayer.id}`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`toggle-${sublayer.id}`}
                                                name={sublayer.id}
                                                checked={
                                                    visibleLayers[sublayer.id]
                                                }
                                                onChange={(e) =>
                                                    handleChange(e, false)
                                                }
                                                className="mr-1"
                                                aria-labelledby={`toggle-label-${sublayer.id}`}
                                            />
                                            <span
                                                id={`toggle-label-${sublayer.id}`}
                                            >
                                                {getLayerName(sublayer.id)}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                        </ul>
                    )}
                </li>
            ));
    }, [visibleLayers, layerDefinitions, getLayerName, handleChange]);

    return (
        <>
            <h6 className="text-lg font-bold mb-1">Layers</h6>
            <ul>{renderToggles()}</ul>
        </>
    );
};
