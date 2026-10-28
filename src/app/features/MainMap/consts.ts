import { ExpressionSpecification, FilterSpecification } from 'mapbox-gl';

// HUC Ids for boundaries outside continental US
export const FILTERED_HUC_02 = ['19', '20', '21', '22'];
export const HUC_FILTER_EXPRESSION: ExpressionSpecification = [
    'match',
    ['get', 'HUC2'],
    FILTERED_HUC_02,
    false,
    true,
];

export type TMainstemSize = 'small' | 'medium' | 'large';

const BASE_PADDING = 20;

export const getPadding = (size: TMainstemSize): number => {
    switch (size) {
        case 'large':
            return BASE_PADDING * 1.5;
        case 'medium':
            return BASE_PADDING * 1.2;
        default:
        case 'small':
            return BASE_PADDING;
    }
};

export const getColor = (size: TMainstemSize): string => {
    switch (size) {
        case 'large':
            return '#08589e';
        case 'medium':
            return '#7bccc4';
        default:
        case 'small':
            return '#e0f3db';
    }
};

export const getMainstemSize = (drainage: number): TMainstemSize => {
    if (drainage > MAINSTEM_DRAINAGE_MEDIUM) {
        return 'large';
    }

    if (drainage > MAINSTEM_DRAINAGE_SMALL) {
        return 'medium';
    }

    return 'small';
};

/**
 * Zoom level to transition from clusters to summary points
 *
 * @constant
 */
export const CLUSTER_TRANSITION_ZOOM = 17;

/****************************************************
 * General Mainstem Utility Properties
 ****************************************************/
export const MAINSTEM_DRAINAGE_PROPERTY = 'outlet_drainagearea_sqkm';

/**
 * Zoom level to render mainstems after initial load.
 *
 * @constant
 */
export const MAINSTEM_VISIBLE_ZOOM = 5;
/**
 * Zoom level for when mainstems should become more opaque.
 *
 * @constant
 */
export const MAINSTEM_OPACITY_ZOOM = 6;

// Widths of Mainstem line categoeis
export const MAINSTEM_SMALL_LINE_WIDTH = 3;
export const MAINSTEM_MEDIUM_LINE_WIDTH = 4;
export const MAINSTEM_LARGE_LINE_WIDTH = 6;

/****************************************************
 * MAINSTEM DRAINAGES
 ****************************************************/

/**
 * Define outlet_drainagearea_sqkm value that determines upper limit of small mainstems.
 *
 * @constant
 */
export const MAINSTEM_DRAINAGE_SMALL = 160;
/**
 * Define outlet_drainagearea_sqkm value that determines upper limit of medium mainstems.
 * Any values larger than this are considered large mainstems
 *
 * @constant
 */
export const MAINSTEM_DRAINAGE_MEDIUM = 1600;

const LARGE_MAINSTEM_EXPRESSION: FilterSpecification = [
    '>',
    ['get', MAINSTEM_DRAINAGE_PROPERTY],
    MAINSTEM_DRAINAGE_MEDIUM,
];

// const MEDIUM_CONTROL_EXPRESSION: FilterSpecification = [
//     'all',
//     ['>=', ['get', MAINSTEM_DRAINAGE_PROPERTY], MAINSTEM_DRAINAGE_SMALL],
//     ['<', ['get', MAINSTEM_DRAINAGE_PROPERTY], MAINSTEM_DRAINAGE_MEDIUM],
// ];
const MEDIUM_FILTER_MAINSTEM_EXPRESSION: FilterSpecification = [
    '>',
    ['get', MAINSTEM_DRAINAGE_PROPERTY],
    MAINSTEM_DRAINAGE_SMALL,
];

// const SMALL_CONTROL_EXPRESSION: FilterSpecification = [
//     '<',
//     ['get', MAINSTEM_DRAINAGE_PROPERTY],
//     MAINSTEM_DRAINAGE_SMALL,
// ];

export const MAINSTEM_FILTER: ExpressionSpecification = [
    'step',
    ['zoom'],

    false,
    MAINSTEM_VISIBLE_ZOOM,
    LARGE_MAINSTEM_EXPRESSION,

    MAINSTEM_VISIBLE_ZOOM + 2,
    MEDIUM_FILTER_MAINSTEM_EXPRESSION,

    MAINSTEM_VISIBLE_ZOOM + 4,
    true, // Allow all
];

export const MAINSTEM_OPACITY_EXPRESSION: ExpressionSpecification = [
    'step',
    ['zoom'],
    0.3,
    MAINSTEM_OPACITY_ZOOM,
    0.8,
];

export const MAINSTEM_WIDTH_EXPRESSION: ExpressionSpecification = [
    'step',
    ['get', MAINSTEM_DRAINAGE_PROPERTY],
    MAINSTEM_SMALL_LINE_WIDTH,
    MAINSTEM_DRAINAGE_SMALL,
    MAINSTEM_MEDIUM_LINE_WIDTH,
    MAINSTEM_DRAINAGE_MEDIUM,
    MAINSTEM_LARGE_LINE_WIDTH,
];

export const GHOST_SUFFIX = '-ghost';

export const MAINSTEM_GHOST_WIDTH_EXPRESSION: ExpressionSpecification = [
    'step',
    ['get', MAINSTEM_DRAINAGE_PROPERTY],
    MAINSTEM_SMALL_LINE_WIDTH + getPadding('small'),

    MAINSTEM_DRAINAGE_SMALL,
    MAINSTEM_MEDIUM_LINE_WIDTH + getPadding('medium'),

    MAINSTEM_DRAINAGE_MEDIUM,
    MAINSTEM_LARGE_LINE_WIDTH + getPadding('large'),
];

export const MAINSTEM_COLOR_EXPRESSION: ExpressionSpecification = [
    'step',
    ['get', MAINSTEM_DRAINAGE_PROPERTY],
    getColor('small'),
    MAINSTEM_DRAINAGE_SMALL,
    getColor('medium'),
    MAINSTEM_DRAINAGE_MEDIUM,
    getColor('large'),
];
