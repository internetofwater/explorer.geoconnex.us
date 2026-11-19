export const CONFIG = {
    simple: {
        featureTypes: ['flowlines'],
    },
    advanced: {
        featureTypes: ['flowlines', 'nwissite', 'ca_gages', 'wqp', 'wade'],
    },
} as const;

export type TRiverRunnerConfig = typeof CONFIG;
