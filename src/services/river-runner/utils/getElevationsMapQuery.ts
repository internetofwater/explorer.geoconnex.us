import { Position } from 'geojson';
import { Map } from 'mapbox-gl';

export const getElevationsMapQuery = (
    coordinatePath: Position[],
    map: Map,
    arrayStep: number = 10
) => {
    const elevationCoordinates = coordinatePath.filter((element, index) => {
        return index % arrayStep === 0;
    });

    return elevationCoordinates.map((d) =>
        map.queryTerrainElevation(d as [number, number], { exaggerated: true })
    );
};
