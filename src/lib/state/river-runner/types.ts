import { TRunSettings } from '@/services/river-runner/types';
import { LngLatBoundsLike } from 'mapbox-gl';

export const STATUS_TYPE = {
    External: 'external', // We are outside the river runner
    Uninitialized: 'unitialized', // Pre run but within river runner
    Calculating: 'calculating', // Performing key calculations/fetches NOTE: should this all be within loading manager?
    Overview: 'overview', // High level view of the run, last pre-run status
    Running: 'running', // We are in an active river run
    Error: 'error',
} as const;

export type TStatusType = (typeof STATUS_TYPE)[keyof typeof STATUS_TYPE];

type TFlags = {
    abort: boolean; // Cancel the run
    // NOTE: this functionality continues to execute animation frames and create function contexts while paused
    paused: boolean; // Block animation frames
};

export const SCALE_TYPE = {
    National: 'national',
    State: 'state',
    County: 'county',
};

export type TScaleType = (typeof SCALE_TYPE)[keyof typeof SCALE_TYPE];

type TScale = {
    type: TScaleType;
    coordinates: LngLatBoundsLike; // TODO: confirm correct type
};

type TSegment = {
    stop: string | null; // This is the feature name that we are working towards
    start: string | null; // This is the placename that we are starting from, result of mapbox reverse geocoding
};

export type TInitialState = {
    status: TStatusType;
    flags: TFlags;
    segment: TSegment;
    scale: TScale | null; // The current view in the minimap
    runs: TRunSettings[]; // This will be a simplified history of any runs already taken, TODO
    featureIndex: number | null; // What feature are we actively viewing
    phaseJump: number | null; // Allow users to jump ahead in the viewing
};

export const initialState: TInitialState = {
    status: 'external',
    flags: {
        abort: false,
        paused: false,
    },
    segment: {
        stop: null,
        start: null,
    },
    scale: null,
    runs: [],
    featureIndex: null,
    phaseJump: null,
};
