import React from 'react';
import { Table } from '@tanstack/react-table';
import { Dataset } from '@/app/types';
import { getTextStyling, Typography } from '@/app/components/common/Typography';

type PaginationFunctions = Pick<
    Table<Dataset>,
    | 'firstPage'
    | 'previousPage'
    | 'nextPage'
    | 'lastPage'
    | 'getCanPreviousPage'
    | 'getCanNextPage'
    | 'getState'
    | 'getPageCount'
    | 'setPageSize'
    | 'setPageIndex'
>;

type Props = {
    paginationFunctions: PaginationFunctions; // Avoid passing whole table
    recordCount: number;
};

const Pagination: React.FC<Props> = (props) => {
    const { paginationFunctions, recordCount } = props;

    return (
        <div className=" flex flex-col lg:flex-row items-center gap-4 justify-center py-2 ml-6 lg:ml-0">
            <div className="flex gap-2">
                <button
                    className="border rounded p-1 text-lg disabled:opacity-70"
                    onClick={() => paginationFunctions.firstPage()}
                    disabled={!paginationFunctions.getCanPreviousPage()}
                >
                    {' ⏮ '}
                </button>
                <button
                    className="border rounded p-1 disabled:opacity-70"
                    onClick={() => paginationFunctions.previousPage()}
                    disabled={!paginationFunctions.getCanPreviousPage()}
                >
                    {' ◀ '}
                </button>
                <button
                    data-testid="next-button"
                    className="border rounded p-1 disabled:opacity-70"
                    onClick={() => paginationFunctions.nextPage()}
                    disabled={!paginationFunctions.getCanNextPage()}
                >
                    {' ▶ '}
                </button>
                <button
                    className="border rounded p-1 text-lg disabled:opacity-70"
                    onClick={() => paginationFunctions.lastPage()}
                    disabled={!paginationFunctions.getCanNextPage()}
                >
                    {'  ⏭  '}
                </button>
                <span className="flex items-center gap-1 ml-1">
                    <label htmlFor="page-index-input">
                        <Typography variant="body-small">
                            Go to page:
                        </Typography>
                    </label>
                    <input
                        id="page-index-input"
                        disabled={paginationFunctions.getPageCount() === 1}
                        type="number"
                        min="1"
                        max={
                            !isNaN(paginationFunctions.getPageCount())
                                ? paginationFunctions.getPageCount()
                                : '1'
                        }
                        defaultValue={
                            paginationFunctions.getState().pagination
                                .pageIndex + 1
                        }
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            paginationFunctions.setPageIndex(page);
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
                        {paginationFunctions.getState().pagination.pageIndex +
                            1}{' '}
                        of {paginationFunctions.getPageCount().toLocaleString()}
                    </strong>
                </Typography>

                <Typography variant="body-small" className="flex-grow-0">
                    | <strong>Total Datasets:</strong> {recordCount} |
                </Typography>
                <select
                    aria-label="Select Page Size"
                    disabled={recordCount <= 100}
                    value={paginationFunctions.getState().pagination.pageSize}
                    onChange={(e) => {
                        paginationFunctions.setPageSize(Number(e.target.value));
                    }}
                    className={`${getTextStyling('body-small')} bg-transparent`}
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
