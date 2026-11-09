import { lineString, length } from '@turf/turf';
import { Position } from 'geojson';

export const pathDistance = (coordinatePath: Position[]) =>
    length(lineString(coordinatePath));
