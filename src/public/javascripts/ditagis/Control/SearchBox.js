define([
    'L',
    "ditagis/Util/popupUtil",
    "ditagis/support/Query",
    "ditagis/Util/geometryUtil",
    'css!ditagis/Control/SearchBox.css'
], function (L,
    popupUtil, Query, geometryUtil) {
        'use strict';
        var searchbox = L.Control.extend({
            resultContainerId: 'resultContainer',
            isOpenResultContainer: false,
            isOpenSearchContainer: false,
            options: {
                placeHolder: 'Nhập tên đường',
                position: "topleft",
                sideBar: {
                    searchTitle: 'Tìm kiếm thửa đất',
                    resultTitle: 'Kết quả tìm kiếm'
                },
            },
            initialize: function (options) {
                var options =
                    L.Util.setOptions(this, options);
            },
            onAdd: function (map) {
                this.map = map;
                this.thuadatLayer = this.map.getWmsLayer('thuadat');
                this.timDuongLayer = this.map.getLayer('timduong');
                return this.renderer();
            },
            renderer() {
                this.container = L.DomUtil.create('div', 'ditagis-search');
                let searchBoxContainer = L.DomUtil.create('div', 'ditagis-searchbox searchbox-shadow', this.container);
                let divSearchboxMenu = L.DomUtil.create('div', 'ditagis-searchbox-menu-container', searchBoxContainer);
                this.menuSearch = L.DomUtil.create('button', 'ditagis-searchbox-menubutton none-border', divSearchboxMenu);
                L.DomEvent.on(this.menuSearch, 'click', (evt) => {
                    this.displaySearchContainer();
                }, this);
                //ô nhập nội dung tìm kiếm
                let divInput = L.DomUtil.create('div', 'ditagis-searchbox-input-container', searchBoxContainer);
                this.input = L.DomUtil.create('input', 'none-border', divInput);
                this.input.setAttribute('placeholder', this.options.placeHolder);
                L.DomEvent.on(this.input, 'keyup', function (event) {
                    if (event.key === 'Enter') {
                        this.findStreet();
                    }
                }, this);
                let divBtnSearch = L.DomUtil.create('div', 'search-button-container', searchBoxContainer);
                let btnSearch = L.DomUtil.create('button', 'search-button none-border', divBtnSearch);
                L.DomEvent.on(btnSearch, 'click', (evt) => {
                    this.findStreet();
                }, this);

                //phần hiển thị kết quả khi tìm kiếm
                this.divResultContainer = L.DomUtil.create('div', 'result-container', searchBoxContainer);
                this.mainResultTable = L.DomUtil.create('ul', null, this.divResultContainer);
                this.rendererSearchMap();
                this.rendererResult();
                L.DomEvent.disableClickPropagation(this.container);
                return this.container;
            },
            getTextSeach() {
                return this.input.value;
            },
            findStreet() {
                this.resetMainResultTable();
                if (this.getTextSeach() && this.getTextSeach().length > 0) {
                    $.post('/timduong', { text: this.getTextSeach() })
                        .done((datas) => {
                            for (let item of datas) {
                                const id = item.OBJECTID,
                                    tu = item.tu,
                                    den = item.den,
                                    tenconduong = item.TenConDuong;
                                let li = L.DomUtil.create('li', null, this.mainResultTable);
                                li.setAttribute('data-id', 'timduong.' + id);
                                li.innerText = tenconduong;
                                L.DomEvent.on(li, 'click', (evt) => {
                                    this.mainResultClick(evt.target);
                                })

                                //hiển thị tooltip
                                var tooltip = `Từ: ${tu}\r\n Đến:${den}`;
                                li.setAttribute('title', tooltip);
                            }
                            this.displayMainResultContainer();
                        })
    }
            },
    mainResultClick(li) {
        const id = li.getAttribute('data-id');
        let query = new Query({
            params: {
                featureId: id
            }
        });
        this.timDuongLayer.getFeatures(query).then((features) => {
            const data = features[0], //vì query theo id nên chỉ duy nhất có một features được trả về
                latlng = geometryUtil.getLatlngPolyline(data.geometry),
                x = latlng[0],
                y = latlng[1];
            //chuyen vi tri center cua map den x,y va zoom:18 voi hieu ung flyTo
            this.map.flyTo([x, y], 18);
            //hien thi popupContent sau khi da zoom den vi tri x,y
            //neu nhu tim duong thi khong can hien thi popup
            //có layer có tồn tại thì kiểm tra xem nó có định nghĩa popup hay không
            //nếu có thì hiển thị theo popup
            const outField = this.timDuongLayer.options.outField;
            if (outField) {
                //hien thi popup len map
                popupUtil.show(this._map, [x, y], this.timDuongLayer.getPopupContent(data.properties));
            }
            //ẩn khung tìm kiếm
            this.displayMainResultContainer(false);
        })
    },
    /**
     * Xóa tất cả các kết quả được chứa trong phần hiển thị kết quả tìm kiếm
     */
    resetMainResultTable() {
        this.mainResultTable.innerHTML = '';
    },
    /**
     * Ẩn/hiện phần hiển thị kết quả tìm kiếm
     * @param {boolean} mode:true hiện, mặc định là true
     */
    displayMainResultContainer(mode = true) {
        if(mode)
                    this.divResultContainer.classList.add('show');
        else
                    this.divResultContainer.classList.remove('show');
    },
    displayPanel(id) {
        $(`#${id}`).toggle("slide", {
            direction: "left"
        }, 500);
            },
/**
 * Hiển thị SearchContainer
 * @param {boolean} mode:true nếu muốn mở
 */
displaySearchContainer(mode = true) {
    //nếu như mode đang đồng với trạng thái this.isOpenSearchContainer thì bỏ qua
    if (mode === this.isOpenSearchContainer)
        return;
    //đóng hoặc mở theo mode
    this.displayPanel('searchContainer');
    //chuyển chế độ
    this.isOpenSearchContainer = !this.isOpenSearchContainer;
},
/**
 * Hiển thị ResultContainer
 * @param {boolean} mode:true nếu muốn mở
 */
displayPanelResultContainer(mode = true) {
    //nếu như mode đang đồng với trạng thái this.isOpenResultContainer thì bỏ qua
    if (mode === this.isOpenResultContainer)
        return;
    //đóng hoặc mở theo mode
    this.displayPanel(this.resultContainerId);
    //chuyển chế độ
    this.isOpenResultContainer = !this.isOpenResultContainer;
},
rendererSearchMap() {


    const data = {
        districts: [{
            id: '725',
            name: 'Thuận An'
        }],
        wards: [{
            id: '25972',
            name: 'Thuận Giao'
        },
        {
            id: '25969',
            name: 'Bình Chuẩn'
        },
        {
            id: '25981',
            name: 'An Sơn'
        },
        {
            id: '25990',
            name: 'Vĩnh Phú'
        },
        {
            id: "25963",
            name: "An Thạnh"
        },
        {
            id: "25966",
            name: "Lái Thiêu"
        },
        {
            id: "25978",
            name: "Hưng Định"
        },
        {
            id: "25984",
            name: "Bình Nhâm"
        },
        {
            id: "25987",
            name: "Bình Hòa"
        },
        {
            id: "25975",
            name: "An Phú"
        },
        ]
    }
    let searchContainer = L.DomUtil.create('div', 'panel', this.container);
    searchContainer.id = 'searchContainer';
    let panelHeader = L.DomUtil.create('div', 'panel-header-container', searchContainer);
    let panelHeaderTitle = L.DomUtil.create('span', 'panel-header-title', panelHeader);
    panelHeaderTitle.innerText = this.options.sideBar.searchTitle;
    let closeButton = L.DomUtil.create('button', 'panel-close-button none-border', panelHeader);
    L.DomEvent.on(closeButton, 'click', (evt) => {
        this.displaySearchContainer(false);
    }, this);


    let container = L.DomUtil.create('div', 'search-container', searchContainer);
    //huyện/tp
    let divDistrict = L.DomUtil.create('div', 'form-group', container);
    let labelDistrict = L.DomUtil.create('label', null, divDistrict);
    labelDistrict.innerText = 'Quận/Huyện';
    this.cbDistrict = L.DomUtil.create('select', 'form-control', divDistrict);
    let firstOptionDistrict = L.DomUtil.create('option', null, this.cbDistrict);
    firstOptionDistrict.value = '';
    firstOptionDistrict.innerText = 'Chọn quận/huyện';
    
    for (let district of data.districts) {
        let option = L.DomUtil.create('option', null, this.cbDistrict);
        option.value = district.id;
        option.innerText = district.name;
    }
    L.DomEvent.on(this.cbDistrict, 'change', this.cbDisTrictChangeHandler, this);
    //xã/phường
    let divWard = L.DomUtil.create('div', 'form-group', container);
    let labelWard = L.DomUtil.create('label', null, divWard);
    labelWard.innerText = 'Xã/Phường';
    this.cbWard = L.DomUtil.create('select', 'form-control', divWard);
    let firstOptionWard = L.DomUtil.create('option', null, this.cbWard);
    firstOptionWard.value = '';
    firstOptionWard.innerText = 'Chọn xã/phường';
    const hanhChinhLayer = this.map.getLayer('hanhchinhxa');
    if (hanhChinhLayer) {
        let query = new Query({
            params: {
                propertyName: `MaPhuongXa,TenXa`
            }
        });
        hanhChinhLayer.getFeatures(query).then((features) => {
            for (let feature of features) {
                const properties = feature.properties,
                    id = properties.MaPhuongXa,
                    name = properties.TenXa;
                let option = L.DomUtil.create('option', null, this.cbWard);
                option.value = id;
                option.innerText = name;
            }
        })
    }
    //số tờ
    let divSoTo = L.DomUtil.create('div', 'form-group', container);
    let labelSoTo = L.DomUtil.create('label', null, divSoTo);
    labelSoTo.innerText = 'Số tờ';
    this.inputSoTo = L.DomUtil.create('input', 'form-control', divSoTo);
    this.inputSoTo.type = 'number';

    //số thửa
    let divSoThua = L.DomUtil.create('div', 'form-group', container);
    let labelSoThua = L.DomUtil.create('label', null, divSoThua);
    labelSoThua.innerText = 'Số thửa';
    this.inputSoThua = L.DomUtil.create('input', 'form-control', divSoThua);
    this.inputSoThua.type = 'number';

    let divSearch = L.DomUtil.create('div', 'form-group', container);
    let btnSearch = L.DomUtil.create('input', 'btn-primary', container);

    L.DomEvent.on(btnSearch, 'click', this.search, this);
    btnSearch.type = 'button';
    btnSearch.value = 'Tìm kiếm';

    let alink = L.DomUtil.create('a', null, container);
    alink.href = 'javascript:void(0)';
    alink.innerText = "Hiển thị kết quả tìm kiếm";
    L.DomEvent.on(alink, 'click', () => {
        this.displayPanelResultContainer(true);
    }, this);
},
resetResultTable() {
    this.panelResultTable.innerHTML = '';
},
search() {
    Loader.show();
    this.resetResultTable();
    //ẩn bảng tìm kiếm
    this.displaySearchContainer(false);


    //lấy dữ liệu từ người dùng
    const soHieuToBanDo = this.inputSoTo.value,
        soHieuThua = this.inputSoThua.value,
        maQuanHuyen = this.cbDistrict.value,
        maPhuongXa = this.cbWard.value;
    if ($) {
        $.post('/map/thuadat/timkiem', {
            soto: soHieuToBanDo,
            sothua: soHieuThua,
            huyen: maQuanHuyen,
            phuongxa: maPhuongXa
        })
            .done(features => {
                console.log(features);
                for (let feature of features) {
                    const id = feature.OBJECTID, //lấy id của feature 
                        chuSoHuu = feature.ChuSoHuu; //lấy tên người sở hữu 
                    let li = L.DomUtil.create('li', 'list-group-item', this.panelResultTable); //tạo dom
                    li.setAttribute('data-id', 'thuadat.' + id); //gán giá trị id cho data-id
                    li.innerText = chuSoHuu; //hiển thị tên chủ sở hữu 

                    /**
                     * Hiển thị title khi người dùng rê chuột vào kết quả
                     */
                    var title = '';
                    for (var key in feature) {
                        var value = feature[key];
                        if (value) {
                            title += `${this.thuadatLayer.getAlias(key) || key} : ${value}\r\n`;
                        }
                    }
                    li.setAttribute('title', title);

                    //dang ky su kien click cho the li va goi den ham panelResultClick de xu ly
                    L.DomEvent.on(li, 'click', this.panelResultClick, this);
                    //hiển thị bảng kết quả
                    this.displayPanelResultContainer();
                }
                Loader.hide();
            }).fail(function () {
                Loader.hide();
            })
    }
},
panelResultClick(evt) {
    let li = evt.target;
    const id = li.getAttribute('data-id');

    if (id != undefined && id != null) {
        let query = new Query({
            params: {
                featureId: id
            }
        });
        this.thuadatLayer.getFeatures(query).then((features) => {
            const data = features[0], //vì query theo id nên chỉ duy nhất có một features được trả về
                latlng = geometryUtil.getLatlngCentroid(data.geometry.coordinates[0]),
                x = latlng[0],
                y = latlng[1];
            //chuyen vi tri center cua map den x,y va zoom:18 voi hieu ung flyTo
            this.map.flyTo([x, y], 18);
            //hien thi popupContent sau khi da zoom den vi tri x,y
            if (data != undefined) {
                //neu nhu tim duong thi khong can hien thi popup
                //có layer có tồn tại thì kiểm tra xem nó có định nghĩa popup hay không
                //nếu có thì hiển thị theo popup
                const outField = this.thuadatLayer.options.outField;
                if (outField) {
                    //hien thi popup len map
                    popupUtil.show(this._map, [x, y], this.thuadatLayer.getPopupContent(data.properties));
                }
            }
        })
    }
},
cbDisTrictChangeHandler() {

},
rendererResult() {
    let container = L.DomUtil.create('div', 'panel', this.container);
    container.id = this.resultContainerId;
    let panelHeader = L.DomUtil.create('div', 'panel-header-container', container);
    let panelHeaderTitle = L.DomUtil.create('span', 'panel-header-title', panelHeader);
    panelHeaderTitle.innerText = this.options.sideBar.resultTitle;
    let closeButton = L.DomUtil.create('button', 'panel-close-button none-border', panelHeader);
    L.DomEvent.on(closeButton, 'click', (evt) => {
        this.displayPanelResultContainer(false);
    }, this);
    this.panelResultTable = L.DomUtil.create('ul', 'list-group', container);
},

        })
return function (a) {
    return new searchbox(a);
}
    });