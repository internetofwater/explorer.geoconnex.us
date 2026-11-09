/* eslint-disable @typescript-eslint/no-unused-vars */
// This is temporary to allow a clean build
'use client';

import type { LngLatLike, Map } from 'mapbox-gl';
import {
    TMapInteraction,
    TNLDIVAAFeature,
    TNLDIFeature,
    TNLDIFlowlineExtendedFeature,
    TFlowlineFeatureCollection,
    TFlowlineFeature,
    TStoppingFeatureCollection,
    TUSStateFeatureCollection,
    TRunSettings,
    TFrameSettings,
} from '@/services/river-runner/types';
import { RiverRunnerStateService } from '@/services/river-runner/river-runner.state';
import LoadingManager from '@/managers/loading.manager';
import NotificationManager from '@/managers/notification.manager';
import { RiverRunnerDataService } from '@/services/river-runner/river-runner.data';
import { applyVAAData } from '@/services/river-runner/utils/applyVAAData';
import { Position } from 'geojson';
import { CONFIG, TRiverRunnerConfig } from '@/services/river-runner/config';
import { along, distance, featureCollection, lineString } from '@turf/turf';
import { getFeatureGroups } from '@/services/river-runner/utils/getFeatureGroups';
import { determineStoppingFeature } from '@/services/river-runner/utils/determineStoppingFeature';
import { getElevationsMapQuery } from '@/services/river-runner/utils/getElevationsMapQuery';
import { pathSmoother } from '@/services/river-runner/utils/pathSmoother';
import {
    bearingBetween,
    findArtificialCameraPoint,
} from '@/services/river-runner/utils/findArtificialCameraPoint';
import { pathDistance } from '@/services/river-runner/utils/pathDistance';
import { calculatePitch } from '@/services/river-runner/utils/calculatePitch';
import { positionCamera } from '@/services/river-runner/utils/positionCamera';
import { getDataBounds } from '@/services/river-runner/utils/getDataBounds';

export type TRiverRunnerDependencies = {
    loadingManager: LoadingManager;
    notificationManager: NotificationManager;
    stateService: RiverRunnerStateService;
    dataService: RiverRunnerDataService;
};

// SL: Zoom level won't be adjustable on mobile, but it will be set slightly higher to avoid jiterriness
// const DEFAULT_ALTITUDE_MULTIPLIER = window?.innerWidth < 600 ? 1.1 : 0.8;
const DEFAULT_ALTITUDE_MULTIPLIER = 0.8;

const DEFAULT_DRIVER = {
    altitudeMultiplier: DEFAULT_ALTITUDE_MULTIPLIER,
    playbackSpeed: 1,
};

type TDriver = typeof DEFAULT_DRIVER;

export class RiverRunnerService {
    private deps: TRiverRunnerDependencies;
    protected map: Map | null = null;
    private advanced: boolean;
    private states: TUSStateFeatureCollection | null = null;
    private stoppingFeatures: TStoppingFeatureCollection | null = null;
    public driver: TDriver;

    constructor(
        deps: TRiverRunnerDependencies,
        advanced: boolean = false,
        driver: TDriver = DEFAULT_DRIVER
    ) {
        this.deps = deps;
        this.advanced = advanced;
        this.driver = structuredClone(driver);
    }

    async loadUSStates() {
        this.states = (await this.deps.dataService.getUSStates()) ?? null;

        return Boolean(this.states);
    }

    async loadStoppingFeatures() {
        this.stoppingFeatures =
            (await this.deps.dataService.getStoppingFeatures()) ?? null;

        return Boolean(this.stoppingFeatures);
    }

    setMap(map: Map) {
        this.map = map;
    }

    private hasMap(): this is this & { map: Map } {
        return this.map !== null;
    }

    private reset() {
        this.enableMapInteractions();
        this.deps.stateService.setFlag({ abort: false });
        // TODO: this is incomplete
    }

    private disableMapInteractions() {
        if (!this.hasMap()) {
            // TODO: handling
            console.error('No map provided');
            return;
        }

        this.map._interactive = false;
        this.map.scrollZoom.disable();
    }

    private enableMapInteractions() {
        if (!this.hasMap()) {
            // TODO: handling
            console.error('No map provided');
            return;
        }

        this.map._interactive = true;
        this.map.scrollZoom.enable();
    }

    private async addVAAData(
        flowlineFeatures: TFlowlineFeature[],
        signal?: AbortSignal
    ): Promise<Array<TNLDIVAAFeature>> {
        const thinningIndex = Math.ceil(flowlineFeatures.length / 250);

        return Promise.all(
            flowlineFeatures.map(async (feature, index) => {
                if (index > 50 && index % thinningIndex !== 0) {
                    return {
                        ...feature,
                        properties: {
                            ...feature.properties,
                            gnis_name: null,
                            lengthkm: null,
                            levelpathid: null,
                            pathlength: null,
                            streamlvl: null,
                            terminalfl: null,
                            feature_name: null,
                            feature_id: null,
                        },
                    };
                }

                const vaa = await this.deps.dataService.getFeatureVAA(
                    feature.properties.nhdplus_comid,
                    signal
                );

                if (vaa) {
                    return applyVAAData(feature, vaa);
                }

                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        gnis_name: null,
                        lengthkm: null,
                        levelpathid: null,
                        pathlength: null,
                        streamlvl: null,
                        terminalfl: null,
                        feature_name: null,
                        feature_id: null,
                    },
                };
            })
        );
    }

    private async addFlowRate(
        flowlineFeatures: TFlowlineFeature[],
        thinningIndex = 4,
        bufferSize = 50,
        signal?: AbortSignal
    ): Promise<Array<TNLDIFlowlineExtendedFeature>> {
        const flowrateData = await Promise.all(
            flowlineFeatures.map(async (feature, index) => {
                if (index > bufferSize && index % thinningIndex !== 0) {
                    return {
                        ...feature,
                        properties: {
                            ...feature.properties,
                            flowRate: undefined,
                        },
                    };
                }

                const response = await this.deps.dataService.getFeatureFlowRate(
                    feature.properties.nhdplus_comid,
                    signal
                );

                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        flowRate:
                            response?.flowrate == null
                                ? undefined
                                : Number(response.flowrate),
                    },
                };
            })
        );

        flowrateData.forEach((feature, index) => {
            if (index <= bufferSize || index % thinningIndex === 0) {
                return;
            }

            const lastIndex = thinningIndex * Math.floor(index / thinningIndex);

            const nextIndex = thinningIndex * Math.ceil(index / thinningIndex);

            const lastValue = flowrateData[lastIndex]?.properties.flowRate;

            const nextValue = flowrateData[nextIndex]?.properties.flowRate;

            if (lastValue == null) {
                return;
            }

            feature.properties.flowRate =
                nextValue != null
                    ? Math.ceil(
                          lastValue +
                              (nextValue - lastValue) *
                                  ((index % thinningIndex) / thinningIndex)
                      )
                    : lastValue;
        });

        return flowrateData;
    }

    private async getElevations(
        coordinatePath: Position[],
        arrayStep: number = 10
    ) {
        const elevationCoordinates = coordinatePath.filter((element, index) => {
            return index % arrayStep === 0;
        });

        const responses = await Promise.all(
            elevationCoordinates.map(([lng, lat]) =>
                this.deps.dataService.getElevationAtPosition({ lng, lat })
            )
        );

        // TODO: handle undefined responses

        const data = responses
            .flatMap((res) =>
                res ? [res.features.slice(-1)[0].properties.ele] : []
            )
            .map((d, i, n) => {
                if (d) {
                    return d;
                } else if (i === 0) {
                    return n[i + 1];
                } else {
                    return n[i - 1];
                }
            });

        return data;
    }

    private async createNLDIFeatures(
        closestFeature: TNLDIFeature,
        featureTypes:
            | TRiverRunnerConfig['simple']['featureTypes']
            | TRiverRunnerConfig['advanced']['featureTypes']
    ) {
        const [flowlinesData] = await Promise.all(
            featureTypes.map((siteType) =>
                this.deps.dataService.getSiteData(
                    closestFeature.properties.navigation,
                    siteType
                )
            )
        );

        // TODO: handling for additional feature types beyond flowlines (if needed)

        return flowlinesData as TFlowlineFeatureCollection;
    }

    private precalculateInitialCamera({
        cameraStart,
        initialElevation,
        initialBearing,
        cameraPitch,
        smoothedPath,
        distanceGap,
        routeDistance,
    }: {
        cameraStart: Position;
        initialElevation: number;
        initialBearing: number;
        cameraPitch: number;
        smoothedPath: Position[];
        distanceGap: number;
        routeDistance: number;
    }) {
        if (!this.hasMap()) {
            // TODO: handling
            console.error('No map provided');
            return { zoom: -1, center: [-1, -1] as LngLatLike };
        }

        // SL: Store current camera info
        const currentZoom = this.map.getZoom();
        const currentCenter = this.map.getCenter();
        const currentBearing = this.map.getBearing();
        const currentPitch = this.map.getPitch();

        let alongTarget = along(
            lineString(smoothedPath),
            routeDistance * 0.000005
        ).geometry.coordinates;

        if (alongTarget === smoothedPath[0]) {
            alongTarget = smoothedPath[1];
        }

        const alongCamera = findArtificialCameraPoint({
            distanceGap: this.driver.altitudeMultiplier * distanceGap,
            originPoint: smoothedPath[0],
            targetPoint: alongTarget,
        });

        const bearing = bearingBetween(alongCamera, alongTarget);

        // SL: Position the camera how it will be positioned on the first tick of the run
        positionCamera({
            map: this.map,
            cameraCoordinates: alongCamera,
            elevation: initialElevation,
            bearing,
            pitch: cameraPitch,
        });

        // SL: Log the zoom/center
        const zoom = this.map.getZoom();
        const center = this.map.getCenter();

        // SL: Send the camera back to where it came from, without user seeing anything
        this.map.jumpTo({
            zoom: currentZoom,
            center: currentCenter,
            bearing: currentBearing,
            pitch: currentPitch,
        });

        // SL: Return zoom and center so that we can fly to the exact start point and it won't be jarring when the run starts
        return { zoom, center };
    }

    async initialize(e: TMapInteraction) {
        if (!this.hasMap()) {
            // TODO: handling
            console.error('No map provided');
            return;
        }

        if (!this.states) {
            // TODO: handling
            console.error('Missing states');
            return;
        }

        if (!this.stoppingFeatures) {
            // TODO: handling
            console.error('Missing stopping features');
            return;
        }

        if (!this.deps.dataService.hasAccessToken()) {
            // TODO: handling
            console.error('Missing access token');
            return;
        }

        // Currently processing a previous click
        // _interactive can be undefined, which is valid for running RR
        if (this.map._interactive === false) {
            console.warn('Duplicate call to initialize River Runner');
            return;
        }

        this.disableMapInteractions();

        const closestFeature = await this.deps.dataService.findClosestFeature(
            e.lngLat
        );

        if (this.deps.stateService.hasAborted()) {
            this.reset();
            return;
        }

        if (!closestFeature) {
            this.deps.stateService.setStatus('error');
            this.reset();
            return;
        }

        // SL: Get downstream flowline path from origin point, as well as any data on NWIS Sites, Reference Gages, WQP Sites, WaDE Sites
        const featureTypes = this.advanced
            ? CONFIG.advanced.featureTypes
            : CONFIG.simple.featureTypes;
        const flowlinesData = await this.createNLDIFeatures(
            closestFeature,
            featureTypes
        );

        // SL: Append VAA data/flowrate data from firebase to flowline data
        // SL: Leaving this commented out as this feature has been indicated to be unneeded
        const extendedFlowLines = featureCollection(
            await this.addVAAData(flowlinesData.features)
        );

        let flowRates: number[] = [],
            maxFlowRate: number;
        if (this.advanced) {
            const flowRateFeatures = await this.addFlowRate(
                flowlinesData.features
            );
            flowRates = flowRateFeatures.flatMap((d) =>
                d.properties.flowRate ? [d.properties.flowRate] : []
            );
            // SL: Set max flowrate for gauge. Max defaults to 20,000 cubic feet/second, but will go up if there's a higher value in the current path's set
            maxFlowRate = Math.max(...flowRates, 20000);
        }

        // SL: Find the parent features of flowlines along the path
        const totalLength =
            extendedFlowLines.features[0].properties.pathlength &&
            extendedFlowLines.features[0].properties.pathlength > 0
                ? extendedFlowLines.features[0].properties.pathlength
                : undefined;
        const riverFeatures = getFeatureGroups(extendedFlowLines);
        const featureGroups = riverFeatures;

        // SL: Find start and end points
        const startRiver = extendedFlowLines.features[0];
        const originPoint = startRiver.geometry.coordinates[0];
        const destinationPoint = extendedFlowLines.features
            .slice(-1)[0]
            .geometry.coordinates.slice(-1)[0];

        // SL: Construct full coordinate path by taking the first coordinate in each flowline (each coordinate in the flowline is an unnecessary level of detail)
        const coordinatePath =
            extendedFlowLines.features.length > 3
                ? [
                      extendedFlowLines.features[0].geometry.coordinates[0],
                      ...extendedFlowLines.features.map(
                          (feature) => feature.geometry.coordinates.slice(-1)[0]
                      ),
                  ]
                : extendedFlowLines.features
                      .map((feature) => feature.geometry.coordinates)
                      .flat()
                      .filter((d, i) => i % 2 === 0);

        // SL: Update props used by child components
        // TODO: emit these
        const riverPath = [{ geometry: { coordinates: coordinatePath } }];
        const currentLocation = originPoint;
        this.deps.stateService.setStatus('calculating');

        // SL: Determine stopping feature by finding closest feature in stopping feature dataset
        const pathStoppingFeature = determineStoppingFeature({
            destinationPoint,
            stoppingFeatures: this.stoppingFeatures.features,
        });

        if (pathStoppingFeature) {
            this.deps.stateService.setStop(pathStoppingFeature);
        }

        // SL: Draw river lines from flowline features. Combining them avoids mapbox simplification on low zoom levels that creates a choppy looking flow path.
        const combinedFlowlines = flowlinesData.features[0];
        combinedFlowlines.geometry.coordinates = flowlinesData.features
            .map((a) => a.geometry.coordinates)
            .flat();
        // TODO: use better approach
        // drawFlowPath({ map, featureData: [combinedFlowlines], lineWidth: 3 });

        let terrainElevationMultiplier = 1;
        let cameraBaseAltitude = 3600;
        const elevationArrayStep = Math.min(coordinatePath.length / 2 - 1, 100);

        let elevations = getElevationsMapQuery(
            coordinatePath,
            this.map,
            elevationArrayStep
        );

        if (elevations.includes(null)) {
            elevations = await this.getElevations(
                coordinatePath,
                elevationArrayStep
            );
            cameraBaseAltitude = 4300;
            terrainElevationMultiplier = 1.25;
        }

        const safeElevations = elevations.flatMap((e) =>
            typeof e === 'number' ? [e] : []
        );

        // SL: Take base altitude and then adjust up based on the elevation of the first coordinate
        // The multiplier is necessary for higher elevations since they tend to be mountainous areas, as well, requiring additional height for the camera
        const initialElevation =
            cameraBaseAltitude +
            this.driver.altitudeMultiplier *
                terrainElevationMultiplier *
                Math.round(safeElevations[0]);

        const targetPitch = 69;
        const distanceGap =
            (initialElevation * Math.tan((targetPitch * Math.PI) / 180)) / 1000;

        // SL: Create smoothed path by averaging coordinates with their neighbors. This helps reduce horizontal movement with bendy rivers.
        // const smoothedPath = pathSmoother(coordinatePath, Math.min(9, Math.floor(coordinatePath.length / 2)));
        const smoothedPath = pathSmoother(
            coordinatePath,
            Math.min(
                Math.floor(9 * this.driver.altitudeMultiplier),
                Math.floor(coordinatePath.length / 2)
            )
        );

        const routeDistance = pathDistance(smoothedPath);
        // const trueRouteDistance = pathDistance(coordinatePath);

        let firstBearingPoint = along(
            lineString(smoothedPath),
            routeDistance * 0.00005
        ).geometry.coordinates;

        if (firstBearingPoint === smoothedPath[0]) {
            firstBearingPoint = smoothedPath[1];
        }
        const cameraStart = findArtificialCameraPoint({
            distanceGap: this.driver.altitudeMultiplier * distanceGap,
            originPoint: smoothedPath[0],
            targetPoint: firstBearingPoint,
        });

        const initialBearing = bearingBetween(cameraStart, smoothedPath[0]);

        // SL: We'll calculate the pitch based on the altitude/distance from camera to target
        const cameraPitch = calculatePitch(
            initialElevation,
            1000 * distance(cameraStart, smoothedPath[0])
        );

        // TODO: Hide geocoder if still visible (share link)

        // SL: Pre-calculate initial camera center/zoom based on starting coordinates, so that flyTo function can end in correct place
        const { zoom, center } = this.precalculateInitialCamera({
            cameraStart,
            initialElevation,
            initialBearing,
            cameraPitch,
            smoothedPath,
            distanceGap,
            routeDistance,
        });

        // SL: Maintain a consistent speed using the route distance. The higher the speed coefficient, the slower the runner will move.
        const speedCoefficient =
            smoothedPath.length < 50 ? 200 : 185 - 5 * (cameraPitch - 70);
        const animationDuration = Math.round(speedCoefficient * routeDistance);

        const settings: TRunSettings = {
            zoom,
            center,

            cameraBaseAltitude,
            pitch: cameraPitch,
            initialBearing,

            paths: {
                coordinate: coordinatePath,
                smoothed: smoothedPath,
            },

            distance: routeDistance,
            gap: distanceGap,

            terrain: {
                elevations: safeElevations,
                multiplier: terrainElevationMultiplier,
            },

            features: riverFeatures,
            flowRates: flowRates,
            duration: animationDuration,
        };

        if (window?.innerWidth > 600) {
            this.deps.stateService.setStatus('overview');
            this.map.scrollZoom.enable();
            this.deps.stateService.saveRun(settings);
            // TODO: This needs to be cancelable
            setTimeout(() => {
                this.startRun(settings);
            }, 5100);
        } else {
            this.startRun(settings);
        }
    }

    private startRun(settings: TRunSettings) {
        if (!this.hasMap()) {
            // TODO: handling
            console.error('No map provided');
            return;
        }

        this.map.scrollZoom.disable();

        // Use default playback speed and altitude multiplier
        this.driver = DEFAULT_DRIVER;
        this.deps.stateService.setFlag({ paused: false });

        // SL: Fly to clicked point and pitch camera (initial "raindrop" animation)
        this.map.flyTo({
            center: settings.center,
            zoom: settings.zoom,
            speed: 0.9,
            curve: 1,
            pitch: settings.pitch,
            bearing: settings.initialBearing,
            easing(t) {
                return t;
            },
        });

        this.deps.stateService.setStatus('running');

        this.map.once('moveend', () => {
            this.map._interactive = true;

            // SL: When "raindrop" animation (flyto) is finished, begin the river run
            this.runRiver(settings);
        });
    }

    private runRiver(settings: TRunSettings) {
        if (!this.hasMap()) {
            // TODO: handling
            console.error('No map provided');
            return;
        }

        const startPoints = settings.features.map((d) => d.progress);
        const start = startPoints[0];

        const stopPoints = settings.features.map((d) => d.stop_point);
        const stop = stopPoints[0] ?? null; // reduce to just number or null
        this.deps.stateService.setActiveFeatureIndex(0);

        const route = pathSmoother(
            settings.paths.smoothed,
            Math.min(
                Math.floor(9 * this.driver.altitudeMultiplier),
                Math.floor(settings.paths.coordinate.length / 2)
            )
        );
        const routeDistance = pathDistance(route);

        const frameSettings: TFrameSettings = {
            startTime: undefined,
            phase: 0,
            tick: 0,
            lastTime: undefined,
            phaseGap: settings.gap / routeDistance,
            segment: {
                start,
                stop,
            },
            // SL: This adjusts the run speed based on the altitude. It seems *very* complicated, but it's the closest I've come to keeping perceptual speed consistent.
            speedCoefficient:
                1 /
                Math.pow(
                    1 + 1.1 * Math.log(this.driver.altitudeMultiplier),
                    1.25
                ),
        };

        const frame = (time: number) => {
            if (frameSettings.startTime === undefined) {
                frameSettings.startTime = frameSettings.lastTime = time;
            }

            let activeFeatureIndex =
                this.deps.stateService.getActiveFeatureIndex();

            if (activeFeatureIndex === null) {
                return;
            }

            // SL: If a user has clicked one of the features in the navigation box, we'll need to adjust the "phase" to jump to that feature
            const phaseJump = this.deps.stateService.getPhaseJump();
            if (phaseJump !== null) {
                frameSettings.phase = phaseJump;
                frameSettings.segment.start = startPoints[activeFeatureIndex];
                frameSettings.segment.stop =
                    stopPoints[activeFeatureIndex] ?? null;

                this.deps.stateService.setPhaseJump(null);
            }

            // TODO:
            // if (altitudeChange) {
            //     route = pathSmoother(
            //         coordinatePath,
            //         Math.min(
            //             Math.floor(9 * altitudeMultiplier),
            //             Math.floor(coordinatePath.length / 2)
            //         )
            //     );
            //     routeDistance = pathDistance(route);

            //     phaseGap = distanceGap / routeDistance;

            //     // This adjusts the run speed based on the altitude. It seems *very* complicated, but it's the closest I've come to keeping perceptual speed consistent.
            //     speedCoefficient =
            //         1 / Math.pow(1 + 1.1 * Math.log(altitudeMultiplier), 1.25);

            //     altitudeChange = false;
            // }

            // SL: phase determines how far through the animation we are
            if (!this.deps.stateService.hasPaused()) {
                frameSettings.phase +=
                    this.driver.playbackSpeed *
                    ((time - (frameSettings.lastTime ?? 0)) /
                        (settings.duration * frameSettings.speedCoefficient));
            }

            // SL: If rewinding and user rewinds past the start, this will puase it and keep it from bugging out
            if (frameSettings.phase < 0) {
                frameSettings.phase = 0;
                this.driver.playbackSpeed = 1;

                this.deps.stateService.setFlag({ paused: true });
            }

            frameSettings.lastTime = time;

            // const adjustedTargetPhase = this.driver.altitudeMultiplier * frameSettings.phaseGap + frameSettings.phase;

            // SL: When finished, exit animation loop and zoom out to show ending point
            if (
                frameSettings.phase > 1 ||
                this.deps.stateService.hasAborted()
            ) {
                // TODO: exitNavigation({ map, coordinatePath });
                return;
            }

            // SL: When you hit next feature group, adjust index
            if (
                frameSettings.segment.stop &&
                frameSettings.phase >= frameSettings.segment.stop
            ) {
                activeFeatureIndex += 1;
                frameSettings.segment.start = frameSettings.segment.stop;
                frameSettings.segment.stop =
                    stopPoints[activeFeatureIndex] ?? null;
            }

            // SL: If winding in reverse, and encountering a feature group change, do the reverse
            if (
                frameSettings.segment.start &&
                frameSettings.phase <= frameSettings.segment.start
            ) {
                activeFeatureIndex -= 1;
                frameSettings.segment.stop = frameSettings.segment.start;
                frameSettings.segment.start = startPoints[activeFeatureIndex];
            }

            // SL: Calculate camera elevation using the base elevation and the elevation at the specific coordinate point
            const elevationLast =
                settings.terrain.elevations[
                    Math.floor(
                        settings.terrain.elevations.length * frameSettings.phase
                    )
                ];
            const elevationNext =
                settings.terrain.elevations[
                    Math.ceil(
                        settings.terrain.elevations.length * frameSettings.phase
                    )
                ] ||
                settings.terrain.elevations[
                    Math.ceil(
                        settings.terrain.elevations.length * frameSettings.phase
                    ) - 1
                ];
            const elevationStepProgress =
                settings.terrain.elevations.length * frameSettings.phase -
                Math.floor(
                    settings.terrain.elevations.length * frameSettings.phase
                );

            const elevationEstimate =
                elevationLast +
                (elevationNext - elevationLast) * elevationStepProgress;
            const tickElevation =
                settings.cameraBaseAltitude +
                this.driver.altitudeMultiplier *
                    settings.terrain.multiplier *
                    Math.round(elevationEstimate);

            let alongTarget = along(
                lineString(route),
                routeDistance *
                    (frameSettings.phase === 0 ? 0.000005 : frameSettings.phase)
            ).geometry.coordinates;

            if (alongTarget === route[0]) {
                alongTarget = route[1];
            }

            const alongCamera =
                frameSettings.phase -
                    this.driver.altitudeMultiplier * frameSettings.phaseGap <
                0
                    ? findArtificialCameraPoint({
                          distanceGap:
                              this.driver.altitudeMultiplier * settings.gap,
                          originPoint: route[0],
                          targetPoint: alongTarget,
                      })
                    : along(
                          lineString(route),
                          routeDistance *
                              (frameSettings.phase -
                                  this.driver.altitudeMultiplier *
                                      frameSettings.phaseGap)
                      ).geometry.coordinates;

            const bearing = bearingBetween(alongCamera, alongTarget);

            // SL: Generate/position a camera along route, pointed in direction of target point at set pitch
            positionCamera({
                map: this.map,
                cameraCoordinates: alongCamera,
                elevation: tickElevation,
                pitch: settings.pitch ?? 70,
                bearing,
            });

            // SL: Set new flowrate value for water level gauge
            // JS TODO
            // currentFlowrate = {
            //     level: flowrates[Math.floor(flowrates.length * phase)],
            //     index: Math.floor(flowrates.length * phase),
            // };

            // SL: This will update the location of the marker on the locator map
            // JS TODO: this can be improved
            // if (tick % 5 === 0) {
            //     currentLocation = alongTarget;
            // }
            // tick += 1;

            window?.requestAnimationFrame(frame);
        };

        window?.requestAnimationFrame(frame);
    }

    private exitNavigation({ coordinatePath }: { coordinatePath: Position[] }) {
        if (!this.hasMap()) {
            // TODO: handling
            console.error('No map provided');
            return;
        }

        if (this.deps.stateService.hasAborted()) {
            this.deps.stateService.setActiveFeatureIndex(-1);
        } else {
            const activeFeatureIndex =
                this.deps.stateService.getActiveFeatureIndex();
            this.deps.stateService.setActiveFeatureIndex(
                (activeFeatureIndex ?? 0) + 1
            );
        }

        this.deps.stateService.setFlag({ abort: false });

        const bounds = getDataBounds(coordinatePath);

        this.map.fitBounds(bounds, {
            bearing: 0,
            pitch: 0,
            padding: 70,
            maxZoom: 12,
            //   offset: window.innerWidth < 600 ? [0, -20] : [0, 0], // On mobile, the search bar will get in the way so we actually want it a little off center
        });

        this.map.once('moveend', () => {
            this.deps.stateService.setStatus('overview');
            // TODO
            // postRun = true;

            this.enableMapInteractions();
        });
    }
}
