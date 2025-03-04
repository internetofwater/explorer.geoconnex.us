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
                >
                    <div className="flex items-center justify-between">
                        <label className="font-large mr-1">
                            <input
                                type="checkbox"
                                name={layer.id}
                                checked={visibleLayers[layer.id]}
                                onChange={(e) => handleChange(e, true)}
                                className="mr-1"
                            />
                            {getLayerName(layer.id)}
                        </label>
                        {/* {getLayerColor(layer.id) &&
                            typeof getLayerColor(layer.id) === 'string' && (
                                <HorizontalLine
                                    key={`layer-control-${layer.id}-color`}
                                    color={getLayerColor(layer.id) as string}
                                />
                            )} */}
                    </div>

                    {layer.subLayers &&
                        layer.subLayers.length > 0 &&
                        layer.subLayers
                            .filter((sublayer) => sublayer.controllable)
                            .map((sublayer) => (
                                <div
                                    key={`layer-control-${layer.id}-${sublayer.id}`}
                                    className="ml-6 p-1 flex items-center justify-between"
                                >
                                    <label className="font-large mr-1">
                                        <input
                                            type="checkbox"
                                            name={sublayer.id}
                                            checked={visibleLayers[sublayer.id]}
                                            onChange={(e) =>
                                                handleChange(e, false)
                                            }
                                            className="mr-1"
                                        />
                                        {getLayerName(sublayer.id)}
                                    </label>
                                    {/* {getLayerColor(sublayer.id) &&
                                    typeof getLayerColor(sublayer.id) ===
                                        'string' && (
                                        <HorizontalLine
                                            key={`layer-control-${layer.id}-${sublayerId}-color`}
                                            color={
                                                getLayerColor(
                                                    sublayerId
                                                ) as string
                                            }
                                        />
                                    )} */}
                                </div>
                            ))}
                </div>
            ));
    }, [visibleLayers]);

    return (
        <>
            <h6 className="text-lg font-bold mb-1">Layers</h6>
            {renderToggles()}
        </>
    );
};
