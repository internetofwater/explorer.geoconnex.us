import React from 'react';
import { getDatasets } from '@/lib/state/main/slice';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    getFilteredRowModel,
    ColumnDef,
    PaginationState,
} from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { Dataset } from '../types';

const Table: React.FC = () => {
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
            {
                id: 'datasetDescription',
                header: 'Dataset Description',
                accessorKey: 'datasetDescription',
            },
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

    console.log('data', data);

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
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            pagination,
        },
    });

    console.log(
        'table.getRowModel()',
        table.getRowModel(),
        table.getHeaderGroups()
    );

    return (
        <div className="h-full w-full bg-white pt-2">
            <div
                id="table-wrapper"
                className="w-full max-w-full lg:w-[95%] lg:max-w-[95%] max-h-[calc(100svh - 90px)] mx-auto overflow-auto bg-white border border-gray-200 text-black text-sm"
            >
                <table>
                    <thead className="sticky top-0 bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[
                                                    header.column.getIsSorted() as string
                                                ] ?? null}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => {
                            console.log('HERE', row.getVisibleCells());
                            return (
                                <tr key={row.id} className="odd:bg-blue-500">
                                    {row.getVisibleCells().map((cell) => {
                                        console.log(
                                            'cell',
                                            cell,
                                            cell.getValue(),
                                            flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )
                                        );
                                        return (
                                            <td key={cell.id} className="p-2">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center gap-2 justify-center mt-3">
                <button
                    className="border rounded p-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Table;
