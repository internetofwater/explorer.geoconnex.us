// Model the camera, target point, and elevation difference as a right triangle.
// atan(elevation / distance) computes the angle above the horizon to the target.
// Mapbox GL JS pitch is measured from straight down (0°) toward the horizon (90°),
// so we convert the elevation angle into a Mapbox pitch by calculating:
//
// pitch = 90° - atan(elevation / distance)
export const calculatePitch = (elevation: number, distance: number) =>
    90 - Math.atan(elevation / distance) * (180 / Math.PI);
