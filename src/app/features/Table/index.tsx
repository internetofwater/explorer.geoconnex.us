import React from 'react';
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
import { Dataset } from '@/app/types';
import Pagination from '@/app/features/Table/Pagination';
import Table from '@/app/features/Table/Table';

const TableWrapper: React.FC = () => {
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
                cell: (info) => (
                    <a
                        href={info.getValue() as string}
                        target="_blank"
                        title={info.getValue() as string}
                    >
                        Link
                    </a>
                ),
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
                cell: (info) => (
                    <a
                        href={info.getValue() as string}
                        target="_blank"
                        title={info.getValue() as string}
                    >
                        Link
                    </a>
                ),
                disableSortBy: true,
            },
            {
                id: 'url',
                header: 'URL',
                accessorKey: 'url',
                cell: (info) => (
                    <a
                        href={info.getValue() as string}
                        target="_blank"
                        title={info.getValue() as string}
                    >
                        Link
                    </a>
                ),
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
            <Table
                getHeaderGroups={table.getHeaderGroups}
                getRowModel={table.getRowModel}
            />
            <Pagination
                paginationFunctions={{
                    firstPage: table.firstPage,
                    previousPage: table.previousPage,
                    nextPage: table.nextPage,
                    lastPage: table.lastPage,
                    getCanPreviousPage: table.getCanPreviousPage,
                    getCanNextPage: table.getCanNextPage,
                    getState: table.getState,
                    getPageCount: table.getPageCount,
                    setPageSize: table.setPageSize,
                    setPageIndex: table.setPageIndex,
                }}
                recordCount={data.length}
            />
        </div>
    );
};

export default TableWrapper;
