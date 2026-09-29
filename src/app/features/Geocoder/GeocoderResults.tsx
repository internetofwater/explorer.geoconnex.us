import { GEOCODER_RESULTS_LIMIT } from '@/app/hooks/useGeocoder';

import { useMap } from '@/app/contexts/MapContexts';

import { Typography } from '@/app/components/common/Typography';

import { MAP_ID } from '@/app/features/MainMap/config';

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

    const { map } = useMap(MAP_ID);

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

                                return (
                                    <li
                                        key={uri}
                                        tabIndex={0}
                                        className="hover:bg-blue-100 px-3 py-2 cursor-pointer"
                                        onClick={() => {
                                            map?.fitBounds(
                                                result.feature.properties.bounds
                                            );
                                        }}
                                        title={`${name} - ${uri}`}
                                        role="option"
                                    >
                                        <div className="flex flex-col gap-0">
                                            <Typography
                                                variant="body-small"
                                                className="grow-0"
                                            >
                                                <strong>{name}</strong>
                                            </Typography>

                                            <Typography
                                                variant="body-small"
                                                className="break-all line-clamp-1"
                                            >
                                                {uri}
                                            </Typography>
                                        </div>
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
