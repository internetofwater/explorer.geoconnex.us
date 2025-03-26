import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    PaginationState,
    VisibilityState,
} from '@tanstack/react-table';
import { Dataset } from '@/app/types';
import Pagination from '@/app/features/Table/Pagination';
import Table from '@/app/features/Table/Table';
import { getFilteredDatasetsInBounds, setView } from '@/lib/state/main/slice';
import { MAP_ID as MAIN_MAP_ID } from '@/app/features/MainMap/config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/state/store';
import { useMap } from '@/app/contexts/MapContexts';
import CloseButton from '@/app/components/common/CloseButton';

export enum HeaderKey {
    SiteName = 'siteName',
    Type = 'type',
    VariableMeasured = 'variableMeasured',
    VariableUnit = 'variableUnit',
    MeasurementTechnique = 'measurementTechnique',
    TemporalCoverage = 'temporalCoverage',
    MonitoringLocation = 'monitoringLocation',
    DistributionFormat = 'distributionFormat',
    DistributionName = 'distributionName',
    DistributionURL = 'distributionURL',
    URL = 'url',
}

export const getHeaderTooltipText = (headerKey: HeaderKey) => {
    switch (headerKey) {
        case HeaderKey.SiteName:
            return 'The name of the site where measurements are taken.';
        case HeaderKey.Type:
            return 'The type of site or measurement.';
        case HeaderKey.VariableMeasured:
            return 'The specific variable that is being measured.';
        case HeaderKey.VariableUnit:
            return 'The unit of measurement for the variable.';
        case HeaderKey.MeasurementTechnique:
            return 'The technique used to measure the variable.';
        case HeaderKey.TemporalCoverage:
            return 'The time period over which measurements are taken.';
        case HeaderKey.MonitoringLocation:
            return 'The location where monitoring is conducted.';
        case HeaderKey.DistributionFormat:
            return 'The format in which data is distributed.';
        case HeaderKey.DistributionName:
            return 'The name of the distribution.';
        case HeaderKey.DistributionURL:
            return 'The URL where the distribution can be accessed.';
        case HeaderKey.URL:
            return 'The URL for more information.';
        default:
            return 'No tooltip available.';
    }
};

const TableWrapper: React.FC = () => {
    const { map } = useMap(MAIN_MAP_ID);

    const datasets = useSelector((state: RootState) =>
        getFilteredDatasetsInBounds(state, map)
    );

    const dispatch = useDispatch();

    const handleCloseClick = () => {
        dispatch(setView('map'));
    };

    const columns = React.useMemo<ColumnDef<Dataset>[]>(
        () => [
            {
                id: HeaderKey.SiteName,
                header: 'Site Name',
                accessorKey: HeaderKey.SiteName,
            },
            {
                id: HeaderKey.Type,
                header: 'Site Type',
                accessorKey: HeaderKey.Type,
            },
            {
                id: HeaderKey.VariableMeasured,
                header: 'Variable Measured',
                accessorKey: HeaderKey.VariableMeasured,
            },
            {
                id: HeaderKey.VariableUnit,
                header: 'Variable Unit',
                accessorKey: HeaderKey.VariableUnit,
            },
            {
                id: HeaderKey.MeasurementTechnique,
                header: 'Measurement Technique',
                accessorKey: HeaderKey.MeasurementTechnique,
            },
            {
                id: HeaderKey.TemporalCoverage,
                header: 'Temporal Coverage',
                accessorKey: HeaderKey.TemporalCoverage,
            },
            {
                id: HeaderKey.MonitoringLocation,
                header: 'Monitoring Location',
                accessorKey: HeaderKey.MonitoringLocation,
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
                id: HeaderKey.DistributionFormat,
                header: 'Distribution Format',
                accessorKey: HeaderKey.DistributionFormat,
            },
            {
                id: HeaderKey.DistributionName,
                header: 'Distribution Name',
                accessorKey: HeaderKey.DistributionName,
            },
            {
                id: HeaderKey.DistributionURL,
                header: 'Distribution URL',
                accessorKey: HeaderKey.DistributionURL,
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
                id: HeaderKey.URL,
                header: 'URL',
                accessorKey: HeaderKey.URL,
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

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        [HeaderKey.SiteName]: true,
        [HeaderKey.Type]: true,
        [HeaderKey.VariableMeasured]: true,
        [HeaderKey.VariableUnit]: true,
        [HeaderKey.MeasurementTechnique]: true,
        [HeaderKey.TemporalCoverage]: true,
        [HeaderKey.MonitoringLocation]: true,
        [HeaderKey.DistributionFormat]: true,
        [HeaderKey.DistributionName]: true,
        [HeaderKey.DistributionURL]: true,
        [HeaderKey.URL]: true,
    });

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility,
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
        <div className="h-full w-full bg-primary p-0 lg:pt-2">
            <CloseButton
                onClick={handleCloseClick}
                className="block pt-3 ml-auto mr-2 mb-2 text-gray-900 hover:text-gray-700 text-md"
                closeIconClassName="w-8 h-8"
            />
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
