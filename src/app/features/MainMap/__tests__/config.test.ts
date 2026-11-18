import { LayerType } from '@/app/components/Map/types';
import {
    getLayerColor,
    getLayerConfig,
    getLayerName,
    LayerId,
    SourceId,
} from '@/app/features/MainMap/config';
import { getTestTypeLabel, TestType } from '@/app/utils/__tests__/getTestType';

const TYPE = TestType.MapComponent;

const LABEL = getTestTypeLabel(TYPE);

describe(`${LABEL}: Config`, () => {
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
        const result = getLayerConfig(LayerId.GeocoderResultCircle);
        expect(result).toEqual({
            id: LayerId.GeocoderResultCircle,
            type: LayerType.Circle,
            source: SourceId.GeocoderResult,
            filter: ['==', ['geometry-type'], 'Point'],
            paint: {
                'circle-color': getLayerColor(LayerId.GeocoderResultCircle),
                'circle-radius': 6,
            },
        });
    });

    test('getLayerConfig returns default when no match', () => {
        const result = getLayerConfig('' as LayerId);
        expect(result).toBe(null);
    });
});
