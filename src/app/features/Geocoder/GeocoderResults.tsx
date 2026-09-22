import { useMap } from '@/app/contexts/MapContexts';

import { Typography } from '@/app/components/common/Typography';

import { MAP_ID } from '@/app/features/MainMap/config';

import type { GeocoderResult } from '@/app/hooks/useGeocoder';

type Props = {
    results: GeocoderResult[];
};

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
            className="w-full bg-clip-padding overflow-hidden bg-background border-b border-gray-300 rounded"
        >
            <ul
                aria-label="Geocoder results"
                className="flex flex-col gap-0 max-h-72 overflow-y-auto"
            >
                {results.map((result, index) => {
                    const name = formatName(result);

                    return (
                        <li
                            key={index}
                            tabIndex={0}
                            className="hover:bg-blue-100 px-3 py-2 cursor-pointer"
                            onClick={() => {
                                map?.fitBounds(
                                    result.feature.properties.bounds
                                );
                            }}
                            title={`${name} - ${result.feature.properties.uri}`}
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
                                    className="break-all text-gray-600"
                                >
                                    {result.feature.properties.uri}
                                </Typography>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

function formatName(result: GeocoderResult): string {
    switch (result.type) {
        case 'state':
            return result.feature.properties.name;

        case 'county':
            return `${result.feature.properties.name} County, ${result.feature.properties.stateName}`;

        default:
            return '';
    }
}
