import { Dataset } from '@/app/types';
import { SparqlResult } from '@/services/dataset.service';
import datasetService from '@/services/init/dataset.init';
import { addDatasets, setDatasets, setFilter } from './slice';
import {
    _transformDatasets,
    appendFilters,
    createFilters,
    getDefaultGeojson,
} from '../utils';
import { AppDispatch } from '../store';
import { BatchTransform } from '@/services/batch.service';
import { BATCH_SIZE } from '../consts';
import { Point } from 'geojson';
import { Readable } from 'stream';

let stream: Readable | null = null;
let batcher: BatchTransform<SparqlResult> | null = null;
let requestGeneration = 0;

export const fetchDatasets =
    (mainstemURI: string, signal?: AbortSignal) => (dispatch: AppDispatch) => {
        const generation = ++requestGeneration;

        stream?.destroy();
        batcher?.destroy();

        dispatch(setDatasets(getDefaultGeojson<Point, Dataset>()));

        stream = datasetService.getDatasets(mainstemURI);
        batcher = new BatchTransform<SparqlResult>(BATCH_SIZE);

        let processingIndex = 0;
        let filters = createFilters([]);

        const currentStream = stream;
        const currentBatcher = batcher;

        let previousFilters = '';

        const cleanup = () => {
            if (stream === currentStream) {
                stream = null;
            }

            if (batcher === currentBatcher) {
                batcher = null;
            }
        };

        signal?.addEventListener(
            'abort',
            () => {
                currentStream.destroy();
                currentBatcher.destroy();
                cleanup();
            },
            { once: true }
        );

        currentStream.once('error', (err) => {
            console.error('Dataset stream error', err);
            cleanup();
        });

        currentBatcher.once('error', (err) => {
            console.error('Batcher error', err);
            cleanup();
        });

        currentStream.once('close', cleanup);
        currentBatcher.once('close', cleanup);

        currentStream.once('end', () => {
            cleanup();
        });

        currentStream.pipe(currentBatcher);

        currentBatcher.on('data', (batch: SparqlResult[]) => {
            // Ignore batches from an old request
            if (generation !== requestGeneration) {
                return;
            }

            const datasets = batch.map(
                (result) => JSON.parse(result.datasets.value) as Dataset
            );

            const newFilters = createFilters(
                datasets.flatMap((dataset) => dataset)
            );

            filters = appendFilters(filters, newFilters);
            const stringFilters = JSON.stringify(filters);
            if (stringFilters !== previousFilters) {
                previousFilters = stringFilters;
                dispatch(setFilter(filters));
            }

            dispatch(
                addDatasets(_transformDatasets(datasets, processingIndex))
            );

            processingIndex++;
        });
    };
