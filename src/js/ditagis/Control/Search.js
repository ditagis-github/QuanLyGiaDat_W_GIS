define([
    'L',
    "ditagis/Util/popupUtil",
    'ditagis/support/Query',
    'ditagis/support/QueryTask',
    'css!ditagis/Control/Search.css'
], function (L, popupUtil, Query, QueryTask) {
    'use strict';
    L.Control.Search = L.Control.extend({
        options: {
            position: 'topright',
            sources: [],
            textPlaceHolder: 'Nhập nội dung tìm kiếm',
            estatePrice: 1000000.0,
        },

        _expandList: [],

        initialize: function (options) {

            L.Util.setOptions(this, options);


        },
        _dropdownActive: undefined,
        sourceValue: undefined,
        _icon: undefined,
        createElement: function (dom, className = undefined, parent = undefined) {
            var d = document.createElement(dom);
            if (className != undefined)
                d.className = className;
            parent.appendChild(d);
            return d;
        },
        /**
         * Hiển thị loading ở khung tìm kiếm
         * @param {boolean} mode: true = Hiển thị
         */
        displayLoading(mode) {
            if (mode) {
                this.searchContainer.classList.add('esri-search--loading');
            } else {
                this.searchContainer.classList.remove('esri-search--loading');
            }
        },
        /**
         * Hiển thị warning ở khung tìm kiếm
         * @param {boolean} mode: true = Hiển thị
         */
        displayWarning(mode) {
            if (mode) {
                this.searchContainer.classList.add('esri-search--warning');
            } else {
                this.searchContainer.classList.remove('esri-search--warning');
            }
        },
        onAdd: function (map) {
            this._map = map;
            this._container = L.DomUtil.create('div', 'esri-component esri-search esri-widget leaflet-control');
            // L.DomEvent.on(this._container,'focus',this._expandContainer,this);
            this.searchContainer = L.DomUtil.create('div', 'esri-search--multiple-sources esri-search__container', this._container);
            var divButton = L.DomUtil.create('div', 'esri-search__sources-button esri-widget-button', this.searchContainer);
            var spanDropdown = L.DomUtil.create('span', '', divButton);
            var icon = L.DomUtil.create('i', 'fa fa-arrow-down', spanDropdown);
            this._icon = icon;
            L.DomEvent.on(spanDropdown, 'click', this._spanArrowClick, this);

            var span2 = L.DomUtil.create('span', 'esri-search__source-name', divButton);
            span2.innerText = 'Tất cả';
            var divDropdown = L.DomUtil.create('div', 'esri-menu', this.searchContainer);
            this._divDropdown = divDropdown;
            if (this.options.sources.length > 0) {
                var ul = L.DomUtil.create('ul', '', divDropdown);
                for (var i in this.options.sources) {
                    var element = this.options.sources[i];
                    var li = L.DomUtil.create('li', 'esri-search__source' + (i == 0 ? ' active' : ''), ul);
                    li.setAttribute('source-index', i);
                    li.innerText = element.name;
                    if (i == 0) {
                        this._dropdownActive = li;
                    }
                    L.DomEvent.on(li, 'click', this.itemSourceClick, this);
                    //mặc đinh chọn source[0] làm source chính
                    if (i == 0) {
                        this.itemSourceClick({
                            target: li
                        })
                        this.displaySourcesMenu(false);
                    }
                }
            }

            this.divResult = L.DomUtil.create('div', 'esri-menu', this.searchContainer);

            this.ulResult = L.DomUtil.create('ul', null, this.divResult);

            this.warningContainer = L.DomUtil.create('div', 'esri-menu esri-search__warning-menu', this.searchContainer);
            this.warningContainer.innerHTML =
                `<div class="esri-search__warning-body">
                    <div>
                        <div class="esri-search__warning-header">
                            Không có kết quả
                        </div>
                        <div class="esri-search__warning-text">
                            Không tìm thấy kết quả nào.
                        </div>
                    </div>
            </div>`;


            var inputContainer = L.DomUtil.create('div', 'esri-search__input-container', this.searchContainer);
            var divInput = L.DomUtil.create('div', 'esri-search__input-container', inputContainer);
            var input = L.DomUtil.create('input', 'esri-search__input', divInput);
            input.setAttribute('placeholder', this.options.textPlaceHolder);
            input.setAttribute('type', 'text');
            this._inputSearch = input;
            L.DomEvent.on(input, 'keyup', function (event) {
                if (event.key === 'Enter') {
                    this.search();
                } else {
                    if (input.value.length > 0)
                        this._divClear.style.display = 'block';
                    else
                        this._divClear.style.display = 'none';
                }
            }, this);
            L.DomEvent.on(input, 'change', this._inputChange, this)

            var divClear = L.DomUtil.create('div', 'esri-search__clear-button esri-widget-button', inputContainer);
            divClear.setAttribute('title', 'Xóa tìm kiếm');
            this._divClear = divClear;

            var spanClear = L.DomUtil.create('span', 'fa fa-times', divClear);
            spanClear.setAttribute('aria-hidden', 'true');
            L.DomEvent.on(spanClear, 'click', () => {
                this.displayWarning(false);
                this._clearResultClick();
            }, this);

            var btnSearchContainer = L.DomUtil.create('div', 'esri-search__submit-button esri-widget-button', this.searchContainer);
            var btnSearch = L.DomUtil.create('span', 'esri-icon-search', btnSearchContainer);
            L.DomEvent.on(btnSearch, 'click', this.search, this);
            btnSearch.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';

            L.DomEvent.disableClickPropagation(this._container);
            return this._container;
        },
        _inputChange: function (event) {

        },
        search() {
            this.displayLoading(true);
            this.displayWarning(false);
            this.getFeatureInfo().then((features) => {
                if (features && features.length > 0) {
                    this.addResults(features);
                    this.showDivResult(true);

                } else {
                    //không tìm thấy kết quả
                    this.displayWarning(true);
                }
                this.displayLoading(false);
            });
        },
        _clearResultClick() {
            this.showDivResult(false);
            this._inputSearch.value = '';
            this.ulResult.innerHTML = '';
            //hidden
            this._divClear.style.display = 'none';
        },
        _expandContainer() {
            this._container.style.width = '500px';
        },
        _unExpandContainer() {
            this._container.removeAttribute('style');
        },

        getTxtSearch() {
            return this._inputSearch.value;
        },
        _isDropDown: false, //cờ để quản lý mở đóng sources menu, nếu true tức là sources menu đang được mở
        /**
         * 
         * @param {boolean} mode: true: hiển thị sources menu
         */
        displaySourcesMenu(mode) {
            mode = mode || !this._isDropDown; //nếu như không có giá trị thì lấy cờ isdropdown
            /**
             * nếu mode là true thì 
             * chuyển sang chế độ hiển thị Sources menu
             * chuyển arrow-down sang arrow-up
             */
            if (mode) {

                this._icon.classList.remove('fa-arrow-down');
                this._icon.classList.add('fa-arrow-up');
                this._divDropdown.classList.add('esri-search__sources-menu');
            }
            /**
             * nếu mode là false thì 
             * chuyển sang chế độ ẩn Sources menu
             * chuyển arrow-up sang arrow-down
             */
            if (!mode) {
                this._icon.classList.remove('fa-arrow-up');
                this._icon.classList.add('fa-arrow-down');
                this._divDropdown.classList.remove('esri-search__sources-menu');
            }
            this._isDropDown = !this._isDropDown;
        },
        _spanArrowClick(event) {
            var current = event.target.firstChild;
            //khi nhan vao dropdownMenu
            this.displaySourcesMenu();


        },
        itemSourceClick(event) {
            var item = event.target;

            //bo active cho item truoc
            this._dropdownActive.classList.remove('active')
            //active cho item hien tai
            item.classList.add('active');

            //gan droopdownActive cho item
            this._dropdownActive = item;

            const sourceIndex = item.getAttribute('source-index');
            this.sourceValue = this.options.sources[parseInt(sourceIndex)];
            this.displaySourcesMenu();

        },
        getFeatureInfo() {
            return new Promise((resolve, reject) => {
                let queryTask = new QueryTask(this.sourceValue.layer._url),
                    query = new Query();
                //nếu như là tìm đường
                query.params = {
                    typeName: this.sourceValue.layer.options.layers,
                    propertyName: `${this.sourceValue.searchField},${this.sourceValue.displayField}`,
                }
                query.where = [{
                    value1: this.sourceValue.searchField,
                    value2: this.getTxtSearch(),
                    operator: '='
                }]
                queryTask.execute(query).then((features) => {
                    resolve(features)
                });
            });
        },
        addResult(data) {

            //tao the li voi the cha la this.ulResult duoc gan gia tri tai function onAdd
            var li = L.DomUtil.create('li', 'esri-search__source', this.ulResult);

            //gan giatri data-id cho the <li>
            li.setAttribute('data-id', data.id);
            li.innerText = data.properties[this.sourceValue.displayField];
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

            //dang ky su kien click cho the li va goi den ham resultClick de xu ly
            L.DomEvent.on(li, 'click', this.resultClick, this);

        },
        addResults(datas) {
            datas.map((data) => this.addResult(data));
        },
        resultClick(event) {

            //lay the <li> duoc click
            var li = event.target;

            //lay du lieu cua geometry tai data de khi click vao se zoom den vi tri do tren ban do
            //vi du: <li class="esri-search__source" data-x="106.6970348375311" data-y="10.87584416522746">Trần Văn Tỏ</li>
            //vay se lay toa do x = 106.6970348375311, y = 10.87584416522746
            // var x = parseFloat(li.getAttribute('data-x')),
            //     y = parseFloat(li.getAttribute('data-y')),
            const id = li.getAttribute('data-id');

            if (id != undefined && id != null) {
                let query = new Query({
                    params: {
                        typeName: this.sourceValue.layer.options.layers,
                        featureId: id
                    }
                });
                let queryTask = new QueryTask(this.sourceValue.layer._url);
                queryTask.execute(query).then((features) => {
                    let data = features[0],
                        x, y;
                    switch (data.geometry.type) {
                        case "MultiLineString":
                            x = data.geometry.coordinates[0][0][1];
                            y = data.geometry.coordinates[0][0][0];
                            break;
                        case 'MultiPolygon':
                            x = data.geometry.coordinates[0][0][0][1];
                            y = data.geometry.coordinates[0][0][0][0];
                            break;
                    }
                    //chuyen vi tri center cua map den x,y va zoom:18 voi hieu ung flyTo
                    this._map.flyTo([x, y], 18);
                    //hien thi popupContent sau khi da zoom den vi tri x,y
                    if (data != undefined) {
                        //neu nhu tim duong thi khong can hien thi popup
                        const layer = this.sourceValue.layer;
                        //có layer có tồn tại thì kiểm tra xem nó có định nghĩa popup hay không
                        //nếu có thì hiển thị theo popup
                        if (layer) {
                            const outField = layer.options.outField;
                            if (outField) {
                                //hien thi popup len map
                                popupUtil.show(this._map, [x, y], layer.getPopupContent(data.properties));
                            }
                        }
                    }
                })
            }


        },
        get outField() {
            return this.options.outField;
        },
        generatePopupContent(props) {
            var div = L.DomUtil.create('div');
            var table = L.DomUtil.create('table', 'table-bordered', div);
            var tbody = L.DomUtil.create('tbody', null, table);
            //nếu có outfield thì hiển thị theo outfield
            if (this.outField) {
                for (var i in this.outField) {
                    var value = props[i];
                    var tr = L.DomUtil.create('tr', null, tbody),
                        tdName = L.DomUtil.create('td', null, tr),
                        tdValue = L.DomUtil.create('td', null, tr);
                    tdName.innerText = this.options.outField[i];
                    tdValue.innerText = value ? value : 'Không có dữ liệu';
                }
            }
            //nếu không có thì hiển thị tất cả
            else {
                for (let name in props) {
                    const value = props[name]
                    var tr = L.DomUtil.create('tr', null, tbody),
                        tdName = L.DomUtil.create('td', null, tr),
                        tdValue = L.DomUtil.create('td', null, tr);
                    tdName.innerText = name;
                    tdValue.innerText = value ? value : 'Không có dữ liệu';
                }
            }
            return div;
        },
        showDivResult(isShow) {
            if (isShow) {
                this.divResult.classList.add('esri-search__sources-menu');
            } else {
                this.divResult.classList.remove('esri-search__sources-menu');
            }
        },

    });

    return function (options) {
        return new L.Control.Search(options);
    }
});