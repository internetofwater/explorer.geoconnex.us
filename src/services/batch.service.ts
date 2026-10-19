import { BATCH_SIZE } from '@/lib/state/consts';
import { Transform, TransformCallback } from 'stream';

export class BatchTransform<T> extends Transform {
    private buffer: T[] = [];

    constructor(private batchSize = BATCH_SIZE) {
        super({
            objectMode: true,
        });
    }

    _transform(
        chunk: T,
        _encoding: BufferEncoding,
        callback: TransformCallback
    ) {
        this.buffer.push(chunk);

        if (this.buffer.length >= this.batchSize) {
            this.push(this.buffer);
            this.buffer = [];
        }

        callback();
    }

    _flush(callback: TransformCallback) {
        if (this.buffer.length > 0) {
            this.push(this.buffer);
            this.buffer = [];
        }

        callback();
    }

    _destroy(error: Error | null, callback: (error?: Error | null) => void) {
        this.buffer = [];
        callback(error);
    }
}
