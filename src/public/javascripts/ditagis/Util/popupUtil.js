define([
    'L'
], function (L) {
    'use strict';
    return class {
        static show(map, latlng, content) {
            var popup = L.popup({
                maxWidth: 800,
                maxHeight:252
            })
                .setLatLng(latlng)
                .setContent(content);
            popup.openOn(map);
            return popup;
        }
    }

});