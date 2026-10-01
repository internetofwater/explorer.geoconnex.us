import { useDispatch, useSelector } from 'react-redux';

import { setGeocoderResult } from '@/lib/state/main/slice';

import { useMap } from '@/app/contexts/MapContexts';

import { GEOCODER_RESULTS_LIMIT } from '@/app/hooks/useGeocoder';

import { Typography } from '@/app/components/common/Typography';

import { GEOCODER_COLOR, MAP_ID } from '@/app/features/MainMap/config';

import type { AppDispatch, RootState } from '@/lib/state/store';
import type {
    GeocoderResult,
    GeocoderResultGroups,
} from '@/app/hooks/useGeocoder';

type Props = {
    results: GeocoderResultGroups;
};

const RESULT_SECTIONS = [
    { type: 'state', label: 'States' },
    { type: 'county', label: 'Counties' },
    { type: 'gnis', label: 'GNIS Features' },
] as const;

/**
 * Renders a list of geocoder results. On click, the map fits to the bounding
 * box of the selected item.
 */
export const GeocoderResults: React.FC<Props> = (props) => {
    const { results } = props;

    const dispatch: AppDispatch = useDispatch();

    const { map } = useMap(MAP_ID);

    const { geocoderResult } = useSelector((state: RootState) => state.main);

    return (
        <div
            aria-live="polite"
            className="w-full bg-clip-padding overflow-hidden bg-primary-opaque border-b border-gray-300 rounded"
        >
            <div className="max-h-72 overflow-y-auto py-2">
                {RESULT_SECTIONS.map(({ type, label }) => (
                    <section key={type} aria-label={label}>
                        <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
                            <h3 className="font-bold shrink-0">{label}</h3>

                            <div className="h-px bg-gray-300 grow"></div>

                            <div className="shrink-0">
                                {results[type].length}
                                {results[type].length === GEOCODER_RESULTS_LIMIT
                                    ? '+'
                                    : ''}{' '}
                                {results[type].length === 1
                                    ? 'result'
                                    : 'results'}
                            </div>
                        </div>

                        <ul aria-label={label} className="flex flex-col gap-0">
                            {results[type].map((result) => {
                                const name = formatName(result);
                                const uri = formatUri(result);

                                const isSelected =
                                    geocoderResult &&
                                    formatUri(geocoderResult) === uri;

                                const handleClick = () => {
                                    dispatch(setGeocoderResult(result));

                                    if (!map) {
                                        return;
                                    }

                                    map.fitBounds(
                                        result.feature.properties.bounds,
                                        {
                                            padding: 80,
                                            speed: 1.2,
                                        }
                                    );
                                };

                                return (
                                    <li
                                        key={uri}
                                        tabIndex={0}
                                        className="hover:bg-blue-100 px-3 py-2 cursor-pointer w-full flex flex-row justify-between items-center"
                                        onClick={handleClick}
                                    >
                                        <div className="flex flex-col gap-0 grow min-w-0">
                                            <button
                                                type="button"
                                                className="flex flex-col gap-0 grow min-w-0 text-left"
                                                title={`${name} - ${uri}`}
                                            >
                                                <Typography
                                                    as="span"
                                                    variant="body-small"
                                                    className="grow-0"
                                                >
                                                    <strong>{name}</strong>
                                                </Typography>
                                            </button>

                                            <Typography
                                                variant="body-small"
                                                className="break-all line-clamp-1"
                                            >
                                                <a
                                                    href={uri}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                    }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline text-black hover:text-secondary"
                                                    title={`${uri} (opens in a new tab)`}
                                                >
                                                    {uri}
                                                </a>
                                            </Typography>
                                        </div>

                                        {isSelected && (
                                            <span
                                                role="img"
                                                aria-label="Visible on map"
                                                title="Visible on map"
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        GEOCODER_COLOR,
                                                }}
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
};

function formatName(result: GeocoderResult): string {
    switch (result.type) {
        case 'state':
            return result.feature.properties.name;

        case 'county':
            return `${result.feature.properties.name} County, ${result.feature.properties.stateName}`;

        case 'gnis':
            return `${result.feature.properties.feature_name}`;

        default:
            return '';
    }
}

function formatUri(result: GeocoderResult): string {
    switch (result.type) {
        case 'state':
            return result.feature.properties.uri;

        case 'county':
            return result.feature.properties.uri;

        case 'gnis':
            return result.feature.properties.id;

        default:
            return '';
    }
}
