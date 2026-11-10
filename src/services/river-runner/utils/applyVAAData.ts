import {
    TNLDIVAAFeature,
    TVAAResponse,
    TFlowlineFeature,
} from '@/services/river-runner/types';

export const applyVAAData = (
    feature: TFlowlineFeature,
    vaa: TVAAResponse
): TNLDIVAAFeature => ({
    ...feature,
    properties: {
        ...feature.properties,
        ...vaa,
        feature_name: vaa.gnis_name || 'Unnamed River/Stream',
        feature_id: vaa.gnis_name || vaa.levelpathid,
    },
});
