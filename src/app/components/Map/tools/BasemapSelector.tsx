import { BasemapStyles } from '@/app/components/Map/types';
import { basemaps } from '@/app/components/Map/consts';

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
            <h6 className="text-lg font-bold">Basemaps</h6>
            <div className="flex flex-col space-y-2 p-1">
                {Object.keys(basemaps).map((key) => (
                    <label key={key} className="flex items-center space-x-2">
                        <input
                            id={`basemap-selector-${key}`}
                            type="radio"
                            name={basemaps[key as keyof typeof basemaps]}
                            value={basemaps[key as keyof typeof basemaps]}
                            checked={
                                style === basemaps[key as keyof typeof basemaps]
                            }
                            onChange={() =>
                                handleStyleChange(
                                    basemaps[key as keyof typeof basemaps]
                                )
                            }
                            className="form-radio text-blue-600"
                            tabIndex={0}
                        />
                        <span className="text-gray-700 capitalize">
                            {key.replace(/-/g, ' ')}
                        </span>
                    </label>
                ))}
            </div>
        </>
    );
};

export default BasemapSelector;
