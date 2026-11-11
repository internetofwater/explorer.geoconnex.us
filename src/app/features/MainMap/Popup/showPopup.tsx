/**
 * Copyright 2025 Lincoln Institute of Land Policy
 * SPDX-License-Identifier: Apache-2.0
 */

import { Map, MapMouseEvent, Popup as PopupType } from 'mapbox-gl';
import { Root } from 'react-dom/client';
import { MainstemData } from '@/app/types';
import Popup from '@/app/features/MainMap/Popup';
import { LOCATION_IDENTIFIER } from '../consts';

export const showPopup = (
    map: Map,
    e: MapMouseEvent,
    root: Root,
    container: HTMLDivElement,
    persistentPopup: PopupType,
    checkIdentifier = false,
    featureProperties?: MainstemData
) => {
    const identifier = JSON.stringify({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    const currentIdentifier = container.getAttribute(LOCATION_IDENTIFIER);
    // Dont recreate the same popup for the same feature
    if (!checkIdentifier || identifier !== currentIdentifier) {
        container.setAttribute(LOCATION_IDENTIFIER, identifier);

        const close = () => {
            persistentPopup.remove();
        };

        root.render(
            <Popup
                e={e}
                close={close}
                name={featureProperties?.name_at_outlet}
            />
        );

        persistentPopup
            .setLngLat(e.lngLat)
            .setDOMContent(container)
            .setMaxWidth('fit-content')
            .addTo(map);
    }
};
