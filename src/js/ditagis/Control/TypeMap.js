define([
    'L',
    'css!ditagis/Control/TypeMap.css'
], function (L) {
    'use strict';
    L.Control.TypeMap = L.Control.extend({
        options: {
            position: 'bottomright',
            width: '250px',
            //height: '100%',
            delay: '5'
        },
        initialize: function (layers, options) {
            L.Util.setOptions(this, options);
            this._layers = layers;
            this.initStatus();

        },
        fireEvent(layer) {
            layer.on('add remove', (evt) => {
                this.changedLayer(evt.target, evt.type);
            })
        },
        initStatus() {
            let status = [];
            for (let layer of this._layers) {
                status[layer.id] = {
                    layer: layer,
                    expandItems: [],
                    container: null,
                    displayContainer: function () {
                        if (this.container) {
                            this.container.classList.remove('hidden');
                        }
                    },
                    hiddenContainer: function () {
                        if (this.container) {
                            this.container.classList.add('hidden');
                        }
                    }
                };
            }
            this.status = status;
        },

        onAdd: function (map) {
            this._map = map;
            // this._map.on('addlayer', (evt) => {
            //     this.changeLayer(evt);
            // })
            map.on('zoomend', this.checkVisibleLayers, this);
            this.initView();
            for (let layer of this._layers) {
                let container = this.initContainer(layer);
                let status = this.status[layer.id];
                if (status)
                    status.container = container;
                this.fireEvent(layer);
            }
            return this._container;
        },
        onRemove: function (map) {
            for (let layer of this._layers) {
                layer.off('add');
            }
        },
        initView: function () {

            this._container = L.DomUtil.create('div', 'leaflet-control-typemap leaflet-control');
            L.DomEvent.disableClickPropagation(this._container);
            return this._container;
        },
        /**
         * Thay đổi layer khi map thêm hoặc xóa
         * @param {L.tileLayer.wms} layer 
         * @param {String} mode 
         */
        changedLayer(layer, mode) {
            let status = this.status[layer.id],
                layerContainer = status.container;

            switch (mode) {
                //neu nhu la layer duoc them vao
                case 'add':
                    status.displayContainer();
                    break;
                case 'remove':
                    status.hiddenContainer();
                    break;

                default:
                    throw `Không xác định được sự kiện ${mode}`
            }
        },
        /**
         * Khởi tạo container cho layer
         * @param {L.title.wms} layer
         */
        initContainer(layer) {
            var div = L.DomUtil.create('div', 'hidden backgroundBasic h7 mvn phs txtC', this._container);
            var ul = L.DomUtil.create('ul', 'fieldGroup', div);
            for (var i in layer.options.typemap) {
                let element = layer.options.typemap[i],
                    li = L.DomUtil.create('li', 'mtn', ul),
                    span = L.DomUtil.create('span', 'fieldItem', li),
                    label = L.DomUtil.create('label', 'pls', span);


                var input = L.DomUtil.create('input', 'mrs', label);
                input.setAttribute('type', 'radio');
                input.setAttribute('value', element.style);
                input.setAttribute('data-index', i)
                input.setAttribute('name', `maptype-${layer.id}`)
                if (element.checked)
                    input.setAttribute('checked', '');
                input.layer = layer;
                L.DomEvent.on(input, 'click', this._onInputClick, this);
                let labelSpan = L.DomUtil.create('span', null, label);
                labelSpan.innerHTML = element.name;


                const subs = element.subs;
                if (element.subs != undefined) {
                    var ul1 = L.DomUtil.create('ul', 'expandItems', span);
                    for (var j in subs) {
                        let item = subs[j],
                            li1 = L.DomUtil.create('li', '', ul1),
                            label = L.DomUtil.create('label', 'pls-child', li1),
                            input = L.DomUtil.create('input', 'mrs', label);
                        input.setAttribute('type', 'radio');
                        input.setAttribute('value', item.style);
                        input.setAttribute('data-index', j)
                        input.setAttribute('name', `subtype-${layer.id}-${i}`)
                        if (item.checked)
                            input.setAttribute('checked', '');
                        input.layer = layer;
                        let labelSpan = L.DomUtil.create('span', null, label);
                        labelSpan.innerHTML = item.name;
                        L.DomEvent.on(input, 'click', this._onInputExpandClick, this);
                        // load tat ca layers theo gia tri mac dinh
                        if (item.checked) {
                            this._onInputExpandClick({
                                target: input
                            });
                        }
                    }
                    this.status[layer.id].expandItems.push(ul1);

                }

                // load tat ca layers theo gia tri mac dinh
                if (element.checked) {
                    this._onInputClick({
                        target: input
                    });
                }


            }
            return div;
        },
        _onInputClick(event) {
              //lấy những giá trị cần
            var input = event.target,
            style = input.value,//lấy style
                layer = input.layer,//lấy layer
                index = parseInt(input.getAttribute('data-index')),//lấy index
                settings = layer.options.typemap,//lấy typemaps
                item = settings[index];//lấy typemap
            this.setStyle(layer,style);
            let subs = item.subs,
                status = this.status[layer.id];
            //tat het cac expand
            for (var item of status.expandItems) {
                item.style.display = 'none';
            }
            //neu input hien tai co expand thi mo no ra
            if (subs && subs.length > 0) {
                //kiem tra su kien onchange

                var span = input.parentElement.parentElement;
                var expandItemNodes = span.childNodes[1];

                expandItemNodes.style.display = 'block';


            }
        },
        /**
         * Thay đổi style của layer thông qua giá trị radioInput
         * @param {input type radio} radioInput 
         * @param {string} style 
         */
        setStyle(layer,style){
          
            layer.setParams({
                styles: style
            })
        },
        _onInputExpandClick(event) {
              //lấy những giá trị cần
            var input = event.target,
            style = input.value,//lấy style
                layer = input.layer,//lấy layer
                index = parseInt(input.getAttribute('data-index')),//lấy index
                settings = layer.options.typemap,//lấy typemaps
                item = settings[index];//lấy typemap
           this.setStyle(layer,style);
        },

        checkVisibleLayer(layer) {
            const zoom = this._map.getZoom();

            return (layer.options.minZoom !== undefined && zoom >= layer.options.minZoom) &&
                (layer.options.maxZoom !== undefined && zoom <= layer.options.maxZoom);

        },
        checkVisibleLayers() {
            const zoom = this._map.getZoom();
            for (let layer of this._layers) {
                let status = this.status[layer.id];
                const visible = this.checkVisibleLayer(layer);
                if (visible && layer._map)
                    status.displayContainer();
                else
                    status.hiddenContainer();
            }
        },

    });

    return function (layers, options) {
        return new L.Control.TypeMap(layers, options);
    }
});