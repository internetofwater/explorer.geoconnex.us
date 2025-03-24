import RightArrow from '@/app/assets/icons/RightArrow';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from './Typography';

type Props = {
    ariaLabel?: string;
    options: string[];
    selectedOptions: string[] | undefined;
    handleOptionClick: (type: string) => void;
    limit?: number;
    searchable?: boolean;
    selectAll?: boolean;
    handleSelectAll?: (allSelected: boolean) => void;
};

const MultiSelect: React.FC<Props> = (props) => {
    const {
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
    const [allSelected, setAllSelected] = useState(false);
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
        <div className="w-100 mt-1 mb-1 text-black" ref={dropdownRef}>
            <div className="relative">
                {searchable ? (
                    <div
                        data-testid="searchable-input"
                        className="flex justify-between w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-default sm:text-sm"
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
                    className={`mt-1 w-full max-h-96 overflow-y-auto text-center rounded-md bg-white border border-gray-300 shadow-lg ${
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
                        className=" py-1 text-base overflow-auto sm:text-sm"
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
                                aria-selected={allSelected}
                            >
                                <div className="flex items-center">
                                    <input
                                        data-testid="select-all-option"
                                        type="checkbox"
                                        id="select-all"
                                        checked={allSelected}
                                        onChange={() => {
                                            handleSelectAllClick();
                                            if (inputRef.current) {
                                                inputRef.current.focus({
                                                    preventScroll: true,
                                                });
                                            }
                                        }}
                                        className="h-4 w-4 rounded cursor-pointer"
                                    />
                                    <label
                                        htmlFor="select-all"
                                        className="ml-3 block font-bold truncate cursor-pointer"
                                    >
                                        Select All
                                    </label>
                                </div>
                            </li>
                        )}

                        {limitedOptions.map((type, index) => (
                            <li
                                key={index}
                                className="select-none relative py-2 pl-3 pr-9"
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
                                        onChange={() => {
                                            handleOptionClick(type);
                                            if (inputRef.current) {
                                                inputRef.current.focus({
                                                    preventScroll: true,
                                                });
                                            }
                                        }}
                                        className="h-4 w-4 rounded cursor-pointer"
                                    />
                                    <label
                                        htmlFor={type}
                                        className="ml-3 block truncate cursor-pointer"
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
