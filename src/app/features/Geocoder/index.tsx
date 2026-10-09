import { useState } from 'react';

import IconButton from '@/app/components/common/IconButton';

import { GeocoderInput } from '@/app/features/Geocoder/GeocoderInput';

import SearchIcon from '@/app/assets/icons/Search';

/**
 * Renders visible geocoder input on large screens, and search icon button with
 * ability to toggle geocoder input visibility on small screens.
 */
const Geocoder: React.FC = () => {
    const [showGeocoder, setShowGeocoder] = useState(false);

    return (
        <div id="geocoder" className="w-[20rem] sm:w-[24rem] flex gap-">
            <IconButton
                title={`${showGeocoder ? 'Hide' : 'Show'} Geocoder`}
                className="lg:hidden shrink-0"
                onClick={() => {
                    setShowGeocoder(!showGeocoder);
                }}
            >
                <SearchIcon className="fill-secondary" />
            </IconButton>

            <div
                className={`w-full ${showGeocoder ? 'block' : 'hidden lg:block'}`}
            >
                <GeocoderInput />
            </div>
        </div>
    );
};

export default Geocoder;
