import {
    TFlowRateResponseRaw,
    TNLDIFeature,
    TNLDIFeatureCollection,
    TStoppingFeatureCollection,
    TStoppingFeatureProperties,
    TVAAResponse,
} from '@/services/river-runner/types';
import { TSuperFetchArgs } from '@/utils/superFetch/types';
import { superFetch } from '@/utils/superFetch';
import { LngLat } from 'mapbox-gl';
import { RiverRunnerStateService } from '@/services/river-runner/river-runner.state';
import NotificationManager from '@/managers/notification.manager';
import LoadingManager from '@/managers/loading.manager';
import { NOTIFICATION_TYPE } from '@/lib/state/notifications/types';
import { round } from '@/services/river-runner/utils/round';
import type { Topology, GeometryCollection } from 'topojson-specification';
import * as topojson from 'topojson-client';
import { FeatureCollection, MultiPolygon, Point, Polygon } from 'geojson';

export type TDataServiceDependencies = {
    stateService: RiverRunnerStateService;
    loadingManager: LoadingManager;
    notificationManager: NotificationManager;
};

export class RiverRunnerDataService {
    private deps: TDataServiceDependencies;
    private cache: Map<string, unknown>;
    protected accessToken: string | null = null;

    constructor(deps: TDataServiceDependencies) {
        this.deps = deps;
        this.cache = new Map<string, unknown>();
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;

        return Boolean(this.accessToken);
    }

    hasAccessToken(): this is this & { accessToken: string } {
        return this.accessToken !== null && this.accessToken.length > 0;
    }

    private async fetch<T>(
        config: Omit<TSuperFetchArgs<T>, 'cache'>
    ): Promise<T | undefined> {
        return superFetch<T>({
            ...config,
            cache: this.cache,
            onCatch:
                config.onCatch ??
                ((error) => {
                    console.error(error);
                    this.deps.notificationManager.show(
                        'An error occurred in the River Runner Data Service. Check the console for more details',
                        NOTIFICATION_TYPE.Error,
                        5000
                    );
                }),
        });
    }

    async findClosestFeature(
        coords: LngLat,
        signal?: AbortSignal
    ): Promise<TNLDIFeature | undefined> {
        const limit = 5;

        const { lng, lat } = round({ lng: coords.lng, lat: coords.lat }, limit);

        const url = new URL(
            'https://api.water.usgs.gov/nldi/linked-data/comid/position'
        );
        const params = new URLSearchParams({
            coords: `POINT(${lng} ${lat})`,
        });
        url.search = params.toString();

        let feature;
        for (let i = 0; i < limit; i++) {
            feature = await this.fetch({
                url: url.toString(),
                init: {
                    signal,
                },
                parse: async (r) => {
                    const result = (await r.json()) as TNLDIFeatureCollection;
                    return result.features[0];
                },
                getKey: () => `find-closest-feature-${params.toString()}`,
            });

            // Update the coordinates to be more rounded
            const { lng, lat } = round(
                { lng: coords.lng, lat: coords.lat },
                limit - (i + 1)
            );
            params.set('coords', `POINT(${lng} ${lat})`);
            url.search = params.toString();

            // We found a feature, return early
            if (feature) {
                break;
            }
        }

        return feature;
    }

    async getSiteData(baseURL: string, siteType: string, signal?: AbortSignal) {
        // Note: this is the downstream main of this mainstem, it is one of the results returned
        // by fetching the 'navigation link'
        const url = new URL(`${baseURL}/DM/${siteType}`);

        url.search = new URLSearchParams({
            distance: '6000',
        }).toString();

        return await this.fetch({
            url: url.toString(),
            init: {
                signal,
            },
            parse: async (r) => {
                return (await r.json()) as unknown; //TODO
            },
            getKey: () => `site-data-${baseURL}-${siteType}`,
        });
    }

    async getFeatureVAA(
        comid: number,
        signal?: AbortSignal
    ): Promise<TVAAResponse | undefined> {
        const url = new URL(
            `https://river-runner-20db3-default-rtdb.firebaseio.com/${comid}.json`
        );

        return await this.fetch({
            url: url.toString(),
            init: {
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            },
            parse: async (r) => {
                return (await r.json()) as TVAAResponse;
            },
            getKey: () => `feature-vaa-${comid}`,
        });
    }

    async getFeatureFlowRate(
        comid: number,
        signal?: AbortSignal
    ): Promise<TFlowRateResponseRaw | undefined> {
        const url = new URL(
            `https://river-runner-flowrates.firebaseio.com/${comid}.json`
        );

        return await this.fetch({
            url: url.toString(),
            init: {
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            },
            parse: async (r) => {
                return (await r.json()) as TFlowRateResponseRaw;
            },
            getKey: () => `feature-flow-rate-${comid}`,
        });
    }

    async getUSStates(
        signal?: AbortSignal
    ): Promise<
        FeatureCollection<Polygon | MultiPolygon, { name: string }> | undefined
    > {
        return await this.fetch({
            url: 'data/us_states.json',
            init: {
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            },
            parse: async (r) => {
                const data = (await r.json()) as Topology<{
                    states: GeometryCollection<{ name: string }>;
                    nation: GeometryCollection;
                }>;

                return topojson.feature<{ name: string }>(
                    data,
                    data.objects.states
                ) as FeatureCollection<
                    Polygon | MultiPolygon,
                    { name: string }
                >;
            },
        });
    }

    async getStoppingFeatures(
        signal?: AbortSignal
    ): Promise<TStoppingFeatureCollection | undefined> {
        return await this.fetch({
            url: 'data/stopping_features.json',
            init: {
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            },
            parse: async (r) => {
                const data = (await r.json()) as Topology<{
                    stopping_features: GeometryCollection<TStoppingFeatureProperties>;
                }>;

                return topojson.feature<TStoppingFeatureProperties>(
                    data,
                    data.objects.stopping_features
                ) as TStoppingFeatureCollection;
            },
        });
    }

    async getElevationAtPosition(
        { lng, lat }: { lng: number; lat: number },
        signal?: AbortSignal
    ) {
        if (!this.hasAccessToken()) {
            throw new Error('No Mapbox Access Token provided');
        }

        const url = new URL(
            `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lng},${lat}.json`
        );

        const params = new URLSearchParams({
            access_token: this.accessToken,
        });
        url.search = params.toString();

        return await this.fetch({
            url: url.toString(),
            init: {
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            },
            parse: async (r) => {
                return (await r.json()) as FeatureCollection<
                    Point,
                    {
                        ele: number;
                        index: number;
                        tilequery: {
                            distance: number;
                            geometry: 'polygon'; // This may be incomplete
                            layer: 'contour'; // This may be incomplete
                        };
                    }
                >;
            },
            getKey: () => `position-elevation-${lng}-${lat}`,
        });
    }
}
