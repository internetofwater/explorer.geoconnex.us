import React, { useEffect } from 'react';
import { getDatasets } from '@/lib/state/main/slice';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    PaginationState,
} from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { Dataset } from '../../types';
import Pagination from './Pagination';
import Table from './Table';

const TableWrapper: React.FC = () => {
    // const { selectedData } = useSelector((state: RootState) => state.main);
    const datasets = useSelector(getDatasets);

    const columns = React.useMemo<ColumnDef<Dataset>[]>(
        () => [
            {
                id: 'siteName',
                header: 'Site Name',
                accessorKey: 'siteName',
            },
            {
                id: 'type',
                header: 'Type',
                accessorKey: 'type',
            },
            {
                id: 'variableMeasured',
                header: 'Variable Measured',
                accessorKey: 'variableMeasured',
            },
            {
                id: 'variableUnit',
                header: 'Variable Unit',
                accessorKey: 'variableUnit',
            },
            {
                id: 'measurementTechnique',
                header: 'Measurement Technique',
                accessorKey: 'measurementTechnique',
            },
            {
                id: 'temporalCoverage',
                header: 'Temporal Coverage',
                accessorKey: 'temporalCoverage',
            },
            {
                id: 'monitoringLocation',
                header: 'Monitoring Location',
                accessorKey: 'monitoringLocation',
                cell: (info) => <a href={info.getValue() as string}>Link</a>,
                disableSortBy: true,
            },
            // {
            //     id: 'datasetDescription',
            //     header: 'Dataset Description',
            //     accessorKey: 'datasetDescription',
            // },
            {
                id: 'distributionFormat',
                header: 'Distribution Format',
                accessorKey: 'distributionFormat',
            },
            {
                id: 'distributionName',
                header: 'Distribution Name',
                accessorKey: 'distributionName',
            },
            {
                id: 'distributionURL',
                header: 'Distribution URL',
                accessorKey: 'distributionURL',
                cell: (info) => <a href={info.getValue() as string}>Link</a>,
                disableSortBy: true,
            },
            {
                id: 'url',
                header: 'URL',
                accessorKey: 'url',
                cell: (info) => <a href={info.getValue() as string}>Link</a>,
                disableSortBy: true,
            },
        ],
        []
    );

    const data = React.useMemo(
        () => datasets.features.map((feature) => feature.properties),
        [datasets]
    );

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 100,
    });

    useEffect(() => {
        setPagination({
            ...pagination,
            pageSize: data.length,
        });
    }, [data]);

    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
        initialState: {
            sorting: [
                {
                    id: 'siteName',
                    desc: true, // sort by siteName in descending order by default
                },
            ],
        },
    });

    return (
        <div className="h-full w-full bg-white p-0 lg:pt-2">
            <Table table={table} />
            <Pagination table={table} recordCount={data.length} />
        </div>
    );
};

export default TableWrapper;
