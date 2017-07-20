define(['L',
    "ditagis/Util/popupUtil",
    "ditagis/support/Query",
    "ditagis/support/QueryTask",

], function (L, popupUtil, Query, QueryTask) {
    L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
        options: {},
        initialize: function (url, options) {
            L.TileLayer.WMS.prototype.initialize.call(this, url, options)
            this._url = url;
            L.Util.setOptions(this, options);
            this.name = options.name;
            this.id = options.id
        },
        _thuadatid: undefined,
        _loaithuadat: undefined,
        onAdd: function (map) {
            // Triggered when the layer is added to a map.
            //   Register a click listener, then do all the upstream WMS things
            L.TileLayer.WMS.prototype.onAdd.call(this, map);
            map.on('click', this.mouseClickEvent, this);
            // map.on('mouseover', this.mouseOverEvent, this);
            this._thuadatid = L.DomUtil.get('thuadatid');
            this._loaithuadat = L.DomUtil.get('loaithuadat');
        },

        onRemove: function (map) {
            this.map = map;
            // Triggered when the layer is removed from a map.
            //   Unregister a click listener, then do all the upstream WMS things
            L.TileLayer.WMS.prototype.onRemove.call(this, map);
            map.off('click', this.mouseClickEvent, this);
            // map.off('mouseover', this.mouseOverEvent, this);
        },
        mouseClickEvent: function (evt) {
            //nếu có outfield thì mới hiển thị
            if (this.options.outField) {
                if (this._map) {
                    const zoom = this._map.getZoom();
                    if (zoom) {
                        //nếu hiển thị thì mới tìm kiếm
                        if ((this.options.minZoom !== undefined && zoom >= this.options.minZoom) &&
                            (this.options.maxZoom !== undefined && zoom <= this.options.maxZoom)) {
                            this.getFeatureInfo(evt.latlng);
                        }
                    }
                }
            }
        },
        getPopupContent(props) {
            var div = null;
            //nếu có outfield thì mới generate popup
            if (this.options.outField) {
                var div = L.DomUtil.create('div');
                var table = L.DomUtil.create('table', 'table-bordered', div);
                var tbody = L.DomUtil.create('tbody', null, table);
                //nếu có outfield thì hiển thị theo outfield
                //nếu outfield là * thì hiển thị tất cả
                if (this.options.outField[0] === '*') {
                    for (let name in props) {
                        const value = props[name];
                        if (value) {
                            var tr = L.DomUtil.create('tr', null, tbody),
                                tdName = L.DomUtil.create('td', null, tr),
                                tdValue = L.DomUtil.create('td', null, tr);
                                const alias = this.getAlias(name);
                            tdName.innerText = alias || name;
                            tdValue.innerText = value;
                        }
                    }
                }
                //hiển thị theo outField
                else if (this.options.outField) {
                    for (var i in this.options.outField) {
                        var value = props[this.options.outField[i]];
                       if (value) {
                            var tr = L.DomUtil.create('tr', null, tbody),
                                tdName = L.DomUtil.create('td', null, tr),
                                tdValue = L.DomUtil.create('td', null, tr);
                                const alias = this.getAlias(name);
                            tdName.innerText = alias || name;
                            tdValue.innerText = value;
                        }
                    }
                }

                var a = L.DomUtil.create('a', '', div);
                a.setAttribute('data-toggle', 'modal');
                a.setAttribute('data-target', '#updatePrice');
                a.innerText = "Cung cấp giá đất";
                a.setAttribute('href', '#');
            }
            return div;
        },
        _supplyPrice: function (thuadatid, loaithuadat) {
            this._thuadatid.value = thuadatid,
                this._loaithuadat.value = loaithuadat;
        },
        generateParams(latlng) {
            var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
                size = this._map.getSize(),

                params = {
                    request: 'GetFeatureInfo',
                    service: 'WMS',
                    srs: 'EPSG:4326',
                    styles: this.wmsParams.styles,
                    transparent: this.wmsParams.transparent,
                    version: this.wmsParams.version,
                    format: this.wmsParams.format,
                    bbox: this._map.getBounds().toBBoxString(),
                    height: size.y,
                    width: size.x,
                    layers: this.wmsParams.layers,
                    query_layers: this.wmsParams.layers,
                    info_format: 'application/json'
                };

            params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
            params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
            return params;
        },
        getFeatureInfo: function (latlng) {

            let queryTask = new QueryTask(this._url);
            let query = new Query({
                params: this.generateParams(latlng)
            })
            queryTask.execute(query).then((features) => {
                if (features != undefined && features.length > 0) {
                    var ft = features[0];
                    if (ft.properties != undefined) {
                        var content = this.getPopupContent(ft.properties);

                        //cap nhat gia tri cho bien input id=thuadatid voi gia tri objectid vao form updatePrice
                        //muc dich khi nguoi dan cung cap gia dat thi khi POST len server se biet duoc nguoi dan dang cung cap gia dat cho thua dat nao
                        // day la vi du khi click vao thua dat co objectid la 4443
                        //<input type="hidden" name="thuadatid" id="thuadatid" class="form-control" value="thuadat.4443">
                        var thuadatid = ft.id.match(/\d+/);
                        var loaithuadat = ft.id.match(/[a-zA-Z]+/);
                        this._supplyPrice(thuadatid, loaithuadat);
                        //neu co noi dung hien thi 
                        if (content != undefined) {
                            //thi goi den ham showresult de hien thi popup
                            // showResults(err, latlng, content);
                            popupUtil.show(this._map, latlng, content)
                        }
                        // nếu không có content thì chỉ cần fly đến vị trí latlng
                        else {
                            this._map.flyTo(latlng, 18);
                        }
                    }
                }
            }).catch((err) => {
                console.log(err);
            })
        },
        setParams: function (params, noRedraw) {
            this.fire('set-params', {
                params: params
            });
            return L.TileLayer.WMS.prototype.setParams.call(this, params, noRedraw);
        },
        /**
         * Lấy thông tin của Features
         * @param {ditagis/support/Query} query 
         */
        getFeatures(query) {
            return new Promise((resolve, reject) => {
                let queryTask = new QueryTask(this._url);
                query.typeName = this.options.layers;
                queryTask.execute(query).then((features) => {
                    resolve(features);
                }).catch((err) => {
                    reject(err);
                })

            });
        },
        /**
         * Lấy alias của thuộc tính
         * @param {Stirng} name tên của thuộc tính
         */
        getAlias(name){
            const layerInfos = this.options.layerInfos;
            if(layerInfos){
                for(let info of layerInfos) {
                    if(info.name === name){
                        return info.alias;
                    }
                }
            }
            return null;
        }
    });

    return function (url, options) {
        return new L.TileLayer.BetterWMS(url, options);
    };
});