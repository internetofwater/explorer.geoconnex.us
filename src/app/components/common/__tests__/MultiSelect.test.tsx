import { fireEvent, render, screen } from '@testing-library/react';
import MultiSelect from '../MultiSelect';

describe('Common Components: MultiSelect', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const selectedOptions = ['Option 1'];
    const handleOptionClick = jest.fn();
    const handleSelectAll = jest.fn();

    test('renders the button with "Select..." text initially', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveTextContent('Select...');
    });

    test('toggles the options display when the button is clicked', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(buttonElement).toHaveTextContent('Click to Close');
        const optionsList = screen.getByRole('listbox');
        expect(optionsList).toBeInTheDocument();
        fireEvent.click(buttonElement);
        expect(buttonElement).toHaveTextContent('Select...');
    });

    test('toggles the options display when the searchable input is clicked', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                searchable
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const inputElement = screen.getByTestId('searchable-input');
        fireEvent.click(inputElement);
        options.forEach((option) => {
            const optionElement = screen.getByText(option);
            expect(optionElement).toBeInTheDocument();
        });
    });

    test('renders the options correctly', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        options.forEach((option) => {
            const optionElement = screen.getByText(option);
            expect(optionElement).toBeInTheDocument();
        });
    });

    test('calls handleOptionClick when an option is clicked', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const optionElement = screen.getByText('Option 2');
        fireEvent.click(optionElement);
        expect(handleOptionClick).toHaveBeenCalledWith('Option 2');
    });

    test('checks the checkbox for selected options', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const checkbox = screen.getByTestId('Option 1') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    test('unchecks the checkbox for unselected options', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const checkbox = screen.getByTestId('Option 2') as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });

    test('renders the "Select All" checkbox', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const selectAllCheckbox = screen.getByTestId('select-all-option');
        expect(selectAllCheckbox).toBeInTheDocument();
    });

    test('throws error when missing handleSelectAll with selectAll true', () => {
        expect(() =>
            render(
                <MultiSelect
                    options={options}
                    selectedOptions={selectedOptions}
                    handleOptionClick={handleOptionClick}
                    selectAll
                />
            )
        ).toThrow('Missing function for handling select all');
    });

    test('calls handleSelectAll when "Select All" is clicked', () => {
        let _selectedOptions = [...options];
        const _handleSelectAll = (allSelected: boolean) => {
            if (allSelected) {
                _selectedOptions = [...options];
            } else {
                _selectedOptions = [];
            }
        };
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const selectAllCheckbox = screen.getByTestId('select-all-option');
        fireEvent.click(selectAllCheckbox);
        expect(handleSelectAll).toHaveBeenCalledWith(true);
    });

    test('checks all checkboxes when "Select All" is clicked', () => {
        let _selectedOptions: string[] = [];
        const _handleSelectAll = (allSelected: boolean) => {
            if (allSelected) {
                _selectedOptions = [...options];
            } else {
                _selectedOptions = [];
            }
        };
        render(
            <MultiSelect
                options={options}
                selectedOptions={_selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={_handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const selectAllCheckbox = screen.getByTestId('select-all-option');
        fireEvent.click(selectAllCheckbox);
        const checkbox1 = screen.getByTestId('Option 1') as HTMLInputElement;
        expect(checkbox1.checked).toBe(false);
        const checkbox2 = screen.getByTestId('Option 2') as HTMLInputElement;
        expect(checkbox2.checked).toBe(false);
        const checkbox3 = screen.getByTestId('Option 3') as HTMLInputElement;
        expect(checkbox3.checked).toBe(false);
    });

    test('unchecks all checkboxes when "Select All" is clicked again', () => {
        let _selectedOptions = [...options];
        const _handleSelectAll = (allSelected: boolean) => {
            if (allSelected) {
                _selectedOptions = [...options];
            } else {
                _selectedOptions = [];
            }
        };
        render(
            <MultiSelect
                options={options}
                selectedOptions={_selectedOptions}
                handleOptionClick={handleOptionClick}
                selectAll
                handleSelectAll={_handleSelectAll}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const selectAllCheckbox = screen.getByTestId('select-all-option');
        fireEvent.click(selectAllCheckbox);
        const checkbox1 = screen.getByTestId('Option 1') as HTMLInputElement;
        expect(checkbox1.checked).toBe(true);
        const checkbox2 = screen.getByTestId('Option 2') as HTMLInputElement;
        expect(checkbox2.checked).toBe(true);
        const checkbox3 = screen.getByTestId('Option 3') as HTMLInputElement;
        expect(checkbox3.checked).toBe(true);
    });
});
