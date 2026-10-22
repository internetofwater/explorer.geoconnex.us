export const TestType = {
    CommonComponents: 'common-components',
    Feature: 'feature',
    GlobalState: 'global-state',
    MapComponent: 'map-component',
    Query: 'query',
    Service: 'service',
    Utility: 'utility',
};

export type TTestType = (typeof TestType)[keyof typeof TestType];

const TestFriendlyLabels: Record<TTestType, string> = {
    [TestType.CommonComponents]: 'Common Components',
    [TestType.Feature]: 'Feature',
    [TestType.GlobalState]: 'Global State',
    [TestType.MapComponent]: 'Map Component',
    [TestType.Query]: 'Query',
    [TestType.Service]: 'Service',
    [TestType.Utility]: 'Utility',
};

export const getTestTypeLabel = (type: TTestType) =>
    TestFriendlyLabels[type] ?? type;
