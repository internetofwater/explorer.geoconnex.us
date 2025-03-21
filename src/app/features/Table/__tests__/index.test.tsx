import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableWrapper from '@/app/features/Table';
import { FeatureCollection, Geometry, Point } from 'geojson';
import { Dataset } from '@/app/types';

const datasets: FeatureCollection<Point, Dataset> = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0],
            },
            properties: {
                siteName: 'Site 1',
                type: 'Type 1',
                variableMeasured: 'Variable 1',
                variableUnit: 'Unit 1',
                measurementTechnique: 'Technique 1',
                temporalCoverage: '2011-01-01T00:00:01Z/2025-01-01T23:23:59Z',
                monitoringLocation: 'Location 1',
                datasetDescription: 'Description 1',
                wkt: 'Point(0, 0)',
                distributionFormat: 'Format 1',
                distributionName: 'Name 1',
                distributionURL: 'http://example.com',
                url: 'http://example.com',
            },
        },
    ],
};

describe('Table', () => {
    test('renders table headers correctly', () => {
        render(<TableWrapper datasets={datasets} />);

        expect(screen.getByText('Site Name')).toBeInTheDocument();
    });

    test('renders table rows correctly', () => {
        render(<TableWrapper datasets={datasets} />);

        expect(screen.getByText('Site 1')).toBeInTheDocument();
    });

    test('handles pagination correctly', () => {
        render(<TableWrapper datasets={datasets} />);

        const nextPageButton = screen.getByTestId('next-button');
        fireEvent.click(nextPageButton);
    });
});
