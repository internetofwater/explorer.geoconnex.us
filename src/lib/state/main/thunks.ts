import { Dataset } from '@/app/types';
import { SparqlResult } from '@/services/dataset.service';
import datasetService from '@/services/init/dataset.init';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setDatasets, setFilter } from './slice';
import { _transformDatasets, createFilters } from '../utils';
import { AppDispatch } from '../store';

// export const getDatasets = createAsyncThunk<any, string>(
//     'main/getDatasets',
//     async (mainstemIri: string, signal: AbortSignal) => {
//         const stream = datasetService.getDatasets(mainstemIri);

//         let results = [];
//         stream.on('data', (row) => {
//             console.log('row', row);
//             results.push(dataset);
//         });
//     }
// );

export const fetchDatasets =
    (mainstemIri: string, signal?: AbortSignal) => (dispatch: AppDispatch) => {
        const stream = datasetService.getDatasets(mainstemIri);

        // const reader = stream.getReader();
        // const decoder = new TextDecoder();

        // // eslint-disable-next-line no-constant-condition
        // while (true) {
        //     const { done, value } = await reader.read();
        //     if (done) break;
        //     const result = decoder.decode(value, { stream: true });
        //     console.log('Chunk:', result);
        // }

        const results: Dataset[] = [];

        stream.on('data', (result: SparqlResult) => {
            console.log('row', result);

            const parsedDataset = JSON.parse(result.datasets.value) as Dataset;

            results.push(parsedDataset);

            // for (const [key, value] of Object.entries(row)) {
            //     console.log(`${key}: ${value.value} (${value.termType})`);
            // }
        });

        stream.on('end', () => {
            console.log('DONE', results);
            const filters = createFilters(results);
            const datasets = _transformDatasets(results);
            dispatch(setDatasets(datasets));
            dispatch(setFilter(filters));
        });
    };
