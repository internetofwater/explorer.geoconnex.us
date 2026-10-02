import { Dataset, MainstemData } from '@/app/types';
import { addDatasets, setDatasets, setFilter } from '@/lib/state/main/slice';
import {
    _transformDatasets,
    appendFilters,
    createFilters,
    getDefaultGeojson,
} from '@/lib/state/utils';
import { AppDispatch } from '@/lib/state/store';
import { BatchTransform } from '@/services/batch.service';
import { BATCH_SIZE } from '@/lib/state/consts';
import { Point } from 'geojson';
import { Readable } from 'stream';
import { loadingManager, notificationManager } from '@/managers/init';
import { LoadingType } from '@/lib/state/loading/types';
import { NotificationType } from '@/lib/state/notifications/types';
import { datasetService } from '@/services/init/init';
import { TMainstemRequest } from '@/lib/state/mainstem/types';
import { setRequest, setSelected } from '@/lib/state/mainstem/slice';
import { parseGetDatasets } from '@/sparql/tranformers/getDatasets';
import { TRawGetDatasets } from '@/sparql/queries/getDatasets';

let stream: Readable | null = null;
let batcher: BatchTransform<TRawGetDatasets> | null = null;
let requestGeneration = 0;

export const fetchDatasets =
    (target: MainstemData, request: TMainstemRequest, signal?: AbortSignal) =>
    (dispatch: AppDispatch) => {
        const generation = ++requestGeneration;

        stream?.destroy();
        batcher?.destroy();

        dispatch(setDatasets(getDefaultGeojson<Point, Dataset>()));
        dispatch(setSelected(target));

        const loadingInstance = loadingManager.add(
            `Loading datsets for URI: ${target.uri}`,
            LoadingType.Datasets
        );

        stream = datasetService.getDatasets(target.uri, request);
        batcher = new BatchTransform<TRawGetDatasets>(BATCH_SIZE);

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

            loadingManager.remove(loadingInstance);
        };

        // Event hook to tie abort controller to active stream
        signal?.addEventListener(
            'abort',
            () => {
                currentStream.destroy();
                currentBatcher.destroy();
                cleanup();
            },
            { once: true }
        );

        // The stream has encountered an error
        currentStream.once('error', (err) => {
            console.error('Dataset stream error', err);
            notificationManager.show(
                `An error occured loading datasets`,
                NotificationType.Error,
                5000
            );
            cleanup();
        });

        // The batcher has encountered an error
        currentBatcher.once('error', (err) => {
            console.error('Batcher error', err);
            notificationManager.show(
                `An error occured loading datasets`,
                NotificationType.Error,
                5000
            );
            cleanup();
        });

        // If the stream or batcher encounter a close event
        // Should only occur if the server closes the stream
        currentStream.once('close', cleanup);
        currentBatcher.once('close', cleanup);

        // Stream successfully processes all datasets
        currentStream.once('end', () => {
            cleanup();
            // Update the current request
            // dispatch(setSelected(target));
            dispatch(setRequest(request));
            notificationManager.show(
                `Datasets loaded for mainstem`,
                NotificationType.Success,
                5000
            );
        });

        // Attach batch transformer to stream
        currentStream.pipe(currentBatcher);

        // Process a new chunk of data
        currentBatcher.on('data', (batch: TRawGetDatasets) => {
            // Ignore batches from an old request
            if (generation !== requestGeneration) {
                return;
            }

            const datasets = parseGetDatasets(batch);

            const newFilters = createFilters(datasets);

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
