import RightArrow from '@/app/assets/icons/RightArrow';
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
    ariaLabel?: string;
    options: string[];
    selectedOptions: string[] | undefined;
    searchable?: boolean;
    selectAll?: boolean;
    handleOptionClick: (type: string) => void;
    handleSelectAll?: (allSelected: boolean) => void;
};

const MultiSelect: React.FC<Props> = (props) => {
    const {
        ariaLabel = '',
        options,
        selectedOptions,
        searchable = false,
        selectAll = false,
        handleOptionClick,
        handleSelectAll,
    } = props;

    if (selectAll && !handleSelectAll) {
        throw new Error('Missing function for handling select all');
    }

    const [showOptions, setShowOptions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allSelected, setAllSelected] = useState(false);

    const filteredOptions = useMemo(
        () =>
            options.filter(
                (option) =>
                    !searchTerm ||
                    option.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [options]
    );

    useEffect(() => {
        if (!selectedOptions) {
            return;
        }

        setAllSelected(options.length === selectedOptions.length);
    }, [selectedOptions]);

    const handleSelectAllClick = () => {
        setAllSelected(!allSelected);
        if (handleSelectAll) {
            handleSelectAll(!allSelected);
        }
    };

    return (
        <div className="w-100 mt-1 mb-1 text-black">
            <div className="relative">
                {searchable ? (
                    <div
                        data-testid="searchable-input"
                        className="flex justify-between w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-default sm:text-sm"
                        aria-haspopup="listbox"
                        aria-expanded={showOptions}
                        aria-labelledby={ariaLabel}
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <input
                            type="text"
                            className="w-full bg-transparent border-none focus:outline-none"
                            placeholder="Select..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowOptions(true)}
                        />
                        <span
                            data-testid="arrow-icon-wrapper"
                            className={`transform ${
                                showOptions ? '-rotate-90' : 'rotate-90'
                            }`}
                        >
                            <RightArrow />
                        </span>
                    </div>
                ) : (
                    <button
                        className="flex justify-between w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-default sm:text-sm"
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
                    className={`mt-1 w-full rounded-md bg-white shadow-lg ${
                        showOptions ? 'block' : 'hidden'
                    }`}
                    aria-live="polite"
                >
                    <ul
                        className="rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        role="listbox"
                        aria-labelledby={ariaLabel}
                    >
                        {selectAll && (
                            <li
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9"
                                role="option"
                                aria-selected={allSelected}
                            >
                                <div className="flex items-center">
                                    <input
                                        data-testid="select-all-option"
                                        type="checkbox"
                                        id="select-all"
                                        checked={allSelected}
                                        onChange={handleSelectAllClick}
                                        className="h-4 w-4 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="select-all"
                                        className="ml-3 block truncate"
                                    >
                                        Select All
                                    </label>
                                </div>
                            </li>
                        )}

                        {filteredOptions.map((type, index) => (
                            <li
                                key={index}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9"
                                role="option"
                                aria-selected={selectedOptions?.includes(type)}
                            >
                                <div className="flex items-center">
                                    <input
                                        data-testid={type}
                                        id={type}
                                        type="checkbox"
                                        checked={selectedOptions?.includes(
                                            type
                                        )}
                                        onChange={() => handleOptionClick(type)}
                                        className="h-4 w-4 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={type}
                                        className="ml-3 block truncate"
                                    >
                                        {type}
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
