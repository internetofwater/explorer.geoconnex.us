export const calculatePitch = (elevation: number, distance: number) =>
    90 - Math.atan(elevation / distance) * (180 / Math.PI);
