import Card from '@/app/components/common/Card';
import { Toggles } from '@/app/components/Map/tools/Toggles';
import { setLayerVisibility, setSelectedBasemap } from '@/lib/state/main/slice';
import { AppDispatch, RootState } from '@/lib/state/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayerId,
    layerDefinitions,
    getLayerColor,
    getLayerName,
    getLayerConfig,
} from '@/app/features/MainMap/config';
import IconButton from '@/app/components/common/IconButton';
import { Legend } from '@/app/components/Map/tools/Legend';
import { LayerSpecification } from 'mapbox-gl';
import LayerIcon from '@/app/assets/icons/Layer';
import ControlsIcon from '@/app/assets/icons/Controls';
import LegendIcon from '@/app/assets/icons/Legend';
import CircleIcon from '@/app/assets/icons/Circle';
import Square from '@/app/assets/icons/Square';
import { BasemapStyles } from '@/app/components/Map/types';
import BasemapSelector from '@/app/components/Map/tools/BasemapSelector';
import BasemapIcon from '@/app/assets/icons/Basemap';

/**
 * This component provides tools for interacting with the map, including toggles for layer visibility and a legend.
 * It allows users to show or hide map tools, layer toggles, and the legend.
 *
 * @component
 */
export const MapTools: React.FC = () => {
    const { visibleLayers, selectedBasemap } = useSelector(
        (state: RootState) => state.main
    );

    const dispatch: AppDispatch = useDispatch();

    const [showTools, setShowTools] = useState(false);
    const [showLayerToggle, setShowLayerToggle] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [showBasemap, setShowBasemap] = useState(false);

    const handleLayerVizChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        isPrimary: boolean
    ) => {
        const { name, checked } = event.target;
        if (isPrimary) {
            const layerId = name as LayerId;
            const layerDef = layerDefinitions.find(
                (layerDef) => (layerDef.id as LayerId) === layerId
            );
            dispatch(setLayerVisibility({ [layerId]: checked }));
            if (layerDef?.subLayers?.length) {
                layerDef.subLayers.forEach((subLayer) =>
                    dispatch(setLayerVisibility({ [subLayer.id]: checked }))
                );
            }
        } else {
            const subLayerId = name as LayerId;
            dispatch(setLayerVisibility({ [subLayerId]: checked }));
        }
    };

    const handleBasemapChange = (style: BasemapStyles) => {
        dispatch(setSelectedBasemap(style));
    };

    return (
        <>
            <div className="flex flex-col items-end lg:items-center lg:flex-row-reverse space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
                <IconButton
                    title={`${showTools ? 'Hide' : 'Show'} Map Tools`}
                    onClick={() => {
                        setShowLegend(false);
                        setShowLayerToggle(false);
                        setShowBasemap(false);
                        setShowTools(!showTools);
                    }}
                    className="ml-2"
                >
                    <ControlsIcon />
                </IconButton>
                {showTools && (
                    <>
                        <IconButton
                            title={`${showLegend ? 'Hide' : 'Show'} Legend`}
                            onClick={() => {
                                setShowBasemap(false);
                                setShowLayerToggle(false);
                                setShowLegend(!showLegend);
                            }}
                        >
                            <LegendIcon />
                        </IconButton>
                        <IconButton
                            title={`${
                                showBasemap ? 'Hide' : 'Show'
                            } Basemap Selector`}
                            onClick={() => {
                                setShowLegend(false);
                                setShowLayerToggle(false);
                                setShowBasemap(!showBasemap);
                            }}
                            className="p-2"
                        >
                            <BasemapIcon />
                        </IconButton>
                        <IconButton
                            title={`${
                                showLayerToggle ? 'Hide' : 'Show'
                            } Layer Toggles`}
                            onClick={() => {
                                setShowBasemap(false);
                                setShowLegend(false);
                                setShowLayerToggle(!showLayerToggle);
                            }}
                        >
                            <LayerIcon />
                        </IconButton>
                        {/* Add legend and other tools here */}
                    </>
                )}
            </div>
            {showLayerToggle && (
                <Card
                    className="mt-2 w-60"
                    handleClose={() => setShowLayerToggle(false)}
                >
                    <Toggles
                        visibleLayers={visibleLayers}
                        layerDefinitions={layerDefinitions}
                        handleChange={handleLayerVizChange}
                        getLayerColor={getLayerColor as (id: string) => string}
                        getLayerName={getLayerName as (id: string) => string}
                    />
                </Card>
            )}
            {showLegend && (
                <Card
                    className="mt-1 w-60"
                    handleClose={() => setShowLegend(false)}
                >
                    <Legend
                        visibleLayers={visibleLayers}
                        layerDefinitions={layerDefinitions}
                        getLayerColor={getLayerColor as (id: string) => string}
                        getLayerName={getLayerName as (id: string) => string}
                        getLayerConfig={
                            getLayerConfig as (
                                id: string
                            ) => null | LayerSpecification
                        }
                        custom={
                            <>
                                <div className="-mt-2">
                                    <div className="flex items-center">
                                        <div className="mr-1">
                                            <Square
                                                fill="#FFF"
                                                stroke="#000"
                                                height={8}
                                            />
                                        </div>
                                        {getLayerName(LayerId.HUC2Boundaries)}
                                    </div>
                                    <span className="font-bold">
                                        Dataset Clusters
                                    </span>
                                    <span className="flex">
                                        <CircleIcon color="#91bfdb" />
                                        &lt; 50
                                    </span>
                                    <span className="flex">
                                        <CircleIcon color="#ffffbf" />
                                        &gt;= 50
                                    </span>
                                    <span className="flex">
                                        <CircleIcon color="#fc8d59" />
                                        &gt;= 200
                                    </span>
                                </div>
                            </>
                        }
                    />
                </Card>
            )}
            {showBasemap && (
                <Card
                    className="mt-2 w-72"
                    handleClose={() => setShowBasemap(false)}
                >
                    <BasemapSelector
                        style={selectedBasemap}
                        handleStyleChange={handleBasemapChange}
                    />
                </Card>
            )}
        </>
    );
};
