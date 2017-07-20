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
                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                visible: true,
                options: {
                    id: 'thuadat',
                    name: 'Thửa đất',
                    layers: 'postgres:thuadat',
                    styles: 'postgres:ThuaDat',
                    format: 'image/png',
                    transparent: true,
                    // opacity: 0.7,
                    minZoom: 15,
                    version: '1.1.0',
                    outField: ["*"],
                    layerInfos: [{
                            name: 'chusohuu',
                            alias: 'Chủ sở hữu'
                        },
                        {
                            name: 'dientich',
                            alias: 'Diện tích'
                        },
                        {
                            name: 'sohieutoba',
                            alias: 'Số tờ bản đồ'
                        },
                        {
                            name: 'sohieuthua',
                            alias: 'Số hiệu thửa'
                        },
                        {
                            name: 'sonha',
                            alias: 'Địa chỉ'
                        },
                        {
                            name: 'tenquanhuy',
                            alias: 'Tên quận/huyện'
                        },
                        {
                            name: 'tenphuongx',
                            alias: 'Tên phường xã'
                        },
                        {
                            name: 'giadat',
                            alias: 'Giá đất'
                        },
                        {
                            name: 'kyhieumdsd',
                            alias: 'Ký hiệu mục đích sử dụng'
                        }
                    ]
                    // typemap: [
                    //     {
                    //         checked:true,
                    //         name: 'Giá đất',
                    //         style: 'postgres:THUADAT',
                    //         subs: [
                    //             {
                    //                 checked: true,
                    //                 name: 'Giá nhà nước',
                    //                 style: 'postgres:thuadat_gianhanuoc'
                    //             }, {
                    //                 name: 'Giá thị trường',
                    //                 style: 'postgres:thuadat_giathitruong'
                    //             }, {
                    //                 name: 'Giá người dân cung cấp',
                    //                 style: 'postgres:thuadat_gianguoidancungcap'
                    //             }
                    //         ]
                    //     }
                    // ]
                }
            },
            {

                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                // visible: true,
                options: {
                    id: 'thuadatnongnghiep',
                    name: 'Thửa đất nông nghiệp',
                    layers: 'postgres:thuadat_nongnghiep',
                    format: 'image/png',
                    styles: 'postgres:ThuaDat_PhanViTri',
                    transparent: true,
                    // opacity: 0.7,
                    minZoom: 15,
                    version: '1.1.0',
                    // outField: {
                    //     chusohuu: 'Tên chủ sở hữu',
                    //     sohieutoba: 'Số tờ bản đồ',
                    //     sohieuthua: 'Số thửa',
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
                        //             style:'postgres:nongnghiep_gianhanuoc'
                        //         }, {
                        //             name: 'Giá thị trường',
                        //             style:'postgres:nongnghiep_giathitruong'
                        //         }, {
                        //             name: 'Giá người dân cung cấp',
                        //             style:'postgres:nongnghiep_gianguoidancungcap'
                        //         }
                        //     ]
                        // },
                        {
                            name: 'Đơn giá',
                            style: 'nongnghiep_dongia_lua',
                            subs: [{
                                checked: true,
                                name: 'Lúa',
                                style: 'postgres:nongnghiep_dongia_lua'
                            }, {
                                name: 'Cây lâu năm',
                                style: 'postgres:nongnghiep_dongia_caylaunam'
                            }, {
                                name: 'Nuôi trồng thủy sản',
                                style: 'postgres:nongnghiep_dongia_nuoitrongthuysan'
                            }, {
                                name: 'Rừng',
                                style: 'postgres:nongnghiep_dongia_rung'
                            }, ]
                        }, {
                            checked: true,
                            name: 'Phân hạng vị trí',
                            style: 'postgres:ThuaDat_PhanViTri'
                        }
                    ]
                }
            },
            {


                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                visible: false,
                options: {
                    id: 'thuadatphinongnghiep',
                    name: 'Thửa đất phi nông nghiệp',
                    layers: 'postgres:thuadat_phinongnghiep',
                    // styles: 'postgres:ThuaDat_PhanViTri',
                    format: 'image/png',
                    transparent: true,
                    opacity: 0.7,
                    minZoom: 15,
                    version: '1.1.0',
                    // outField: {
                    //     tenchusohuu: 'Tên chủ sở hữu',
                    //     sotobando: 'Số tờ bản đồ',
                    //     sothua: 'Số thửa',
                    //     sothuacu: 'Số thửa cũ',
                    //     dientich: 'Diện tích',
                    //     diachithuadat: 'Địa chỉ'
                    // },
                    typemap: [
                        // {
                        //     name: 'Giá đất',
                        //     style: 'postgres:phinongnghiep_gianhanuoc',
                        //     subs: [
                        //         {
                        //             checked:true,
                        //             name: 'Giá nhà nước',
                        //             style:'postgres:phinongnghiep_gianhanuoc'
                        //         }, {
                        //             name: 'Giá thị trường',
                        //             style:'postgres:phinongnghiep_giathitruong'
                        //         }, {
                        //             name: 'Giá người dân cung cấp',
                        //             style:'postgres:phinongnghiep_gianguoidancungcap'
                        //         }
                        //     ]
                        // }, 
                        {
                            name: 'Đơn giá',
                            style: 'phinongnghiep_dongia_odothi',
                            subs: [{
                                checked: true,
                                name: 'Ở đô thị',
                                style: 'postgres:phinongnghiep_dongia_odothi'
                            }, {
                                name: 'Thương mại dịch vụ',
                                style: 'postgres:phinongnghiep_dongia_thuongmaidichvu'
                            }, {
                                name: 'Sản xuất kinh doanh',
                                style: 'postgres:phinongnghiep_dongia_sanxuatkinhdoanh'
                            }, {
                                name: 'Nghĩa trang, nghĩa địa',
                                style: 'postgres:phinongnghiep_dongia_nghiatrang'
                            }, ]
                        }, {
                            checked: true,
                            name: 'Phân hạng vị trí',
                            style: 'postgres:ThuaDat_PhanViTri'
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
                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                options: {
                    layers: 'postgres:hanhchinh',
                    maxZoom: 14,
                    minZoom: 13,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true
            }, {
                id: 'giaothong',
                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                options: {
                    layers: 'postgres:giaothong',
                    minZoom: 15,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true
            },
            //  {
            //     id: 'giaothong_vinhphu',
            //     url: 'http://ditagis.com:8080/geoserver/postgres/wms',
            //     options: {
            //         layers: 'postgres:giaothong',
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
            {
                id: 'hlatdb',
                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                options: {
                    layers: 'postgres:hlatdb',
                    minZoom: 15,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true
            }, {
                id: 'songho',
                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                options: {
                    layers: 'postgres:songho',
                    minZoom: 15,
                    transparent: true,
                    format: 'image/png',

                },
                visible: true
            },
            // {
            //     id: 'songho_vinhphu',
            //     url: 'http://ditagis.com:8080/geoserver/postgres/wms',
            //     options: {
            //         layers: 'postgres:songho',
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
                url: 'http://ditagis.com:8080/geoserver/postgres/wms',
                options: {
                    layers: 'postgres:timduong',
                    minZoom: 15,
                    transparent: true,
                    format: 'image/png',
                },
                visible: true,
            },
        ]
    }

});