import { formatNumber } from '../formatNumber';

describe('formatNumber', () => {
    it('it formats numbers', () => {
        expect(formatNumber(66999.6)).toBe('69,999.6');
        expect(formatNumber(68068)).toBe('68,068');
        expect(formatNumber(1)).toBe('1');
        expect(formatNumber('1' as unknown as number)).toThrow();
    });
});
