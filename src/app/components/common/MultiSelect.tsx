import RightArrow from '@/app/assets/icons/RightArrow';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from '@/app/components/common/Typography';

type Props = {
    id: string;
    ariaLabel?: string;
    options: string[];
    selectedOptions: string[] | undefined;
    handleOptionClick: (type: string) => void;
    limit?: number;
    searchable?: boolean;
    selectAll?: boolean;
    handleSelectAll?: (allSelected: boolean) => void;
};

/**
 * Renders a multi-select dropdown with optional search functionality and a select-all feature.
 * It allows users to select multiple options from a list, with the ability to filter options through a search input.
 *
 * Props:
 * - id: string - The unique identifier for the component.
 * - ariaLabel?: string - Optional ARIA label for accessibility.
 * - options: string[] - The list of options to display in the dropdown.
 * - selectedOptions: string[] | undefined - The list of currently selected options.
 * - handleOptionClick: (type: string) => void - Function to handle option selection.
 * - limit?: number - Optional limit on the number of options to display.
 * - searchable?: boolean - Optional boolean to enable search functionality (default is false).
 * - selectAll?: boolean - Optional boolean to enable select-all functionality (default is false).
 * - handleSelectAll?: (allSelected: boolean) => void - Optional function to handle select-all action.
 *
 * @component
 */
const MultiSelect: React.FC<Props> = (props) => {
    const {
        id,
        ariaLabel = '',
        options,
        selectedOptions,
        handleOptionClick,
        limit,
        searchable = false,
        selectAll = false,
        handleSelectAll,
    } = props;

    if (selectAll && !handleSelectAll) {
        throw new Error('Missing function for handling select all');
    }

    const [showOptions, setShowOptions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setShowOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = useMemo(
        () =>
            options.filter(
                (option) =>
                    !searchable ||
                    option.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [options, searchTerm]
    );

    const limitedOptions = useMemo(
        () => filteredOptions.slice(0, limit ?? filteredOptions.length),
        [filteredOptions, limit]
    );

    const allSelected = useMemo(
        () =>
            !selectAll ||
            limitedOptions.length === 0 ||
            limitedOptions.every((option) => selectedOptions?.includes(option)),
        [limitedOptions, selectedOptions]
    );

    const handleSelectAllClick = () => {
        if (handleSelectAll) {
            handleSelectAll(!allSelected);
        }
    };

    return (
        <div className="w-100 mt-1 mb-1 text-black" ref={dropdownRef}>
            <div className="relative">
                {searchable ? (
                    <div
                        data-testid="searchable-input"
                        className={`
                            w-full 
                            px-3 py-2 
                            flex justify-between 
                            bg-primary-opaque 
                            border border-gray-300 
                            text-left sm:text-sm
                            rounded-md shadow-sm  
                            cursor-default `}
                        aria-haspopup="listbox"
                        aria-expanded={showOptions}
                        aria-labelledby={ariaLabel}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowOptions(true);
                        }}
                    >
                        <input
                            type="text"
                            className="w-full bg-transparent border-none focus:outline-none"
                            placeholder="Select..."
                            ref={inputRef}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowOptions(true)}
                        />
                        <span
                            data-testid="arrow-icon-wrapper"
                            className={`transform ${
                                showOptions ? '-rotate-90' : 'rotate-90'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowOptions(!showOptions);
                            }}
                            role="button"
                            aria-label={`${
                                showOptions ? 'Hide' : 'Show'
                            } Options`}
                        >
                            <RightArrow />
                        </span>
                    </div>
                ) : (
                    <button
                        className="flex justify-between w-full bg-primary-opaque border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-default sm:text-sm"
                        aria-haspopup="listbox"
                        aria-expanded={showOptions}
                        aria-labelledby={ariaLabel}
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        {showOptions ? 'Click to Close' : 'Select...'}
                        <span
                            data-testid="arrow-icon-wrapper"
                            className={`transform ${
                                showOptions ? '-rotate-90' : 'rotate-90'
                            }`}
                        >
                            <RightArrow />
                        </span>
                    </button>
                )}

                <div
                    className={`
                        w-full max-h-96 
                        mt-1 
                        bg-primary-opaque 
                        overflow-y-auto 
                        text-center 
                        rounded-md shadow-lg 
                        border border-gray-300 ${
                            showOptions ? 'block' : 'hidden'
                        }`}
                    aria-live="polite"
                >
                    {limit && limitedOptions.length === limit && (
                        <Typography variant="small">
                            Showing top {limit} results
                        </Typography>
                    )}
                    <ul
                        className="py-1 overflow-auto text-base sm:text-sm"
                        role="listbox"
                        aria-labelledby={ariaLabel}
                    >
                        {selectAll && (
                            <li
                                className={`select-none relative py-2 pl-3 pr-9 ${
                                    limit && limitedOptions.length === limit
                                        ? 'border-y'
                                        : 'border-b'
                                } border-gray-300 `}
                                role="option"
                                aria-selected={
                                    limitedOptions.length === 0 ||
                                    limitedOptions.every((option) =>
                                        selectedOptions?.includes(option)
                                    )
                                }
                            >
                                <div className="flex items-center">
                                    <input
                                        data-testid="select-all-option"
                                        type="checkbox"
                                        id={`${id}-select-all-option`}
                                        checked={allSelected}
                                        onChange={() => {
                                            handleSelectAllClick();
                                            if (inputRef.current) {
                                                inputRef.current.focus({
                                                    preventScroll: true,
                                                });
                                            }
                                        }}
                                        className="h-4 w-4 min-w-4 rounded cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`${id}-select-all-option`}
                                        className="ml-3 block font-bold truncate cursor-pointer"
                                    >
                                        Select All (Visible)
                                    </label>
                                </div>
                            </li>
                        )}

                        {limitedOptions.map((option, index) => (
                            <li
                                key={`${id}-option-${index}`}
                                className="select-none relative py-2 pl-3 pr-9"
                                role="option"
                                aria-selected={selectedOptions?.includes(
                                    option
                                )}
                            >
                                <div className="flex items-center">
                                    <input
                                        data-testid={option}
                                        id={option}
                                        type="checkbox"
                                        checked={selectedOptions?.includes(
                                            option
                                        )}
                                        onChange={() => {
                                            handleOptionClick(option);
                                            if (inputRef.current) {
                                                inputRef.current.focus({
                                                    preventScroll: true,
                                                });
                                            }
                                        }}
                                        className="h-4 w-4 min-w-4 rounded cursor-pointer"
                                    />
                                    <label
                                        htmlFor={option}
                                        className="ml-3 block truncate cursor-pointer"
                                    >
                                        {option}
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;
