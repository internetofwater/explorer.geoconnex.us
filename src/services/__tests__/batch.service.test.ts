import { BatchTransform } from '@/services/batch.service';

import { getTestTypeLabel, TestType } from '@/app/utils/__tests__/getTestType';

const TYPE = TestType.Service;

const LABEL = getTestTypeLabel(TYPE);

describe(`${LABEL}: BatchTransform`, () => {
    it('should emit batches when batch size is reached', async () => {
        const transform = new BatchTransform<number>(2);

        const results: number[][] = [];

        transform.on('data', (batch) => {
            results.push(batch);
        });

        transform.write(1);
        transform.write(2);
        transform.write(3);
        transform.write(4);
        transform.end();

        await new Promise((resolve) => transform.on('end', resolve));

        expect(results).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    it('should flush remaining items on end', async () => {
        const transform = new BatchTransform<number>(3);

        const results: number[][] = [];

        transform.on('data', (batch) => {
            results.push(batch);
        });

        transform.write(1);
        transform.write(2);
        transform.end();

        await new Promise((resolve) => transform.on('end', resolve));

        expect(results).toEqual([[1, 2]]);
    });

    it('should emit full batches and remaining items', async () => {
        const transform = new BatchTransform<number>(3);

        const results: number[][] = [];

        transform.on('data', (batch) => {
            results.push(batch);
        });

        [1, 2, 3, 4, 5].forEach((value) => transform.write(value));
        transform.end();

        await new Promise((resolve) => transform.on('end', resolve));

        expect(results).toEqual([
            [1, 2, 3],
            [4, 5],
        ]);
    });

    it('should destroy without error', (done) => {
        const transform = new BatchTransform<number>(2);

        transform.destroy();

        expect(transform.destroyed).toBe(true);

        done();
    });

    it('should clear buffer when destroyed', () => {
        const transform = new BatchTransform<number>(2);

        transform.write(1);

        transform.destroy();

        expect((transform as any).buffer).toEqual([]);
    });

    it('should not lose data when consumer is slower than producer', (done) => {
        const transform = new BatchTransform<number>(2);

        const received: number[][] = [];

        transform.on('data', (chunk) => {
            received.push(chunk);

            // simulate slow work
            transform.pause();

            setTimeout(() => {
                transform.resume();
            }, 10);
        });

        transform.on('end', () => {
            expect(received).toEqual([[1, 2], [3, 4], [5]]);

            done();
        });

        [1, 2, 3, 4, 5].forEach((x) => transform.write(x));
        transform.end();
    });
});
