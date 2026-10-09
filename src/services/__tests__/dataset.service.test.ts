import { DatasetService } from '@/services/dataset.service';
import { TEST_GET_DATASET_COUNT_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getDatasetCount.response';
import { TEST_GET_TOTAL_SITES_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getTotalSites.response';
import { TEST_GET_VARIABLES_MEASURED_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getVariablesMeasured.response';
import { TEST_GET_DISTRIBUTION_NAMES } from '@/sparql/tranformers/__tests__/fixtures/getDistributionNames.response';
import { TEST_GET_TOTAL_TYPES_RESPONSE } from '@/sparql/tranformers/__tests__/fixtures/getTypes.response';

describe('DatasetService', () => {
    const signal = new AbortController().signal;

    const fetchMock = jest.fn();

    const factoryService = {
        createGetDatasetCount: jest.fn(),
        createGetTotalSites: jest.fn(),
        createGetVariablesMeasured: jest.fn(),
        createGetDistributionNames: jest.fn(),
        createGetTypes: jest.fn(),
        createGetDatasets: jest.fn(),
    };

    let service: DatasetService;

    beforeEach(() => {
        jest.clearAllMocks();

        const client = {
            query: {
                select: jest.fn(),
            },
        };

        service = new DatasetService('https://example.test', {
            factoryService: factoryService as any,
            fetch: fetchMock,
            client: client as any,
        });
    });

    it('should get dataset count', async () => {
        factoryService.createGetDatasetCount.mockReturnValue(
            'DATASET_COUNT_QUERY'
        );

        fetchMock.mockResolvedValue({
            json: jest.fn().mockResolvedValue(TEST_GET_DATASET_COUNT_RESPONSE),
        });

        const result = await service.getDatasetCount('uri', {
            signal,
        });

        expect(factoryService.createGetDatasetCount).toHaveBeenCalledWith(
            'uri',
            expect.any(Object)
        );

        expect(result).toEqual({
            result: {
                count: 32336,
            },
            requestId: -1,
        });
    });

    it('should get total sites', async () => {
        factoryService.createGetTotalSites.mockReturnValue('TOTAL_SITES_QUERY');

        fetchMock.mockResolvedValue({
            json: jest.fn().mockResolvedValue(TEST_GET_TOTAL_SITES_RESPONSE),
        });

        const result = await service.getTotalSites('uri', {
            signal,
        });

        expect(factoryService.createGetTotalSites).toHaveBeenCalledWith('uri');

        expect(result).toEqual({
            count: expect.any(Number),
        });
    });

    it('should get variables measured', async () => {
        factoryService.createGetVariablesMeasured.mockReturnValue(
            'VARIABLES_QUERY'
        );

        fetchMock.mockResolvedValue({
            json: jest
                .fn()
                .mockResolvedValue(TEST_GET_VARIABLES_MEASURED_RESPONSE),
        });

        const result = await service.getVariablesMeasured('uri', {
            signal,
        });

        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toEqual({
            variableMeasured: 'Temperature, water',
            datasets: 23,
        });
    });

    it('should get distribution names', async () => {
        factoryService.createGetDistributionNames.mockReturnValue(
            'DISTRIBUTION_QUERY'
        );

        fetchMock.mockResolvedValue({
            json: jest.fn().mockResolvedValue(TEST_GET_DISTRIBUTION_NAMES),
        });

        const result = await service.getDistributionNames('uri', {
            signal,
        });

        expect(result[0]).toEqual({
            distributionName:
                'Department of Environmental Quality - State of Oregon',
            datasets: 1198,
        });
    });

    it('should get types', async () => {
        factoryService.createGetTypes.mockReturnValue('TYPES_QUERY');

        fetchMock.mockResolvedValue({
            json: jest.fn().mockResolvedValue(TEST_GET_TOTAL_TYPES_RESPONSE),
        });

        const result = await service.getTypes('uri', {
            signal,
        });

        expect(result[0]).toEqual({
            type: 'Lake',
            datasets: 1691,
        });
    });

    it('should aggregate summary data', async () => {
        jest.spyOn(service, 'getDatasetCount').mockResolvedValue({
            result: {
                count: 100,
            },
            requestId: -1,
        });

        jest.spyOn(service, 'getTotalSites').mockResolvedValue({
            count: 25,
        });

        jest.spyOn(service, 'getVariablesMeasured').mockResolvedValue([
            {
                variableMeasured: 'Temperature, water',
                datasets: 23,
            },
        ]);

        jest.spyOn(service, 'getDistributionNames').mockResolvedValue([
            {
                distributionName:
                    'Department of Environmental Quality - State of Oregon',
                datasets: 1198,
            },
        ]);

        jest.spyOn(service, 'getTypes').mockResolvedValue([
            {
                type: 'Lake',
                datasets: 1691,
            },
        ]);

        const result = await service.getSummary('uri', {
            signal,
        });

        expect(result).toEqual({
            datasetCount: {
                count: 100,
            },
            totalSites: {
                count: 25,
            },
            variables: [
                {
                    variableMeasured: 'Temperature, water',
                    datasets: 23,
                },
            ],
            distributionNames: [
                {
                    distributionName:
                        'Department of Environmental Quality - State of Oregon',
                    datasets: 1198,
                },
            ],
            types: [
                {
                    type: 'Lake',
                    datasets: 1691,
                },
            ],
        });
    });

    it('should reject when a dependent request fails', async () => {
        jest.spyOn(service, 'getDatasetCount').mockRejectedValue(
            new Error('Boom')
        );

        jest.spyOn(service, 'getTotalSites').mockResolvedValue({
            count: 25,
        });

        jest.spyOn(service, 'getVariablesMeasured').mockResolvedValue([]);
        jest.spyOn(service, 'getDistributionNames').mockResolvedValue([]);
        jest.spyOn(service, 'getTypes').mockResolvedValue([]);

        await expect(
            service.getSummary('uri', {
                signal,
            })
        ).rejects.toThrow('Boom');
    });
});
