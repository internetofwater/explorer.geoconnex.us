import React from 'react';
import { Table } from '@tanstack/react-table';
import { Dataset } from '../../types';
import { Typography } from '../../components/common/Typography';

type Props = {
    table: Table<Dataset>;
    recordCount: number;
};

const Pagination: React.FC<Props> = (props) => {
    const { table, recordCount } = props;

    return (
        <div className=" flex flex-col lg:flex-row items-center gap-4 justify-center py-3 ml-6 lg:ml-0">
            <div className="flex gap-2">
                <button
                    className="border rounded p-1 disabled:opacity-70"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'⏮'}
                </button>
                <button
                    className="border rounded p-1 disabled:opacity-70"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'◀'}
                </button>
                <button
                    className="border rounded p-1 disabled:opacity-70"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'▶'}
                </button>
                <button
                    className="border rounded p-1 disabled:opacity-70"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'⏭'}
                </button>
                <span className="flex items-center gap-1 ml-1">
                    Go to page:
                    <input
                        disabled={table.getPageCount() === 1}
                        type="number"
                        min="1"
                        max={
                            !isNaN(table.getPageCount())
                                ? table.getPageCount()
                                : '1'
                        }
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
            </div>
            <div className="flex items-center gap-2">
                <Typography
                    variant="body-small"
                    className="flex items-center gap-1"
                >
                    Page
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </Typography>

                <Typography variant="body-small" className="flex-grow-0">
                    | <strong>Total:</strong> {recordCount} |
                </Typography>
                <select
                    disabled={recordCount <= 100}
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[100, 500, 1000].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Pagination;
