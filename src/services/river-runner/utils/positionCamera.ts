import { Position } from 'geojson';
import { Map, MercatorCoordinate } from 'mapbox-gl';

export const positionCamera = ({
    map,
    cameraCoordinates,
    elevation,
    pitch,
    bearing,
}: {
    map: Map;
    cameraCoordinates: Position;
    elevation: number;
    pitch: number;
    bearing: number;
}) => {
    const camera = map.getFreeCameraOptions();

    // SL: set the position and altitude of the camera
    camera.position = MercatorCoordinate.fromLngLat(
        {
            lng: cameraCoordinates[0],
            lat: cameraCoordinates[1],
        },
        elevation
    );

    camera.setPitchBearing(pitch, bearing);
    map.setFreeCameraOptions(camera);
};
