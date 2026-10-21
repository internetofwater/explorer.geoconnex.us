import { formatNumber } from '@/app/utils/formatNumber';
import { getTestTypeLabel, TestType } from '@/app/utils/__tests__/getTestType';

const TYPE = TestType.Utility;

const LABEL = getTestTypeLabel(TYPE);

describe(`${LABEL}: formatNumber`, () => {
    it('formats numbers', () => {
        expect(formatNumber(66999.6)).toBe('66,999.6');
        expect(formatNumber(68068)).toBe('68,068');
        expect(formatNumber(111_111_111.12345)).toBe('111,111,111.12345');
        expect(formatNumber(1)).toBe('1');
        expect(formatNumber('1' as unknown as number)).toBe('1');
    });
});
