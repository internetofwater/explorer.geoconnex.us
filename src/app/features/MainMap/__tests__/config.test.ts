import {
    getLayerColor,
    getLayerConfig,
    getLayerName,
    LayerId,
    MAINSTEM_SMALL_LINE_WIDTH,
    SourceId,
    SubLayerId,
} from '@/app/features/MainMap//config';

describe('MainMap: Config', () => {
    test('getLayerName returns appropriate layer name', () => {
        const result = getLayerName(LayerId.Mainstems);
        expect(result).toBe('Mainstems');
    });

    test('getLayerName returns default when no match', () => {
        const result = getLayerName('' as LayerId);
        expect(result).toBe('');
    });

    test('getLayerColor returns appropriate layer color', () => {
        const result = getLayerColor(LayerId.Mainstems);
        expect(result).toBe('#7A9939');
    });

    test('getLayerColor returns default when no match', () => {
        const result = getLayerColor('' as LayerId);
        expect(result).toBe('#FFF');
    });

    test('getLayerConfig returns correct config for layer with config', () => {
        const result = getLayerConfig(SubLayerId.MainstemsSmall);
        expect(result).toEqual({
            id: SubLayerId.MainstemsSmall, // Layer ID
            type: 'line',
            source: SourceId.Mainstems,
            'source-layer': SourceId.Mainstems,
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
                visibility: 'none',
            },
            filter: ['<', ['get', 'outlet_drainagearea_sqkm'], 160],
            paint: {
                'line-opacity': [
                    'step',
                    ['zoom'],
                    0.3, // If lower than 7
                    6,
                    0.8, // Default to 0.1
                ],
                'line-color': getLayerColor(SubLayerId.MainstemsSmall),
                'line-width': MAINSTEM_SMALL_LINE_WIDTH,
            },
        });
    });

    test('getLayerConfig returns default when no match', () => {
        const result = getLayerConfig('' as LayerId);
        expect(result).toBe(null);
    });
});
