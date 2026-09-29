import { fireEvent, render, screen } from '@testing-library/react';
import ReactSelect, { SELECT_ALL_OPTION } from '../ReactSelect';

describe('Common Components: ReactSelect', () => {
    const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
        { value: '4', label: 'Option 4' },
    ];

    const handleChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders placeholder text', () => {
        render(
            <ReactSelect
                options={options}
                placeholder="Select option"
                onChange={handleChange}
            />
        );

        expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    test('renders selected value', () => {
        render(
            <ReactSelect
                options={options}
                value={options[0]}
                onChange={handleChange}
            />
        );

        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    test('opens menu when clicked', () => {
        render(<ReactSelect options={options} onChange={handleChange} />);

        fireEvent.mouseDown(screen.getByRole('combobox'));

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('calls onChange when option is selected', () => {
        render(<ReactSelect options={options} onChange={handleChange} />);

        fireEvent.mouseDown(screen.getByRole('combobox'));
        fireEvent.click(screen.getByText('Option 2'));

        expect(handleChange).toHaveBeenCalled();
    });

    test('prepends select all option when isAllSelectable is true', () => {
        render(
            <ReactSelect
                options={options}
                isAllSelectable
                onChange={handleChange}
            />
        );

        fireEvent.mouseDown(screen.getByRole('combobox'));

        expect(screen.getByText(SELECT_ALL_OPTION.label)).toBeInTheDocument();
    });

    test('does not render select all option when isAllSelectable is false', () => {
        render(<ReactSelect options={options} onChange={handleChange} />);

        fireEvent.mouseDown(screen.getByRole('combobox'));

        expect(
            screen.queryByText(SELECT_ALL_OPTION.label)
        ).not.toBeInTheDocument();
    });

    test('applies custom container classname', () => {
        const { container } = render(
            <ReactSelect
                options={options}
                onChange={handleChange}
                customClassnames={{
                    container: 'test-container',
                }}
            />
        );

        expect(container.querySelector('.test-container')).toBeInTheDocument();
    });

    test('renders as disabled', () => {
        const { container } = render(
            <ReactSelect options={options} isDisabled onChange={handleChange} />
        );

        expect(
            container.querySelector('[aria-disabled="true"]')
        ).toBeInTheDocument();
    });

    test('renders all selected values when less than max badge threshold', () => {
        render(
            <ReactSelect
                options={options}
                isMulti
                value={[options[0], options[1]]}
                onChange={handleChange}
            />
        );

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('renders overflow badge when more than three items selected', () => {
        render(
            <ReactSelect
                options={options}
                isMulti
                value={[options[0], options[1], options[2], options[3]]}
                onChange={handleChange}
            />
        );

        expect(screen.getByText('+ 1 item selected')).toBeInTheDocument();
    });

    test('overflow badge contains hidden item labels in title', () => {
        render(
            <ReactSelect
                options={options}
                isMulti
                value={[options[0], options[1], options[2], options[3]]}
                onChange={handleChange}
            />
        );

        expect(screen.getByTitle('Option 4')).toBeInTheDocument();
    });
});
