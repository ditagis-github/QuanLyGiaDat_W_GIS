define([
    'L',
    'css!ditagis/Control/Search.css'
], function (L) {
    'use strict';
    L.Control.Search = L.Control.extend({
        options: {
            position: 'topright',
            sources: [
                {
                    layer: null,//layer cần tìm kiếm,
                    name:"",//tên hiển thị trong mục chọn source tìm kiếm, mặc định là layer.name
                    searchFields: ["*"],//những field được tìm kiếm
                    outField: ["*"],//những field được in ra khi request dữ liệu
                    placeHolder: "",//chữ ẩn ở trong khung nhập nội dung tìm kiếm
                    displayField: ""//field được hiển thị khi kết quả tìm kiếm xuất hiện
                }
            ],
            // sources: [{
            //     name: 'Tất cả',
            //     value: undefined
            // }, {
            //     name: 'Số thửa',
            //     value: 'sothua'
            // }, {
            //     name: 'Số tờ bản đồ',
            //     value: 'sotobando'
            // }, {
            //     name: 'Giá đất',
            //     value: 'giadat'
            // }],
            textPlaceHolder: 'Nhập nội dung tìm kiếm',
            estatePrice: 1000000.0,
            outField: {
                tenchusohuu: 'Tên chủ sở hữu',
                sotobando: 'Số tờ bản đồ',
                sothua: 'Số thửa',
                sothuacu: 'Số thửa cũ',
                dientich: 'Diện tích',
                diachithuadat: 'Địa chỉ',
                giadat: 'Giá đất',
                giattdagiaodich: 'Giá đã giao dịch',
                giatttk: 'Giá thị trường',
                giadodancungcap: 'Giá người dân cung cấp'
            }
        },

        _expandList: [],

        initialize: function (options) {

            L.Util.setOptions(this, options);

        },

        _dropdownActive: undefined,
        _sourceValue: undefined,
        _icon: undefined,
        createElement: function (dom, className = undefined, parent = undefined) {
            var d = document.createElement(dom);
            if (className != undefined)
                d.className = className;
            parent.appendChild(d);
            return d;
        },
        _divResult: undefined,
        _ulResult: undefined,
        onAdd: function (map) {
            this._map = map;
            this._container = initView();
            return this._container;
        },
        initView() {
            var container = L.DomUtil.create('div', 'esri-component esri-search esri-widget leaflet-control');
            // L.DomEvent.on(container,'focus',this._expandContainer,this);
            var searchContainer = L.DomUtil.create('div', 'esri-search--multiple-sources esri-search__container', container);
            var divButton = L.DomUtil.create('div', 'esri-search__sources-button esri-widget-button', searchContainer);
            var spanDropdown = L.DomUtil.create('span', '', divButton);
            var icon = L.DomUtil.create('i', 'fa fa-arrow-down', spanDropdown);
            this._icon = icon;
            L.DomEvent.on(spanDropdown, 'click', this._spanArrowClick, this);

            var span2 = L.DomUtil.create('span', 'esri-search__source-name', divButton);
            span2.innerText = 'Tất cả';
            var divDropdown = L.DomUtil.create('div', 'esri-menu', searchContainer);
            this._divDropdown = divDropdown;
            if (this.options.sources.length > 0) {
                var ul = L.DomUtil.create('ul', '', divDropdown);
                for (let i in this.options.sources) {
                    let element = this.options.sources[i];
                    let li = L.DomUtil.create('li', 'esri-search__source' + (i == 0 ? ' active' : ''), ul);
                    li.setAttribute('data-value', element.layer.id);
                    li.innerText = element.name || element.layer.name;
                    if (i == 0) {
                        this._dropdownActive = li;
                    }
                    L.DomEvent.on(li, 'click', this._itemSourceClick, this);
                }
            }

            var divResult = L.DomUtil.create('div', 'esri-menu', searchContainer);
            this._divResult = divResult;
            var ulResult = L.DomUtil.create('ul', '', divResult);
            this._ulResult = ulResult;

            var inputContainer = L.DomUtil.create('div', 'esri-search__input-container', searchContainer);
            var divInput = L.DomUtil.create('div', 'esri-search__input-container', inputContainer);
            var input = L.DomUtil.create('input', 'esri-search__input', divInput);
            input.setAttribute('placeholder', element.placeHolder);
            input.setAttribute('type', 'text');
            this._inputSearch = input;
            L.DomEvent.on(input, 'keyup', function (event) {

                if (input.value.length > 0)
                    this._divClear.style.display = 'block';
                else
                    this._divClear.style.display = 'none';
            }, this);
            L.DomEvent.on(input, 'change', this._inputChange, this)

            var divClear = L.DomUtil.create('div', 'esri-search__clear-button esri-widget-button', inputContainer);
            divClear.setAttribute('title', 'Xóa tìm kiếm');
            this._divClear = divClear;

            var spanClear = L.DomUtil.create('span', 'fa fa-times', divClear);
            spanClear.setAttribute('aria-hidden', 'true');
            L.DomEvent.on(spanClear, 'click', function (event) {
                this._showDivResult(false);
                this._inputSearch.value = '';
                //hidden
                this._divClear.style.display = 'none';
            }, this); { /*<span aria-hidden="true" class="esri-icon-close"></span>*/ }

            var btnSearchContainer = L.DomUtil.create('div', 'esri-search__submit-button esri-widget-button', searchContainer);
            var btnSearch = L.DomUtil.create('span', 'esri-icon-search', btnSearchContainer);
            L.DomEvent.on(btnSearch, 'click', this._getFeatureInfo, this);
            btnSearch.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';

            L.DomEvent.disableClickPropagation(container);
            return container;
        },
        _inputChange: function (event) {

        },
        _clearResultClick: function () {

        },
        _expandContainer: function () {
            container.style.width = '500px';
        },
        _unExpandContainer: function () {
            container.removeAttribute('style');
        },

        _getTextSearch: function () {
            return this._inputSearch.value;
        },
        _isDropDown: false,
        _showHideDropdown: function () {
            if (!this._isDropDown) { //neu chua nhan vao nut dropdown

                //hien thi mui ten
                this._icon.classList.remove('fa-arrow-down');
                this._icon.classList.add('fa-arrow-up');
                this._divDropdown.classList.add('esri-search__sources-menu');
            } else { //mo len
                this._icon.classList.remove('fa-arrow-up');
                this._icon.classList.add('fa-arrow-down');
                this._divDropdown.classList.remove('esri-search__sources-menu');
            }
            this._isDropDown = !this._isDropDown;
        },
        _spanArrowClick: function (event) {
            var current = event.target.firstChild;
            //khi nhan vao dropdownMenu
            this._showHideDropdown();


        },
        _itemSourceClick: function (event) {
            var item = event.target;

            //bo active cho item truoc
            this._dropdownActive.classList.remove('active')
            //active cho item hien tai
            item.classList.add('active');

            //gan droopdownActive cho item
            this._dropdownActive = item;
            this._sourceValue = item.getAttribute('data-value');
            this._showHideDropdown();

        },
        _url: 'http://112.78.5.153:8080/geoserver/GiaDatGIS/ows',
        _getFeatureInfo: function (evt) {
            // Make an AJAX request to the server and hope for the best
            var url = this._getFeatureInfoUrl(),
                showResults = L.Util.bind(this._showGetFeatureInfo, this),
                getText = L.Util.bind(this._getTextSearch, this),
                dropdownActive = L.Util.bind(this._dropdownActive, this),
                sourceValue = this._sourceValue,
                addResult = L.Util.bind(this._addResult, this),
                showDivResult = L.Util.bind(this._showDivResult, this),
                setCurrentListData = L.Util.bind(this._setCurrentListData, this),
                options = this.options;
            $.ajax({
                url: url,
                success: (data) => {
                    this.displayQueryResult(data);
                },
                error: function (xhr, status, error) {
                    showResults(error);
                }
            });

            
        },
         findData(ft, sourceValue, value, status) {
                var hasData = false; //muc dich kiem tra trong moi vong lap co tim duoc ket qua hay khong
                //neu tim theo gia dat thi cho gia dat nam trong khoang
                //vi du nguoi dung tim gia dat la 5tr thi ta se cho loc nhung du lieu thua dat nao co giadat <= 5tr+CONST && giadat >= 5tr-CONST voi CONST la bien khai bao mac dinh, o trong chuong tirnh nay CONST la 1tr
                if (sourceValue == 'giadat') {
                    var giadat = parseFloat(status.text);
                    //options.estatePrice la bien CONST
                    if (value <= giadat + estatePrice && value >= giadat - estatePrice) {
                        hasData = true;
                    }
                } else {
                    if (value == status.text) {
                        hasData = true;
                    }
                }
                //neu tim duoc ket qua
                if (hasData) {
                    //them ket qua vao danh sach hien thi
                    addResult(ft);
                    if (!status.isHasData)
                        status.isHasData = true;
                    //luu giu lieu data(properties) vao mang
                    status.datas.push(ft);
                }
            },
displayQueryResult (data, status, xhr) {
                    var err = typeof data === 'object' ? null : data;
                    var features = data.features;
                    if (features != undefined && features.length > 0) {
                        var status = {
                            datas: [],
                            text: getText(),
                            isHasData: false
                        }

                        for (var i in features) {
                            var ft = features[i];
                            var properties = ft.properties;
                            if (properties != undefined) {
                                //neu sourceValue = undefined, co nghia la dang tim kiet tat ca
                                if (sourceValue == undefined) {
                                    //duyet het cac doi tuong trong properties
                                    for (var index in properties) {
                                        //lay gia tri cua element
                                        var value = properties[index];
                                        findData(ft, sourceValue, value, status, options.estatePrice);
                                    }
                                } else {
                                    if (properties.hasOwnProperty(sourceValue)) {
                                        var value = properties[sourceValue];
                                        findData(ft, sourceValue, value, status, options.estatePrice);
                                    } else {
                                        continue;
                                    }
                                }


                            }
                        }
                        if (status.isHasData) {
                            showDivResult(true);
                        } else {
                            showDivResult(false);
                        }
                        //set gia tri bien toan cuc listData bang gia tri cua list vua moi tim duoc
                        setCurrentListData(status.datas);

                    }

                },
        _addResult: function (data) {

            //tao the li voi the cha la this._ulResult duoc gan gia tri tai function onAdd
            var li = L.DomUtil.create('li', 'esri-search__source', this._ulResult);

            //gan giatri data-id cho the <li>
            li.setAttribute('data-id', data.id);

            //gan gia tri geometry toa do x,y cho the <li>
            li.setAttribute('data-x', data.geometry.coordinates[0][0][0][1]);
            li.setAttribute('data-y', data.geometry.coordinates[0][0][0][0]);
            //hien thi tenchusohuu
            li.innerText = data.properties.tenchusohuu;
            //gia tri hien thi trong html: <li class="esri-search__source" data-x="106.6970348375311" data-y="10.87584416522746">Trần Văn Tỏ</li>

            //gan noi dung tooltip
            var title = '';
            for (var i in this.options.outField) {
                var value = data.properties[i];
                if (value != undefined) {
                    title += this.options.outField[i] + ": " + value + "\r\n";
                }
                //}
            }
            li.setAttribute('title', title);

            //dang ky su kien click cho the li va goi den ham _resultClick de xu ly
            L.DomEvent.on(li, 'click', this._resultClick, this);

        },
        _resultClick: function (event) {

            //lay the <li> duoc click
            var li = event.target;

            //lay du lieu cua geometry tai data de khi click vao se zoom den vi tri do tren ban do
            //vi du: <li class="esri-search__source" data-x="106.6970348375311" data-y="10.87584416522746">Trần Văn Tỏ</li>
            //vay se lay toa do x = 106.6970348375311, y = 10.87584416522746
            var x = parseFloat(li.getAttribute('data-x')),
                y = parseFloat(li.getAttribute('data-y')),
                id = li.getAttribute('data-id');

            //chuyen vi tri center cua map den x,y va zoom:18 voi hieu ung flyTo
            this._map.flyTo([x, y], 18);
            //hien thi popupContent sau khi da zoom den vi tri x,y

            if (id != undefined && id != null) {
                var data = undefined;
                //duyet danh sach du lieu tim kiem da duoc tim thay hien tai
                //neu nhu tim thay duoc doi tuong data thi getPopupContent va hien thi popup len map
                for (key in this._currentDatas) {
                    var value = this._currentDatas[key];
                    if (value.id == id) {
                        data = value;
                        break;
                    }
                }
                if (data != undefined)
                    //hien thi popup len map
                    this._showGetFeatureInfo([x, y], this._generatePopupContent(data.properties));
            }

        },
        _generatePopupContent: function (data) {
            var content = "<div class='table'>";
            content += "<table class='featureInfo'>";
            //if (options.outField == undefined) {
            //    for (var i in props) {
            //        content += "<tr><td>" + options.outField[i] + "</td><td>" + props[i] + "</td>";
            //    }
            //} else {
            for (var i in this.options.outField) {
                var value = data[i];
                if (value != undefined) {
                    content += "<tr><td>" + this.options.outField[i] + "</td><td>" + value + "</td>";
                }
                //}
            }
            content += "</table></div>";
            return content;
        },
        _setCurrentListData: function (datas) {
            this._currentDatas = datas;
        },
        _showDivResult: function (isShow) {
            if (isShow) {
                this._divResult.classList.add('esri-search__sources-menu');
            } else {
                this._divResult.classList.remove('esri-search__sources-menu');
            }
        },
        defaultWFSParams: {
            service: 'WFS',
            request: 'GetFeature',
            version: '1.0.0',
            typeName: 'GiaDatGIS:thuadat',
            outputFormat: 'json',
            srsName: 'EPSG:4326'
        },
        _getFeatureInfoUrl: function () {
            // Construct a GetFeatureInfo request URL given a point
            var size = this._map.getSize(),

                params = {

                };



            return this._url + L.Util.getParamString(this.defaultWFSParams, this._url, true);
        },

        _showGetFeatureInfo: function (latlng, content) {
            // Otherwise show the content in a popup, or something.
            latlng.lat -= 0.000000000010000;
            L.popup({
                maxWidth: 800
            })
                .setLatLng(latlng)
                .setContent(content)
                .openOn(this._map);
        }

    });

    return function (options) {
        return new L.Control.Search(options);
    }
});