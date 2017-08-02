define(['L'], function (L) {
    L.Control.Watermark = L.Control.extend({
        options: {
            src: '../../Content/images/logo-dtg.png',
            width: '200px',
            position: 'bottomleft'
        },
        initialize: function (options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {

            var img = L.DomUtil.create('img');

            img.src = this.options.src;
            img.style.width = this.options.width;

            return img;
        },

        onRemove: function (map) {
            // Nothing to do here
        }
    });

    return function (opts) {
        return new L.Control.Watermark(opts);
    }
});