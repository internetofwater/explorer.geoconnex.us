import { BasemapStyles } from '@/app/components/Map/types';
import { basemaps } from '@/app/components/Map/consts';
import Image from 'next/image';

type Props = {
    style: BasemapStyles;
    handleStyleChange: (style: BasemapStyles) => void;
};

/**
 * Renders a list of radio buttons for selecting a basemap style.
 * It allows users to change the map style by selecting one of the available basemap options.
 *
 * Props:
 * - style: BasemapStyles - The currently selected basemap style.
 * - handleStyleChange: (style: BasemapStyles) => void - Function to handle changes to the basemap style.
 *
 * @component
 */
export const BasemapSelector: React.FC<Props> = (props) => {
    const { style, handleStyleChange } = props;

    return (
        <>
            <h6 className="text-lg font-bold mb-1">Basemaps</h6>
            <ul className="grid grid-cols-2 gap-2">
                {Object.keys(basemaps).map((key) => (
                    <li
                        role="radio"
                        id={basemaps[key as keyof typeof basemaps]}
                        key={key}
                        onClick={() =>
                            handleStyleChange(
                                basemaps[key as keyof typeof basemaps]
                            )
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleStyleChange(
                                    basemaps[key as keyof typeof basemaps]
                                );
                            }
                        }}
                        tabIndex={0}
                        className={`p-2 pb-1
                                border ${
                                    style ===
                                    basemaps[key as keyof typeof basemaps]
                                        ? 'border-gray-600'
                                        : 'border-gray-300'
                                }
                                text-center cursor-pointer 
                                bg-primary-opaque hover:bg-primary-opaque-hover focus:bg-primary-opaque-hover
                                hover:border-gray-500 focus:border-gray-500`}
                    >
                        <Image
                            id={key}
                            alt={`Image for ${key.replace(/-/g, ' ')}`}
                            src={`/basemaps/${key}.png`}
                            width={240}
                            height={120}
                        />
                        <label
                            htmlFor={key}
                            className="capitalize mt-1 text-sm"
                        >
                            {key.replace(/-/g, ' ')}
                        </label>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default BasemapSelector;
