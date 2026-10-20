import { getTestTypeLabel, TestType } from '@/app/utils/__tests__/getTestType';

const TYPE = TestType.MapComponent;

const LABEL = getTestTypeLabel(TYPE);

describe(`${LABEL}: utils`, () => {
    // TODO: write tests for summary point functions

    test('placeholder', () => {
        expect('').toBe('');
    });
});
