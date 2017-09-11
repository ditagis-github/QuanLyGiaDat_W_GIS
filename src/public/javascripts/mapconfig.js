define([], function () {
    'use strict';
    return {
        map: {
            div: 'map',
            options: {
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                },
                center: [10.877913, 106.705313],
                // [11.132197, 106.692286],
                zoom: 16
            }
        },
        layers: [{
            url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
            visible: true,
            options: {
                id: 'thuadat',
                name: 'Thửa đất',
                layers: 'sqlserver:thuadat',
                styles: 'sqlserver:ThuaDat',
                format: 'image/png',
                transparent: true,
                // opacity: 0.7,
                minZoom: 15,
                version: '1.1.0',
                outField: ["*"],
                layerInfos: [{
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
                    name: 'SoNha',
                    alias: 'Địa chỉ'
                },
                {
                    name: 'TenQuanHuyen',
                    alias: 'Tên quận/huyện'
                },
                {
                    name: 'TenPhuongXa',
                    alias: 'Tên phường xã'
                },
                {
                    name: 'GiaDat',
                    alias: 'Giá đất'
                },
                {
                    name: 'KyHieuMDSD',
                    alias: 'Ký hiệu mục đích sử dụng'
                }
                ]
                // typemap: [
                //     {
                //         checked:true,
                //         name: 'Giá đất',
                //         style: 'sqlserver:THUADAT',
                //         subs: [
                //             {
                //                 checked: true,
                //                 name: 'Giá nhà nước',
                //                 style: 'sqlserver:thuadat_gianhanuoc'
                //             }, {
                //                 name: 'Giá thị trường',
                //                 style: 'sqlserver:thuadat_giathitruong'
                //             }, {
                //                 name: 'Giá người dân cung cấp',
                //                 style: 'sqlserver:thuadat_gianguoidancungcap'
                //             }
                //         ]
                //     }
                // ]
            }
        },
        {

            url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
            // visible: true,
            options: {
                id: 'thuadatnongnghiep',
                name: 'Thửa đất nông nghiệp',
                layers: 'sqlserver:thuadat_nongnghiep',
                format: 'image/png',
                styles: 'sqlserver:ThuaDat_PhanViTri',
                transparent: true,
                // opacity: 0.7,
                minZoom: 15,
                version: '1.1.0',
                // outField: {
                //     ChuSoHuu: 'Tên chủ sở hữu',
                //     SoHieuToBanDo: 'Số tờ bản đồ',
                //     SoHieuThua: 'Số thửa',
                //     sothuacu: 'Số thửa cũ',
                //     dientich: 'Diện tích',
                //     diachithuadat: 'Địa chỉ'
                // },
                typemap: [
                    // {

                    //     name: 'Giá đất',
                    //     style: 'nongnghiep_gianhanuoc',
                    //     subs: [
                    //         {
                    //             checked:true,
                    //             name: 'Giá nhà nước',
                    //             style:'sqlserver:nongnghiep_gianhanuoc'
                    //         }, {
                    //             name: 'Giá thị trường',
                    //             style:'sqlserver:nongnghiep_giathitruong'
                    //         }, {
                    //             name: 'Giá người dân cung cấp',
                    //             style:'sqlserver:nongnghiep_gianguoidancungcap'
                    //         }
                    //     ]
                    // },
                    {
                        name: 'Đơn giá',
                        style: 'nongnghiep_dongia_lua',
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
                        style: 'sqlserver:ThuaDat_PhanViTri'
                    }
                ]
            }
        },
        {


            url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
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
                version: '1.1.0',
                // outField: {
                //     tenChuSoHuu: 'Tên chủ sở hữu',
                //     sotobando: 'Số tờ bản đồ',
                //     sothua: 'Số thửa',
                //     sothuacu: 'Số thửa cũ',
                //     dientich: 'Diện tích',
                //     diachithuadat: 'Địa chỉ'
                // },
                typemap: [
                    // {
                    //     name: 'Giá đất',
                    //     style: 'sqlserver:phinongnghiep_gianhanuoc',
                    //     subs: [
                    //         {
                    //             checked:true,
                    //             name: 'Giá nhà nước',
                    //             style:'sqlserver:phinongnghiep_gianhanuoc'
                    //         }, {
                    //             name: 'Giá thị trường',
                    //             style:'sqlserver:phinongnghiep_giathitruong'
                    //         }, {
                    //             name: 'Giá người dân cung cấp',
                    //             style:'sqlserver:phinongnghiep_gianguoidancungcap'
                    //         }
                    //     ]
                    // }, 
                    {
                        name: 'Đơn giá',
                        style: 'phinongnghiep_dongia_odothi',
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
                        style: 'sqlserver:ThuaDat_PhanViTri'
                    }
                ]
            }
        }
        ],
        basemaps: [
            // {
            //     name: 'hanhchinhhuyen',
            //     url: 'http://ditagis.com:8080/geoserver/BinhDuong/wms',
            //     options: {
            //         layers: 'BinhDuong:hanhchinhhuyen',
            //         maxZoom: 13,

            //     },
            //     visible: true
            // },
            {
                id: 'hanhchinhxa',
                url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:hanhchinh',
                    maxZoom: 14,
                    minZoom: 13,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true
            }, {
                id: 'giaothong',
                url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:giaothong',
                    minZoom: 15,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true
            },
            //  {
            //     id: 'giaothong_vinhphu',
            //     url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
            //     options: {
            //         layers: 'sqlserver:giaothong',
            //         minZoom: 15,
            //         transparent: true,
            //         format: 'image/png',
            //         bounds: [
            //             [10.865608, 106.690644],
            //             [10.889687, 106.716681]
            //         ]
            //     },
            //     visible: true
            // },
            // {
            //     id: 'hlatdb',
            //     url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
            //     options: {
            //         layers: 'sqlserver:hlatdb',
            //         minZoom: 15,
            //         transparent: true,
            //         format: 'image/png',
            //     },
            //     visible: true
            // },
            {
                id: 'songho',
                url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:songho',
                    minZoom: 15,
                    transparent: true,
                    format: 'image/png',

                },
                visible: true
            },
            // {
            //     id: 'songho_vinhphu',
            //     url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
            //     options: {
            //         layers: 'sqlserver:songho',
            //         minZoom: 15,
            //         transparent: true,
            //         format: 'image/png',
            //         bounds: [
            //             [10.865608, 106.690644],
            //             [10.889687, 106.716681]
            //         ]
            //     },
            //     visible: true
            // }
            {
                id: 'timduong',
                url: 'http://ditagis.com:8080/geoserver/sqlserver/wms',
                options: {
                    layers: 'sqlserver:timduong',
                    minZoom: 15,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true,
            },
        ]
    }

});