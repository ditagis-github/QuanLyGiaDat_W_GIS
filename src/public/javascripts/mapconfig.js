define([], function () {
    'use strict';
    return {
        map: {
            div: 'map',
            options: {
                minZoom: 12,
                maxZoom: 25,
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                },
                center: [10.95113, 106.705313],
                // [11.132197, 106.692286],
                zoom: 12,
            }
        },
        layers: [{
            url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
            visible: true,
            options: {
                id: 'thuadat',
                name: 'Thửa đất',
                layers: 'sqlserver:thuadat',
                styles: 'sqlserver:ThuaDat',
                format: 'image/png',
                uppercase:true,
                detectRetina:true,
                tileSize:525,
                transparent: true,
                // opacity: 0.7,
                minZoom: 15,
                maxZoom: 25,
                version: '1.1.0',
                outField: ["KyHieuMDSD", "ChuSuDung", "SoHieuToBanDo", "SoHieuThua", "DienTich"],
                layerInfos: [{
                    name: 'TenQuanHuyen',
                    alias: 'Quận/Huyện'
                }, {
                    name: 'TenXaPhuong',
                    alias: 'Xã/Phường'
                }, {
                    name: 'ChuSuDung',
                    alias: 'Chủ sử dụng'
                },
                {
                    name: 'ChuSoHuu',
                    alias: 'Chủ sở hữu'
                },
                {
                    name: 'DienTich',
                    alias: 'Diện tích'
                },
                {
                    name: 'SoHieuToBanDo',
                    alias: 'Số tờ bản đồ'
                },
                {
                    name: 'SoHieuThua',
                    alias: 'Số hiệu thửa'
                },
                {
                    name: 'KyHieuMDSD',
                    alias: 'Ký hiệu mục đích sử dụng'
                }]
            }
        },
        {

            url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
            // visible: true,
            options: {
                id: 'thuadatnongnghiep',
                name: 'Thửa đất nông nghiệp',
                layers: 'sqlserver:thuadat_nongnghiep',
                format: 'image/png',
                styles: 'sqlserver:ThuaDat_PhanViTri',
                transparent: true,
                minZoom: 15,
                maxZoom: 25,
                version: '1.1.0',
                outField: ["KyHieuMDSD", "ChuSuDung", "SoHieuToBanDo", "SoHieuThua", "DienTich"],
                layerInfos: [{
                    name: 'TenQuanHuyen',
                    alias: 'Quận/Huyện'
                }, {
                    name: 'TenXaPhuong',
                    alias: 'Xã/Phường'
                }, {
                    name: 'ChuSuDung',
                    alias: 'Chủ sử dụng'
                },
                {
                    name: 'ChuSoHuu',
                    alias: 'Chủ sở hữu'
                },
                {
                    name: 'DienTich',
                    alias: 'Diện tích'
                },
                {
                    name: 'SoHieuToBanDo',
                    alias: 'Số tờ bản đồ'
                },
                {
                    name: 'SoHieuThua',
                    alias: 'Số hiệu thửa'
                },
                {
                    name: 'KyHieuMDSD',
                    alias: 'Ký hiệu mục đích sử dụng'
                }],
                typemap: [
                    {
                        name: 'Đơn giá',
                        style: 'sqlserver:nongnghiep_dongia_lua',
                        subs: [{
                            checked: true,
                            name: 'Lúa',
                            style: 'sqlserver:nongnghiep_dongia_lua'
                        }, {
                            name: 'Cây lâu năm',
                            style: 'sqlserver:nongnghiep_dongia_caylaunam'
                        }, {
                            name: 'Nuôi trồng thủy sản',
                            style: 'sqlserver:nongnghiep_dongia_nuoitrongthuysan'
                        }, {
                            name: 'Rừng',
                            style: 'sqlserver:nongnghiep_dongia_rung'
                        },]
                    }, {
                        checked: true,
                        name: 'Phân hạng vị trí',
                        style: 'sqlserver:ThuaDat_PhanViTri_NN'
                    }
                ]
            }
        },
        {


            url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
            visible: false,
            options: {
                id: 'thuadatphinongnghiep',
                name: 'Thửa đất phi nông nghiệp',
                layers: 'sqlserver:thuadat_phinongnghiep',
                // styles: 'sqlserver:ThuaDat_PhanViTri',
                format: 'image/png',
                transparent: true,
                opacity: 0.7,
                minZoom: 15,
                maxZoom: 25,
                version: '1.1.0',
                outField: ["KyHieuMDSD", "ChuSuDung", "SoHieuToBanDo", "SoHieuThua", "DienTich"],
                layerInfos: [{
                    name: 'TenQuanHuyen',
                    alias: 'Quận/Huyện'
                }, {
                    name: 'TenXaPhuong',
                    alias: 'Xã/Phường'
                }, {
                    name: 'ChuSuDung',
                    alias: 'Chủ sử dụng'
                },
                {
                    name: 'ChuSoHuu',
                    alias: 'Chủ sở hữu'
                },
                {
                    name: 'DienTich',
                    alias: 'Diện tích'
                },
                {
                    name: 'SoHieuToBanDo',
                    alias: 'Số tờ bản đồ'
                },
                {
                    name: 'SoHieuThua',
                    alias: 'Số hiệu thửa'
                },
                {
                    name: 'KyHieuMDSD',
                    alias: 'Ký hiệu mục đích sử dụng'
                }],
                typemap: [
                    {
                        name: 'Đơn giá',
                        style: 'sqlserver:phinongnghiep_dongia_odothi',
                        subs: [{
                            checked: true,
                            name: 'Ở đô thị',
                            style: 'sqlserver:phinongnghiep_dongia_odothi'
                        }, {
                            name: 'Thương mại dịch vụ',
                            style: 'sqlserver:phinongnghiep_dongia_thuongmaidichvu'
                        }, {
                            name: 'Sản xuất kinh doanh',
                            style: 'sqlserver:phinongnghiep_dongia_sanxuatkinhdoanh'
                        }, {
                            name: 'Nghĩa trang, nghĩa địa',
                            style: 'sqlserver:phinongnghiep_dongia_nghiatrang'
                        },]
                    }, {
                        checked: true,
                        name: 'Phân hạng vị trí',
                        style: 'sqlserver:ThuaDat_PhanViTri_PNN'
                    }
                ]
            }
        }
        ],
        basemaps: [
            {
                id: 'hanhchinhxa',
                url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:hanhchinh',
                    maxZoom: 14,
                    minZoom: 10,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true
            }, {
                id: 'giaothong',
                url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:giaothong',
                    minZoom: 15,
                    maxZoom: 25,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true
            },
            {
                id: 'songho',
                url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:songho',
                    minZoom: 14,
                    maxZoom: 25,
                    transparent: true,
                    format: 'image/png',

                },
                visible: true
            },
            {
                id: 'timduong',
                url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:timduong',
                    minZoom: 14,
                    maxZoom: 25,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true,
            },
            {
                id: 'timsong',
                url: 'https://ditagis.com:8443/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:TIMSONG',
                    minZoom: 14,
                    maxZoom: 25,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true,
            },
        ]
    }

});