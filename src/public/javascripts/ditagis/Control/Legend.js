define([
    'L',
    'css!ditagis/Control/Legend.css'
], function (L) {
    'use strict';

    L.Control.Legend = L.Control.extend({
        options: {
            position: 'topright',
            width: '250px',
            //height: '100%',
            delay: '5',
            legends: [
                '#228959',
                '#20C063',
                '#62EE91',
                '#E1DC0A',
                '#FC951E',
                '#F94E32',
                '#B51D02'
            ],
            heading: 'Giá đất',
            values: ['500tr', '2tỷ']
        },

        initialize: function (options) {
            L.Util.setOptions(this, options);
        },

        onAdd: function (map) {
            this._map = map;
            const layers = map.layers;
            for (let layer of layers) {
                layer.on('set-params add', (evt) => {
                    const style = evt.type === 'set-params'?evt.params.styles:evt.target.wmsParams.styles;
                    if (style) {
                        let link = 'http://ditagis.com:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=' + style;
                        this.changeImage(link);
                    }
                })
            }
            this._container = L.DomUtil.create('div', 'leaflet-control leaflet-control-legend');

            // var div = L.DomUtil.create('div', 'map-control backgroundBasic h7 mvn phs txtC', this._container);
            // var heading = L.DomUtil.create('div', 'map-typeEmphasize', div);
            // heading.innerText = this.options.heading;
            // var ul = L.DomUtil.create('ul', 'listInline  typeLowlight', div);
            // var firstLi = L.DomUtil.create('li', 'pbs', ul);
            // firstLi.innerText = '<' + this.options.values[0];
            // var legendLi = L.DomUtil.create('li', '', ul);
            // for (var i in this.options.legends) {
            //     var color = this.options.legends[i];
            //     var lg = '<div class="mapTileLegendGradient" style="background-color: ' + color + ';"></div>';
            //     legendLi.innerHTML += lg;
            // }
            // var lastLi = L.DomUtil.create('li', 'pbs', ul);
            // lastLi.innerText = this.options.values[1] + ' +';
            this.image = L.DomUtil.create('img', null, this._container);
            this.image.src = 'http://ditagis.com:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=postgres:ThuaDat';
            L.DomEvent.disableClickPropagation(this._container);
            return this._container;
        },
        layerAddHandler(layer) {

        },
        changeImage(link) {
            this.image.src = link;
        },

    });

    return function (options) {
        return new L.Control.Legend(options);
    }

});