import { configureStore, Store } from '@reduxjs/toolkit';
import mainReducer, {
    setSearchResultIds,
    setHoverId,
    setDatasets,
    setLayerVisibility,
    setSelectedData,
    setFilter,
    setView,
    setSelectedMainstemBBOX,
} from '@/lib/state/main/slice';
import { FeatureCollection, Geometry, Point } from 'geojson';
import { Dataset } from '@/app/types';
import { LayerId } from '@/app/features/MainMap/config';

describe('mainSlice', () => {
    let store: Store;

    beforeEach(() => {
        store = configureStore({ reducer: { main: mainReducer } });
    });

    test('should handle setSearchResultIds', () => {
        const searchResultIds = ['id1', 'id2'];
        store.dispatch(setSearchResultIds(searchResultIds));
        const state = store.getState().main;
        expect(state.searchResultIds).toEqual(searchResultIds);
    });

    test('should handle setHoverId', () => {
        const hoverId = '2';
        store.dispatch(setHoverId(hoverId));
        const state = store.getState().main;
        expect(state.hoverId).toEqual(hoverId);
    });

    test('should handle setDatasets', () => {
        const datasets: FeatureCollection<Point, Dataset> = {
            type: 'FeatureCollection',
            features: [],
        };
        store.dispatch(setDatasets(datasets));
        const state = store.getState().main;
        expect(state.datasets).toEqual(datasets);
    });

    test('should handle setLayerVisibility', () => {
        const visibleLayers = { [LayerId.MajorRivers]: false };
        store.dispatch(setLayerVisibility(visibleLayers));
        const state = store.getState().main;
        expect(state.visibleLayers[LayerId.MajorRivers]).toEqual(false);
    });

    test('should handle setSelectedData', () => {
        const selectedData = {
            datasetDescription: '',
            distributionFormat: '',
            distributionName: '',
            distributionURL: '',
            measurementTechnique: '',
            monitoringLocation: '',
            siteName: '',
            temporalCoverage: '',
            type: '',
            url: '',
            variableMeasured: '',
            variableUnit: '',
            wkt: '',
        };
        store.dispatch(setSelectedData(selectedData));
        const state = store.getState().main;
        expect(state.selectedData).toEqual(selectedData);
    });

    test('should handle setFilter', () => {
        const filter = { types: ['type1'] };
        store.dispatch(setFilter(filter));
        const state = store.getState().main;
        expect(state.filter.types).toEqual(['type1']);
    });

    test('should handle setView', () => {
        const view = 'table';
        store.dispatch(setView(view));
        const state = store.getState().main;
        expect(state.view).toEqual(view);
    });

    test('should handle setSelectedMainstemBBOX', () => {
        const bbox: [number, number, number, number] = [0, 0, 1, 1];
        store.dispatch(setSelectedMainstemBBOX(bbox));
        const state = store.getState().main;
        expect(state.selectedMainstemBBOX).toEqual(bbox);
    });
});
