    function act_chon_huyen(val) {
        //$("#div_tb1_c1").html("&nbsp;");
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "./tracuugiadat/get_phuongxa.php",
            data: 'parent=' + val,
            success: function (data) {
                $("#cboPhuongXa").html(data.phuongxa);
                $("#txt_kyhieu_do").val("");
                $("#dv_tb1_khuvuc").html("&nbsp;");
                //alert('ok');
            }
        });
    }

    function getKhuvuc_kyhieudat(val) {
        $.ajax({
            type: "POST",
            url: "./tracuugiadat/get_khuvuc_kyhieudat.php",
            data: 'id=' + val,
            success: function (data) {
                //alert (data);
                var s = data.split(";");
                $("#txt_kyhieu_do").val(s[1]);
                $("#dv_tb1_khuvuc").html(s[0]);

                //test set value to div
                $("#div_tb1_c1").html(s[0]);

            }
        });
    }





    function set_khoangcach(val) {
        if (val == 1) {
            $("#txt_khoangcach").val(0);
            $("#txt_khoangcach").attr("disabled", "true");
        } else {
            $("#txt_khoangcach").attr("disabled", false);
            $("#txt_khoangcach").val('');

        }
    }

    //actionn khi chon Phuong Xa
    function act_chon_phuongxa(val) {
        //$("#div_tb1_c1").html('');
        $.ajax({
            type: "POST",
            url: "./tracuugiadat/get_khuvuc_kyhieudat.php",
            data: 'id=' + val,
            dataType: 'json',
            success: function (data) {
                //alert (data);
                //var s = data.split(";");
                $("#txt_kyhieu_do").val(data.kyhieu);
                $("#dv_tb1_khuvuc").html(data.khuvuc);
                $("#cbo_tenduong").html(data.dstenduong);

                $var_khuvuc = data.khuvuc_code;


                //test set value to div
                //$("#div_tb1_c1").html(data.dstenduong);
                //alert(data.dstenduong);
            }
        });
    }

    //Khi chọn Tên đường => xac dinh Loai khu vuc từ danhmuc_giaothong
    function act_chon_tenduong(val) {
        $("#cbo_vitri").val("");
        $("#dv_tb1_tuyenduong").html('');
        $.ajax({
            type: "POST",
            url: "./tracuugiadat/f_common.php?act=cbo_tenduong",
            data: 'id=' + val,
            dataType: 'json',
            success: function (res) {
                $var_loai_khuvuc = res.loaikhuvuc
                $("#div_tb1_c1").html($var_loai_khuvuc);
                $("#div_tb1_c2").html(res.heso_d);
                $("#div_tb1_c3").html(res.heso_kn);
                $("#div_tb1_c4").html(res.heso_kp);
            }
        });
    }

    function act_chon_vitri_thuadat(val) {
        $var_vitri = $('#cbo_vitri').val();

        if ($var_vitri == "MT") {

            $("#dv_tb1_tuyenduong").html($('#cbo_tenduong').find("option:selected").text());
        } else {
            $("#dv_tb1_tuyenduong").html('');
        }

        $.ajax({
            type: "POST",
            url: "./tracuugiadat/get_berong_matduong.php",
            data: 'vitri=' + val,
            success: function (data) {
                $("#cbo_berong").html(data);
            }
        });
    }

    function act_chon_berong_matduong(val) {
        //$("#dv_tb1_tuyenduong").html($var_khuvuc + ' ' + $var_loai_khuvuc + ' ' + $('#cbo_berong').val());
        $var_tuyenduong = "";
        $var_berong = $('#cbo_berong').val();

        if ($var_berong == "MTC") {
            $var_tuyenduong = $('#cbo_tenduong').find("option:selected").text();
        } else {
            $var_tuyenduong = "Đường hoặc lối đi công cộng {BE_RONG}<br>thông ra tuyến {LOAI}";


            $var_str_berong = "";
            $var_str_loai = "";

            if ($var_berong == "T4M")
                $var_str_berong = "TRÊN 4M";
            else if ($var_berong == "D4M")
                $var_str_berong = "DƯỚI 4M";
            else
                $var_str_berong = "#";

            if ($var_khuvuc == 'NT') {
                $var_str_loai = "ĐƯỜNG KHU VỰC " + $var_loai_khuvuc;
            } else if ($var_khuvuc == 'DT') {
                $var_str_loai = "ĐƯỜNG PHỐ LOẠI " + $var_loai_khuvuc;
            }
            $var_tuyenduong = $var_tuyenduong.replace("{BE_RONG}", $var_str_berong);
            $var_tuyenduong = $var_tuyenduong.replace("{LOAI}", $var_str_loai);


        }

        $("#dv_tb1_tuyenduong").html($var_tuyenduong);
    }


    //-------------------
    function act_td_chon_huyen(val) {
        //$("#div_tb1_c1").html("&nbsp;");
        //alert(val);

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "./tracuugiadat/f_common.php?act=cbo_chonhuyen",
            data: 'huyen=' + val,
            success: function (res) {
                $("#cboPhuongXa").html(res.phuongxa);
                //$("#txt_kyhieu_do").val("");
                //$("#dv_tb1_khuvuc").html("&nbsp;");
                //alert(res.phuongxa);
            }
        });


    }

    function act_td_chon_phuongxa(val) {
        //$("#div_tb1_c1").html('');
        $xa = $("#cboPhuongXa").val();
        $tenduong = $("#txtTenduong").val();
        //alert($tenduong);
        $.ajax({
            type: "POST",
            url: "./tracuugiadat/f_common.php?act=cbo_chonxa",
            data: {
                xa: $xa,
                duong: $tenduong
            },
            dataType: 'json',
            success: function (data) {
                $("#dv_tb_tuyenduong").html(data.ds_duong)
                //alert(data.ds_duong);
            }
        });
    }


    function f_layvitri(vitri, duong, duongchinh, tu, den) {
        $diengiai = "";

        if (vitri == "MT") {
            $diengiai = "<b>Mặt tiền</b> - đường <b>" + duong + "</b>";

            if (tu.length > 0)
                $diengiai = $diengiai + " (đoạn từ <b>" + tu + "</b> đến <b>" + den + "</b>)";
        } else {
            //$diengiai = duong + " (đường <b>" + duongchinh + "</b>";

            $diengiai = "Đường hoặc lối đi công cộng có bề rộng mặt đường <b>{vitri}</b> thông ra đường "; //từ 4 mét trở lên
            if (vitri == "HT4")
                $diengiai = $diengiai.replace("{vitri}", "từ 4 mét trở lên");
            else if (vitri == "HD4")
                $diengiai = $diengiai.replace("{vitri}", "dưới 4 mét");

            $diengiai = $diengiai + " <b>" + duongchinh + "</b>"

            if (tu.length > 0)
                $diengiai = $diengiai + " ( đoạn từ <b>" + tu + "</b> đến <b>" + den + "</b>)";



        }

        return $diengiai;


    }

    function reset_bang_chuyendoi() {
        for ($b = 3; $b <= 5; $b++) {
            for ($i = 1; $i <= 4; $i++) {
                $("#div_b" + $b + "_d" + $i + "c1").html("");
                $("#div_b" + $b + "_d" + $i + "c2").html("");
                $("#div_b" + $b + "_d" + $i + "c3").html("");

                if ($b != 5)
                    $("#div_b" + $b + "_d" + $i + "c4").html("");

            }
        }
    }

    function act_td_xem(val) {

        $("#dv_vitri").html("");
        $("#dv_loai").html("");
        $("#dv_tb1").html("");
        $("#dv_tb2").html("");
        $("#dv_tb3").html("");
        $("#dv_tb4").html("");
        $("#dv_tb5").html("");

        reset_bang_chuyendoi();


        var vitri = $('#cbo_vitri').val();
        var nam = 50;



        //if (nam.length==0) nam = 50;

        //alert(nam);

        if (vitri.length == 0) {
            alert("Vui lòng chọn vị trí thửa đất!")
            $("#divKetqua").modal("hide");
        } else {

            //$("#divKetqua").show();

            $("#dv_vitri").html('');
            $.ajax({
                type: "POST",
                url: "./tracuugiadat/f_common.php?act=xem_chitiet",
                data: {
                    id: val,
                    vitri: vitri,
                    sonam: nam
                },
                dataType: 'json',
                success: function (data) {
                    //alert (!$.trim(data.tu));
                    var s_tu = !$.trim(data.tu) ? "" : data.tu;
                    var s_den = !$.trim(data.den) ? "" : data.den;
                    $diengiai = f_layvitri(vitri, data.ten_duong, data.duongchinh, s_tu, s_den);
                    $("#dv_vitri").html($diengiai);

                    $("#dv_tenduong").html("TÊN ĐƯỜNG : " + data.ten_duong);

                    $ghichu = "(";
                    if (data.vung == "DT")
                        $ghichu = $ghichu + "Đường phố Loại: " + data.loai_kv2;
                    else
                        $ghichu = $ghichu + "Đường Khu vực: " + data.loai_kv2;

                    //$ghichu = $ghichu + data.loai;
                    $ghichu = $ghichu + "; Hệ số Đ: " + data.hs_d;
                    $ghichu = $ghichu + "; Hệ số K<sub>NN</sub>: " + data.hs_kn;
                    $ghichu = $ghichu + "; Hệ số K<sub>PNN</sub>: " + data.hs_kp;
                    $ghichu = $ghichu + ")";

                    $("#dv_loai").html($ghichu);

                    $("#dv_tb1").html(data.bang_gia);
                    $("#dv_tb2").html(data.bang_gia2);
                    //alert(data.bang_gia);

                    //$("#dv_tb3").load("table_template_chuyen_muc_dich.php");
                    //tinh_gia_chuyen_LUA_CHN();
                    $("#dv_tb3").html(data.bang_gia3);
                    $("#dv_tb4").html(data.bang_gia4);
                    $("#dv_tb5").html(data.bang_gia5);
                    $("#txtduong").val(val);




                },

                error: function (xhr, status, error) {
                    alert("An AJAX error occured: " + status + "\nError: " + error);
                    //alert("An AJAX error occured: " + xhr.responseText );
                }
            });
            document.getElementById("export_doc").href = "tracuugiadat/doWord.php?id=" + val + "&vitri=" + vitri + "&sonam=" + nam;
            $("#divKetqua").modal("show");

        }
    }

    /*$('a[data-target=#divKetqua]').on('click', function (ev) {
        ev.preventDefault();
        var vitri = $('#cbo_vitri').val();
        if (vitri.length <= 0) {
            alert('Please select any one item in grid');
            $("#divKetqua").modal("hide");
        }
        else {
            alert('show');
            $("#divKetqua").modal("show");

        }
    });*/



    function tinh_gia_chuyen_LUA_CHN() {

        //Dat o trong han muc///////////////////////////////////////
        //gia LUA, CHN theo QD 66
        var b1_d1c1 = $("#div_b1_d1c1").html().toNum();
        var b1_d2c1 = $("#div_b1_d2c1").html().toNum();
        var b1_d3c1 = $("#div_b1_d3c1").html().toNum();
        var b1_d4c1 = $("#div_b1_d4c1").html().toNum();
        //gia CLN, NKH
        var b1_d1c2 = $("#div_b1_d1c2").html().toNum();
        var b1_d2c2 = $("#div_b1_d2c2").html().toNum();
        var b1_d3c2 = $("#div_b1_d3c2").html().toNum();
        var b1_d4c2 = $("#div_b1_d4c2").html().toNum();

        //gia DAT O theo QD 66
        var b1_d1c5 = $("#div_b1_d1c5").html().toNum();
        var b1_d2c5 = $("#div_b1_d2c5").html().toNum();
        var b1_d3c5 = $("#div_b1_d3c5").html().toNum();
        var b1_d4c5 = $("#div_b1_d4c5").html().toNum();

        //QD 67
        //LUA, CHN
        var b2_d1c1 = $("#div_b2_d1c1").html().toNum();
        var b2_d2c1 = $("#div_b2_d2c1").html().toNum();
        var b2_d3c1 = $("#div_b2_d3c1").html().toNum();
        var b2_d4c1 = $("#div_b2_d4c1").html().toNum();
        //CLN, NKH
        var b2_d1c2 = $("#div_b2_d1c2").html().toNum();
        var b2_d2c2 = $("#div_b2_d2c2").html().toNum();
        var b2_d3c2 = $("#div_b2_d3c2").html().toNum();
        var b2_d4c2 = $("#div_b2_d4c2").html().toNum();

        //Đất ở
        var b2_d1c5 = $("#div_b2_d1c5").html().toNum();
        var b2_d2c5 = $("#div_b2_d2c5").html().toNum();
        var b2_d3c5 = $("#div_b2_d3c5").html().toNum();
        var b2_d4c5 = $("#div_b2_d4c5").html().toNum();

        //TM-DV
        var b2_d1c6 = $("#div_b2_d1c6").html().toNum();
        var b2_d2c6 = $("#div_b2_d2c6").html().toNum();
        var b2_d3c6 = $("#div_b2_d3c6").html().toNum();
        var b2_d4c6 = $("#div_b2_d4c6").html().toNum();

        //SXKD
        var b2_d1c7 = $("#div_b2_d1c7").html().toNum();
        var b2_d2c7 = $("#div_b2_d2c7").html().toNum();
        var b2_d3c7 = $("#div_b2_d3c7").html().toNum();
        var b2_d4c7 = $("#div_b2_d4c7").html().toNum();

        ////////////////////////////////////////////////////

        //tinh chenh lech
        var b3_d1c1 = b1_d1c5 - b1_d1c1;
        var b3_d2c1 = b1_d2c5 - b1_d2c1;
        var b3_d3c1 = b1_d3c5 - b1_d3c1;
        var b3_d4c1 = b1_d4c5 - b1_d4c1;

        //Tinh gia chuyen doi
        //vitri 1
        $("#div_b3_d1c1").html(b3_d1c1.myformat(1));
        //vitri 2
        $("#div_b3_d2c1").html(b3_d2c1.myformat(1));
        //vitri 3
        $("#div_b3_d3c1").html(b3_d3c1.myformat(1));
        //vitri 4
        $("#div_b3_d4c1").html(b3_d4c1.myformat(1));
        ///////////////////////////////////////////////////////

        //dat o vuot han muc
        var b3_d1c2 = b2_d1c5 - b2_d1c1;
        var b3_d2c2 = b2_d2c5 - b2_d2c1;
        var b3_d3c2 = b2_d3c5 - b2_d3c1;
        var b3_d4c2 = b2_d4c5 - b2_d4c1;
        //vitri 1
        $("#div_b3_d1c2").html(b3_d1c2.myformat(1));
        //vitri 2
        $("#div_b3_d2c2").html(b3_d2c2.myformat(1));
        //vitri 3
        $("#div_b3_d3c2").html(b3_d3c2.myformat(1));
        //vitri 4
        $("#div_b3_d4c2").html(b3_d4c2.myformat(1));
        /////////////////////////////////////////////////////////////

        //tinh gia chuyen TM-DV
        var b3_d1c3 = b2_d1c6 - b1_d1c1;
        var b3_d2c3 = b2_d2c6 - b1_d2c1;
        var b3_d3c3 = b2_d3c6 - b1_d3c1;
        var b3_d4c3 = b2_d4c6 - b1_d4c1;

        //vitri 1
        $("#div_b3_d1c3").html(b3_d1c3.myformat(1));
        //vitri 2
        $("#div_b3_d2c3").html(b3_d2c3.myformat(1));
        //vitri 3
        $("#div_b3_d3c3").html(b3_d3c3.myformat(1));
        //vitri 4
        $("#div_b3_d4c3").html(b3_d4c3.myformat(1));
        ////////////////////////////////////////////////////////

        //tinh gia SXKD
        var b3_d1c4 = b2_d1c7 - b1_d1c1;
        var b3_d2c4 = b2_d2c7 - b1_d2c1;
        var b3_d3c4 = b2_d3c7 - b1_d3c1;
        var b3_d4c4 = b2_d4c7 - b1_d4c1;

        //vitri 1
        $("#div_b3_d1c4").html(b3_d1c4.myformat(1));
        //vitri 2
        $("#div_b3_d2c4").html(b3_d2c4.myformat(1));
        //vitri 3
        $("#div_b3_d3c4").html(b3_d3c4.myformat(1));
        //vitri 4
        $("#div_b3_d4c4").html(b3_d4c4.myformat(1));
        ////////////////////////////////////////

        //tinh gia Chuyển từ đất CLN, NKH =>
        //Đất ở (trong hạn mức)
        //vitri 1
        $("#div_b4_d1c1").html((b1_d1c5 - b1_d1c2).myformat(1));
        //vitri 2
        $("#div_b4_d2c1").html((b1_d2c5 - b1_d2c2).myformat(1));
        //vitri 3
        $("#div_b4_d3c1").html((b1_d3c5 - b1_d3c2).myformat(1));
        //vitri 4
        $("#div_b4_d4c1").html((b1_d4c5 - b1_d4c2).myformat(1));

        //Đất ở (vượt hạn mức)
        //vitri 1
        $("#div_b4_d1c2").html((b2_d1c5 - b2_d1c2).myformat(1));
        //vitri 2
        $("#div_b4_d2c2").html((b2_d2c5 - b2_d2c2).myformat(1));
        //vitri 3
        $("#div_b4_d3c2").html((b2_d3c5 - b2_d3c2).myformat(1));
        //vitri 4
        $("#div_b4_d4c2").html((b2_d4c5 - b2_d4c2).myformat(1));

        //TM-DV (70 năm)
        //vitri 1
        $("#div_b4_d1c3").html((b2_d1c6 - b2_d1c2).myformat(1));
        //vitri 2
        $("#div_b4_d2c3").html((b2_d2c6 - b2_d2c2).myformat(1));
        //vitri 3
        $("#div_b4_d3c3").html((b2_d3c6 - b2_d3c2).myformat(1));
        //vitri 4
        $("#div_b4_d4c3").html((b2_d4c6 - b2_d4c2).myformat(1));

        //SXKD (70 năm)
        //vitri 1
        $("#div_b4_d1c4").html((b2_d1c7 - b2_d1c2).myformat(1));
        //vitri 2
        $("#div_b4_d2c4").html((b2_d2c7 - b2_d2c2).myformat(1));
        //vitri 3
        $("#div_b4_d3c4").html((b2_d3c7 - b2_d3c2).myformat(1));
        //vitri 4
        $("#div_b4_d4c4").html((b2_d4c7 - b2_d4c2).myformat(1));

        ////////////////////////////////////////////////////////////
        //Bảng 5
        //Dat Phi nong nghiep => Dat

        chuyen_pnn_sang_dat_o();

        /*//Chuyển từ đất SXKD (50 năm) => Đất ở
        //vitri 1

        $("#div_b5_d1c1").html((b2_d1c5 - b2_d1c7*50/70).myformat(1));
        //vitri 2
        $("#div_b5_d2c1").html((b2_d2c5 - b2_d2c7*50/70).myformat(1));
        //vitri 3
        $("#div_b5_d3c1").html((b2_d3c5 - b2_d3c7*50/70).myformat(1));
        //vitri 4
        $("#div_b5_d4c1").html((b2_d4c5 - b2_d4c7*50/70).myformat(1));

        //Chuyển từ đất TMDV (50 năm) => Đất ở
        //vitri 1

        $("#div_b5_d1c2").html((b2_d1c5 - b2_d1c6*50/70).myformat(1));
        //vitri 2
        $("#div_b5_d2c2").html((b2_d2c5 - b2_d2c6*50/70).myformat(1));
        //vitri 3
        $("#div_b5_d3c2").html((b2_d3c5 - b2_d3c6*50/70).myformat(1));
        //vitri 4
        $("#div_b5_d4c2").html((b2_d4c5 - b2_d4c6*50/70).myformat(1));


        //Chuyển từ đất SXKD (50 năm) => TM-DV (50 năm)
        //vitri 1
        $("#div_b5_d1c3").html(((b2_d1c6*50/70) - (b2_d1c7*50/70)).myformat(1));
        //vitri 2
        $("#div_b5_d2c3").html(((b2_d2c6*50/70) - (b2_d2c7*50/70)).myformat(1));
        //vitri 3
        $("#div_b5_d3c3").html(((b2_d3c6*50/70) - (b2_d3c7*50/70)).myformat(1));
        //vitri 4
        $("#div_b5_d4c3").html(((b2_d4c6*50/70) - (b2_d4c7*50/70)).myformat(1));*/
    }


    function chuyen_pnn_sang_dat_o() {
        //Bảng 5


        //Dat Phi nong nghiep => Dat o

        //CLN, NKH
        var b2_d1c2 = $("#div_b2_d1c2").html().toNum();
        var b2_d2c2 = $("#div_b2_d2c2").html().toNum();
        var b2_d3c2 = $("#div_b2_d3c2").html().toNum();
        var b2_d4c2 = $("#div_b2_d4c2").html().toNum();
        //Đất ở
        var b2_d1c5 = $("#div_b2_d1c5").html().toNum();
        var b2_d2c5 = $("#div_b2_d2c5").html().toNum();
        var b2_d3c5 = $("#div_b2_d3c5").html().toNum();
        var b2_d4c5 = $("#div_b2_d4c5").html().toNum();

        //TM-DV
        var b2_d1c6 = $("#div_b2_d1c6").html().toNum();
        var b2_d2c6 = $("#div_b2_d2c6").html().toNum();
        var b2_d3c6 = $("#div_b2_d3c6").html().toNum();
        var b2_d4c6 = $("#div_b2_d4c6").html().toNum();

        //SXKD
        var b2_d1c7 = $("#div_b2_d1c7").html().toNum();
        var b2_d2c7 = $("#div_b2_d2c7").html().toNum();
        var b2_d3c7 = $("#div_b2_d3c7").html().toNum();
        var b2_d4c7 = $("#div_b2_d4c7").html().toNum();

        var nam = $("#txtNam").val();



        //TM-DV (70 năm)
        //vitri 1
        $("#div_b5_d1c4").html((b2_d1c6 * nam / 70 - b2_d1c2).myformat(1));
        //vitri 2
        $("#div_b5_d2c4").html((b2_d2c6 * nam / 70 - b2_d2c2).myformat(1));
        //vitri 3
        $("#div_b5_d3c4").html((b2_d3c6 * nam / 70 - b2_d3c2).myformat(1));
        //vitri 4
        $("#div_b5_d4c4").html((b2_d4c6 * nam / 70 - b2_d4c2).myformat(1));

        //SXKD (70 năm)
        //vitri 1
        $("#div_b5_d1c5").html((b2_d1c7 * nam / 70 - b2_d1c2).myformat(1));
        //vitri 2
        $("#div_b5_d2c5").html((b2_d2c7 * nam / 70 - b2_d2c2).myformat(1));
        //vitri 3
        $("#div_b5_d3c5").html((b2_d3c7 * nam / 70 - b2_d3c2).myformat(1));
        //vitri 4
        $("#div_b5_d4c5").html((b2_d4c7 * nam / 70 - b2_d4c2).myformat(1));

        //Chuyển từ đất SXKD (50 năm) => Đất ở
        //vitri 1

        $("#div_b5_d1c1").html((b2_d1c5 - b2_d1c7 * nam / 70).myformat(1));
        //vitri 2
        $("#div_b5_d2c1").html((b2_d2c5 - b2_d2c7 * nam / 70).myformat(1));
        //vitri 3
        $("#div_b5_d3c1").html((b2_d3c5 - b2_d3c7 * nam / 70).myformat(1));
        //vitri 4
        $("#div_b5_d4c1").html((b2_d4c5 - b2_d4c7 * nam / 70).myformat(1));

        //Chuyển từ đất TMDV (50 năm) => Đất ở
        //vitri 1

        $("#div_b5_d1c2").html((b2_d1c5 - b2_d1c6 * nam / 70).myformat(1));
        //vitri 2
        $("#div_b5_d2c2").html((b2_d2c5 - b2_d2c6 * nam / 70).myformat(1));
        //vitri 3
        $("#div_b5_d3c2").html((b2_d3c5 - b2_d3c6 * nam / 70).myformat(1));
        //vitri 4
        $("#div_b5_d4c2").html((b2_d4c5 - b2_d4c6 * nam / 70).myformat(1));


        //Chuyển từ đất SXKD (50 năm) => TM-DV (50 năm)
        //vitri 1
        $("#div_b5_d1c3").html(((b2_d1c6 * nam / 70) - (b2_d1c7 * nam / 70)).myformat(1));
        //vitri 2
        $("#div_b5_d2c3").html(((b2_d2c6 * nam / 70) - (b2_d2c7 * nam / 70)).myformat(1));
        //vitri 3
        $("#div_b5_d3c3").html(((b2_d3c6 * nam / 70) - (b2_d3c7 * nam / 70)).myformat(1));
        //vitri 4
        $("#div_b5_d4c3").html(((b2_d4c6 * nam / 70) - (b2_d4c7 * nam / 70)).myformat(1));

    }

    function chuyen_pnn_sang_dat_o2() {
        //Bảng 5

        var vitri = $('#cbo_vitri').val();
        var nam = $("#txtNam").val();
        var duong = $("#txtduong").val();
        $("#dv_tb5").html("");

        document.getElementById("export_doc").href = "tracuugiadat/doWord.php?id=" + duong + "&vitri=" + vitri + "&sonam=" + nam;

        $.ajax({
            type: "POST",
            url: "./tracuugiadat/f_common.php?act=tinh_bang5",
            data: {
                id: duong,
                vitri: vitri,
                sonam: nam
            },
            dataType: 'json',
            success: function (data) {

                $("#dv_tb5").html(data.bang_gia5);
                $("#txtNam").val(nam);
                $("#txtduong").val(duong);

            },

            error: function (xhr, status, error) {
                alert("An AJAX error occured: " + status + "\nError: " + error);
                //alert("An AJAX error occured: " + xhr.responseText );
            }
        });
    }

    /**
     * Number.prototype.format(n, x, s, c)
     *
     * @param integer n: length of decimal
     * @param integer x: length of whole part
     * @param mixed   s: sections delimiter
     * @param mixed   c: decimal delimiter
     *
     * 12345678.9.format(2, 3, '.', ',');  // "12.345.678,90"
     123456.789.format(4, 4, ' ', ':');  // "12 3456:7890"
     12345678.9.format(0, 3, '-');       // "12-345-679"

     */
    Number.prototype.format = function (n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }
    Number.prototype.format = function (n) {
        //var n = 1;
        var x = 3;
        var s = ',';
        var c = '.';

        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }

    Number.prototype.myformat = function (dec) {
        var x = 3;
        var s = ',';
        var c = '.';
        var n = dec;

        var num = this.toFixed(Math.max(0, ~~n));

        if ((num % 1) > 0) {
            n = dec;
        } else {
            n = 0;
        }
        num = this.toFixed(Math.max(0, ~~n));
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    }

    String.prototype.toNum = function () {
        var strNum = this.replace(',', '');
        return strNum;
    }



    function check() {
        $("#divKetqua").modal("show");
    }


    function get_data_to_wordfile(id, vitri, nam) {
        $str = "";
        $.ajax({
            type: "POST",
            url: "./tracuugiadat/f_common.php?act=xem_chitiet",
            data: {
                id: id,
                vitri: vitri,
                sonam: nam
            },
            dataType: 'json',
            success: function (data) {
                $str = data.bang_gia;
            },

            error: function (xhr, status, error) {
                alert("An AJAX error occured: " + status + "\nError: " + error);
                //alert("An AJAX error occured: " + xhr.responseText );
            }
        });

        return $str;
    }

    function focusmap(evt) {
        Loader.show();
        const it = $(evt),
            tenduong = it.attr('data-tenduong'),
            tu = it.attr('data-tu'),
            den = it.attr('data-den');

        var iframe = document.getElementById("mapiframe");
        var iframeWindow = (iframe.contentWindow || iframe.contentDocument);
        iframeWindow.Map.zoom(tenduong, tu, den).then((data) => {
            $('#div-minimap').modal('toggle');
            Loader.hide();
        }).catch(() => {
            alert('Không tìm được vị trí trên bản đồ');
        })


    }