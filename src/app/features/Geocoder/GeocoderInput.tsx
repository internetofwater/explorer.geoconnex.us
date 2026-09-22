import { useEffect, useState } from 'react';

import { useGeocoder } from '@/app/hooks/useGeocoder';

import { GeocoderResults } from '@/app/features/Geocoder/GeocoderResults';

import CloseIcon from '@/app/assets/icons/Close';

import type { GeocoderResult } from '@/app/hooks/useGeocoder';

/**
 * Renders the geocoder search input and results, when applicable. The search
 * request lifecycle is managed by useGeocoder and synced with component state.
 */
export const GeocoderInput: React.FC = () => {
    const [results, setResults] = useState<GeocoderResult[]>([]);

    const { query, setQuery, state } = useGeocoder();

    useEffect(() => {
        if (state.status === 'success') {
            setResults(state.results);
            return;
        }

        if (state.status === 'idle' || state.status === 'error') {
            setResults([]);
        }

        if (state.status === 'error') {
            // eslint-disable-next-line no-console
            console.error('Error fetching search results: ', state.error);
        }
    }, [setResults, state]);

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor="search-input" className="sr-only">
                Search by state or county
            </label>

            <div className="relative">
                <input
                    type="text"
                    id="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by state or county..."
                    aria-label="Search by state or county"
                    className="w-full h-11 border border-gray-500 px-3 py-2 rounded"
                />

                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                    <Loader isLoading={state.status === 'searching'} />

                    <button
                        title="Clear geocoder"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                        }}
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {results.length > 0 && <GeocoderResults results={results} />}
        </div>
    );
};

/**
 * 3 dots fade SVG loader icon. See
 * https://magecdn.com/tools/svg-loaders/3-dots-fade.
 */
const Loader = ({ isLoading }: { isLoading: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={16}
        fill="var(--secondary)"
        className={`${isLoading ? 'block' : 'hidden'}`}
    >
        <circle cx="4" cy="12" r="3" opacity="1">
            <animate
                id="loader_1"
                begin="0;loader_2.end-0.25s"
                attributeName="opacity"
                dur="0.75s"
                values="1;.2"
                fill="freeze"
            />
        </circle>
        <circle cx="12" cy="12" r="3" opacity=".4">
            <animate
                begin="loader_1.begin+0.15s"
                attributeName="opacity"
                dur="0.75s"
                values="1;.2"
                fill="freeze"
            />
        </circle>
        <circle cx="20" cy="12" r="3" opacity=".3">
            <animate
                id="loader_2"
                begin="loader_1.begin+0.3s"
                attributeName="opacity"
                dur="0.75s"
                values="1;.2"
                fill="freeze"
            />
        </circle>
    </svg>
);
