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

export const Toggles: React.FC<Props> = (props) => {
    const { visibleLayers, layerDefinitions, getLayerName, handleChange } =
        props;

    const renderToggles = useCallback(() => {
        return layerDefinitions
            .filter((layer) => layer.controllable)
            .map((layer) => (
                <div
                    key={`layer-control-${layer.id}`}
                    className="p-1 text-black"
                    role="listitem"
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
                                tabIndex={6}
                            />
                            <span id={`toggle-label-${layer.id}`}>
                                {getLayerName(layer.id)}
                            </span>
                        </label>
                    </div>

                    {layer.subLayers &&
                        layer.subLayers.length > 0 &&
                        layer.subLayers
                            .filter((sublayer) => sublayer.controllable)
                            .map((sublayer) => (
                                <div
                                    key={`layer-control-${layer.id}-${sublayer.id}`}
                                    className="ml-6 p-1 flex items-center justify-between"
                                    role="listitem"
                                >
                                    <label
                                        className="font-large mr-1"
                                        htmlFor={`toggle-${sublayer.id}`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`toggle-${sublayer.id}`}
                                            name={sublayer.id}
                                            checked={visibleLayers[sublayer.id]}
                                            onChange={(e) =>
                                                handleChange(e, false)
                                            }
                                            className="mr-1"
                                            aria-labelledby={`toggle-label-${sublayer.id}`}
                                            tabIndex={6}
                                        />
                                        <span
                                            id={`toggle-label-${sublayer.id}`}
                                        >
                                            {getLayerName(sublayer.id)}
                                        </span>
                                    </label>
                                </div>
                            ))}
                </div>
            ));
    }, [visibleLayers, layerDefinitions, getLayerName, handleChange]);

    return (
        <>
            <h6 className="text-lg font-bold mb-1">Layers</h6>
            <div role="list">{renderToggles()}</div>
        </>
    );
};
