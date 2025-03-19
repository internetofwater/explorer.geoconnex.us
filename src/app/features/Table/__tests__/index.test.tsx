import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TableWrapper from '@/app/features/Table';

const mockStore = configureStore([]);
const datasets = {
    features: [
        {
            properties: {
                siteName: 'Site 1',
                type: 'Type 1',
                variableMeasured: 'Variable 1',
                variableUnit: 'Unit 1',
                measurementTechnique: 'Technique 1',
                temporalCoverage: '2011-01-01T00:00:01Z/2025-01-01T23:23:59Z',
                monitoringLocation: 'Location 1',
                distributionFormat: 'Format 1',
                distributionName: 'Name 1',
                distributionURL: 'http://example.com',
                url: 'http://example.com',
            },
        },
    ],
};

const filter = {
    selectedVariables: ['Variable 1'],
    selectedTypes: ['Type 1'],
    startTemporalCoverage: '1969-01-01',
    endTemporalCoverage: '2030-01-01',
};

const store = mockStore({
    main: {
        datasets,
        filter,
    },
});

describe('Table', () => {
    test('renders table headers correctly', () => {
        render(
            <Provider store={store}>
                <TableWrapper />
            </Provider>
        );

        expect(screen.getByText('Site Name')).toBeInTheDocument();
    });

    test('renders table rows correctly', () => {
        render(
            <Provider store={store}>
                <TableWrapper />
            </Provider>
        );

        expect(screen.getByText('Site 1')).toBeInTheDocument();
    });

    test('handles pagination correctly', () => {
        render(
            <Provider store={store}>
                <TableWrapper />
            </Provider>
        );

        const nextPageButton = screen.getByTestId('next-button');
        fireEvent.click(nextPageButton);
    });
});
