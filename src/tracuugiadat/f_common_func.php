<?php
/**
 * Created by PhpStorm.
 * User: Tuan Anh
 * Date: 2017-04-18
 * Time: 7:59 PM
 */

include_once ('dal.php');

function act_chon_tenduong($duong){
    //lay khu vuc
    $tt = db_get_thongtin_tenduong($duong);

    $output=null;
    $output =  array('loaikhuvuc'=>$tt["loai_khu_vuc"],
        'heso_d'=>$tt["he_so_d"],
        'heso_kn'=>$tt["he_so_kn"],
        'heso_kp'=>$tt["he_so_kp"]);

    echo json_encode($output,JSON_FORCE_OBJECT);

}

function act_chon_huyen($huyen){
    $results = db_get_danhsachPhuongXa($huyen);

    $lst="<option value=''>Chọn Xã, phường, thị trấn...</option>";
    foreach($results as $px){

        $lst = $lst . "<option value='". $px["id"]."'>" . $px["name"] ."</option>";

    }

    //$output="ok";
    $output =  array('phuongxa'=>$lst);

    echo json_encode($output,JSON_FORCE_OBJECT);

}

function act_chon_xa($xa,$duong){
    $lst = db_get_ds_tenduong_theo_khuvuc_all($xa,$duong);

    $str = "<table class='table table-bordered table-hover' id='tblist'> "
        . "    <tr class=\"bg-info\"> "
        . "        <th class=\"bg-info\">TÊN ĐƯỜNG</th><th class=\"bg-info\">TỪ</th><th class=\"bg-info\">ÐẾN</th><th class=\"bg-info\">GIÁ</th> "
        . "    </tr> " ;

    $str_row_temp = "    <tr> "
        . "        <td>{ten_duong}</td><td>{tu}</td><td>{den}</td>"
        //. "        <td><button type='submit' data-target='#divKetqua'  onclick='act_td_xem({id});'>Xem</button></td> " //data-toggle='modal'
        .  "        <td><a href='#'  data-target='#divKetqua' title='Xem giá đất' onclick='act_td_xem({id});'>Xem giá đất</a> | 
        <a href='#' title='Xem vị trí tại bản đồ' data-tenduong='{ten_duong}' data-tu='{tu}' data-den='{den}' onclick='focusmap(this);'>Xem vị trí</a> </td>"
        . "    </tr> ";


    foreach($lst as $row){

        $str_row = $str_row_temp;

        $str_row = str_replace("{ten_duong}",$row["ten_duong"],$str_row);
        $str_row = str_replace("{tu}",$row["tu"],$str_row);
        $str_row = str_replace("{den}",$row["den"],$str_row);
        $str_row = str_replace("{id}",$row["id"],$str_row);

        $str = $str . $str_row;
    }

    $str = $str . "</table> ";


    //$output="ok";
    $output =  array('ds_duong'=>$str);

    echo json_encode($output,JSON_FORCE_OBJECT);

}

function act_td_xem_chitiet_array($duong, $vitri,$sonam){


    if ($vitri == "MT")
        $ttd = db_get_thongtin_tenduong($duong);
    else
        $ttd = db_get_thongtin_tenduong_hem($duong, $vitri);

    //error_log("act_td_xem_chitiet:1");
    $banggia = get_bang_gia_html($duong, $vitri);

    //error_log("act_td_xem_chitiet:2");
    $banggia2 = get_bang_gia2_html($duong, $vitri);  //gia theo qd 67

    //error_log("act_td_xem_chitiet:3");
    $data_cmd = get_bang_gia_chuyendoi($duong, $vitri);

    //error_log("act_td_xem_chitiet:3-1");
    $banggia3 = get_html_bang3($data_cmd);
    //error_log("act_td_xem_chitiet:3-2");
    $banggia4 = get_html_bang4($data_cmd);

    //error_log("act_td_xem_chitiet:4");
    $data_cmd_b3 = get_bang_gia_chuyendoi_b3($duong, $vitri, $sonam);
    $banggia5 = get_html_bang5($data_cmd_b3);

    //error_log("act_td_xem_chitiet:2");
    $output = array(
        'ten_duong' => $ttd["ten_duong"],
        'tu' => $ttd["tu"],
        'den' => $ttd["den"],
        'vung' => $ttd["loai_vung"],
        'loai' => $ttd["loai_khu_vuc"],// .'-' . $ttd["id"].'-' . $ttd["loai_vung"],
        'loai_kv2' => $ttd["loai_khuvuc_2"],
        'duongchinh' => $ttd["ten_duongchinh"],
        'hs_d' => $ttd["he_so_d"],
        'hs_kn' => $ttd["he_so_kn"],
        'hs_kp' => $ttd["he_so_kp"],
        'bang_gia' => $banggia,
        'bang_gia2' => $banggia2,
        'bang_gia3' => $banggia3,
        'bang_gia4' => $banggia4,
        'bang_gia5' => $banggia5
    );

    return $output;
    //echo json_encode($output, JSON_FORCE_OBJECT);

    //error_log("act_td_xem_chitiet:end");




}

function act_td_xem_chitiet($duong, $vitri,$sonam){


    $output = act_td_xem_chitiet_array($duong, $vitri,$sonam);


    echo json_encode($output, JSON_FORCE_OBJECT);

    //error_log("act_td_xem_chitiet:end");




}

function act_tinh_bang5($duong, $vitri,$sonam){

    $data_cmd_b3 = get_bang_gia_chuyendoi_b3($duong,$vitri,$sonam);
    $banggia5= get_html_bang5($data_cmd_b3);


    $output =  array(
        'bang_gia5' => $banggia5
    );

    echo json_encode($output,JSON_FORCE_OBJECT);

}


function get_bang_gia_html($duong,$hem){
    //error_log("get_bang_gia_html:start");
    $html = file_get_contents('../tracuugiadat/htmls/table_template.php', true);


    if ($hem =="MT")
        $gia = db_get_bang_gia_td($duong);
    else
        $gia = db_get_bang_gia_hem_td($duong,$hem);

    //error_log("get_bang_gia_html:in");

    //thiet lap tieu de cho tooltip
    $td0 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/bang1_td.php', true);
    $html = str_replace("{TITLE_BANG_1_TD}", $td0 ,$html);

    $td1 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/TM_DV.php', true);
    $html = str_replace("{TITLE_TM_DV}", $td1 ,$html);

    $td2 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/CLN_NKH.php', true);
    $html = str_replace("{TITLE_CLN_NKH}", $td2 ,$html);

    $td3 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/SXKD.php', true);
    $html = str_replace("{TITLE_SXKD}", $td3 ,$html);


    $html = str_replace("{d1_lua}", format_num($gia[0]["lua"]) ,$html);
    $html = str_replace("{d1_cln}", format_num($gia[0]["cln"]),$html);
    $html = str_replace("{d1_rsx}", format_num($gia[0]["rsx"]),$html);
    $html = str_replace("{d1_nts}", format_num($gia[0]["nts"]),$html);
    $html = str_replace("{d1_odt}", format_num($gia[0]["odt"]),$html);
    $html = str_replace("{d1_tdv}", format_num($gia[0]["tmdv"]),$html);
    $html = str_replace("{d1_skc}", format_num($gia[0]["skc"]),$html);

    $html = str_replace("{d2_lua}", format_num($gia[1]["lua"]),$html);
    $html = str_replace("{d2_cln}", format_num($gia[1]["cln"]),$html);
    $html = str_replace("{d2_odt}", format_num($gia[1]["odt"]),$html);
    $html = str_replace("{d2_tdv}", format_num($gia[1]["tmdv"]),$html);
    $html = str_replace("{d2_skc}", format_num($gia[1]["skc"]),$html);

    $html = str_replace("{d3_lua}", format_num($gia[2]["lua"]),$html);
    $html = str_replace("{d3_cln}", format_num($gia[2]["cln"]),$html);
    $html = str_replace("{d3_odt}", format_num($gia[2]["odt"]),$html);
    $html = str_replace("{d3_tdv}", format_num($gia[2]["tmdv"]),$html);
    $html = str_replace("{d3_skc}", format_num($gia[2]["skc"]),$html);

    $html = str_replace("{d4_lua}", format_num($gia[3]["lua"]),$html);
    $html = str_replace("{d4_cln}", format_num($gia[3]["cln"]),$html);
    $html = str_replace("{d4_odt}", format_num($gia[3]["odt"]),$html);
    $html = str_replace("{d4_tdv}", format_num($gia[3]["tmdv"]),$html);
    $html = str_replace("{d4_skc}", format_num($gia[3]["skc"]),$html);
    //error_log("get_bang_gia_html:out");

    return $html;
    //error_log("get_bang_gia_html:end");
}


function get_bang_gia2_html($duong,$hem){
    //error_log("get_bang_gia2_html:start");

    $html2 = file_get_contents('../tracuugiadat/htmls/table_template_b2.php', true);

    if ($hem =="MT")
        $gia = db_get_bang_gia_td($duong);
    else
        $gia = db_get_bang_gia_hem_td($duong,$hem);

    //error_log("get_bang_gia2_html:in");


    $td2_0 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/bang2_td.php', true);
    $html2 = str_replace("{TITLE_BANG_2_TD}", $td2_0 ,$html2);

    $td1 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/TM_DV.php', true);
    $html2 = str_replace("{TITLE_TM_DV}", $td1 ,$html2);

    $td2 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/CLN_NKH.php', true);
    $html2 = str_replace("{TITLE_CLN_NKH}", $td2 ,$html2);

    $td3 = file_get_contents('../tracuugiadat/htmls/tieude_tooltip/SXKD.php', true);
    $html2 = str_replace("{TITLE_SXKD}", $td3 ,$html2);

    $html2 = str_replace("{d1_lua}", format_num($gia[0]["lua_2"]),$html2);
    $html2 = str_replace("{d1_cln}", format_num($gia[0]["cln_2"]),$html2);
    $html2 = str_replace("{d1_rsx}", format_num($gia[0]["rsx_2"]),$html2);
    $html2 = str_replace("{d1_nts}", format_num($gia[0]["nts_2"]),$html2);
    $html2 = str_replace("{d1_odt}", format_num($gia[0]["odt_2"]),$html2);
    $html2 = str_replace("{d1_tdv}", format_num($gia[0]["tmdv_2"]),$html2);
    $html2 = str_replace("{d1_skc}", format_num($gia[0]["skc_2"]),$html2);

    $html2 = str_replace("{d2_lua}", format_num($gia[1]["lua_2"]),$html2);
    $html2 = str_replace("{d2_cln}", format_num($gia[1]["cln_2"]),$html2);
    $html2 = str_replace("{d2_odt}", format_num($gia[1]["odt_2"]),$html2);
    $html2 = str_replace("{d2_tdv}", format_num($gia[1]["tmdv_2"]),$html2);
    $html2 = str_replace("{d2_skc}", format_num($gia[1]["skc_2"]),$html2);

    $html2 = str_replace("{d3_lua}", format_num($gia[2]["lua_2"]),$html2);
    $html2 = str_replace("{d3_cln}", format_num($gia[2]["cln_2"]),$html2);
    $html2 = str_replace("{d3_odt}", format_num($gia[2]["odt_2"]),$html2);
    $html2 = str_replace("{d3_tdv}", format_num($gia[2]["tmdv_2"]),$html2);
    $html2 = str_replace("{d3_skc}", format_num($gia[2]["skc_2"]),$html2);

    $html2 = str_replace("{d4_lua}", format_num($gia[3]["lua_2"]),$html2);
    $html2 = str_replace("{d4_cln}", format_num($gia[3]["cln_2"]),$html2);
    $html2 = str_replace("{d4_odt}", format_num($gia[3]["odt_2"]),$html2);
    $html2 = str_replace("{d4_tdv}", format_num($gia[3]["tmdv_2"]),$html2);
    $html2 = str_replace("{d4_skc}", format_num($gia[3]["skc_2"]),$html2);


    return $html2;
    //error_log("get_bang_gia2_html:end");
}

function get_html_bang3($data){
    $html = file_get_contents('../tracuugiadat/htmls/table_template_bang3.php', true);
    $html_sub="";

    $dong=0;
    foreach($data as $row){
        $dong += 1;
        $sTencot="div_b3_d".$dong;

        $html_sub.="<tr>
                    <th>" . $row["PHAM_VI"] ."</th>
                    <td><div id='".$sTencot."c1'>". format_num($row["lua_dat_o_thm"]) ."</div></td>
                    <td><div id='".$sTencot."c2'>". format_num($row["lua_dat_o_vhm"]) ."</div></td>
                    <td><div id='".$sTencot."c3'>". format_num($row["lua_tmdv70"]) ."</div></td>
                    <td><div id='".$sTencot."c4'>". format_num($row["lua_sxkd70"]) ."</div></td>
                </tr>";
    }

    $html= str_replace("<!--dulieu_bang3-->",$html_sub,$html);

    return $html;
}

function get_html_bang4($data){

    $html = file_get_contents('../tracuugiadat/htmls/table_template_bang4.php', true);
    $html_sub="";

    $dong=0;
    foreach($data as $row){
        $dong += 1;
        $sTencot="div_b4_d".$dong;

        $html_sub.="<tr>
                    <th>" . $row["PHAM_VI"] ."</th>
                    <td><div id='".$sTencot."c1'>". format_num($row["cln_dat_o_thm"]) ."</div></td>
                    <td><div id='".$sTencot."c2'>". format_num($row["cln_dat_o_vhm"]) ."</div></td>
                    <td><div id='".$sTencot."c3'>". format_num($row["cln_tmdv70"]) ."</div></td>
                    <td><div id='".$sTencot."c4'>". format_num($row["cln_sxkd70"]) ."</div></td>
                </tr>";
    }

    $html= str_replace("<!--dulieu_bang4-->",$html_sub,$html);

    return $html;
    //error_log("get_bang_gia_html:end");
}


function get_html_bang5($data){

    $html = file_get_contents('../tracuugiadat/htmls/table_template_bang5.php', true);
    $html_sub="";

    $dong=0;
    foreach($data as $row){
        $dong += 1;
        $sTencot="div_b5_d".$dong;

        $html_sub.="<tr>
                    <th>" . $row["PHAM_VI"] ."</th>
                    <td><div id='".$sTencot."c1'>". format_num($row["b3_cln_tmdv"]) ."</div></td>
                    <td><div id='".$sTencot."c2'>". format_num($row["b3_cln_sxkd"]) ."</div></td>
                    <td><div id='".$sTencot."c3'>". format_num($row["b3_sxkd_dat_o_thm"]) ."</div></td>
                    <td><div id='".$sTencot."c4'>". format_num($row["b3_sxkd_dat_o_vhm"]) ."</div></td>
                    <td><div id='".$sTencot."c5'>". format_num($row["b3_tmdv_dat_o_thm"]) ."</div></td>
                    <td><div id='".$sTencot."c6'>". format_num($row["b3_tmdv_dat_o_vhm"]) ."</div></td>
                    <td><div id='".$sTencot."c7'>". format_num($row["b3_sxkd_tmdv"]) ."</div></td>
                </tr>";
    }

    $html= str_replace("<!--dulieu_bang5-->",$html_sub,$html);

    return $html;
    //error_log("get_bang_gia_html:end");
}





////////////////////////////////////////////////////////////////////

function format_num1($num){
    $x = number_format($num, 1,',', '');

    if (fmod($x,1)==0)
        $x = number_format($num, 0, ',', '.');
    else
        $x = number_format($num, 1, ',', '.');

    return  $x  ;

}


function format_num($num){
    $x = number_format($num, 1,'.', '');

    if (fmod($x,1)==0)
        $x = number_format($num, 0, ',', '.');
    else
        $x = number_format($num, 1, ',', '.');

    return  $x  ;

}


function phpAlert($msg) {
    echo '<script type="text/javascript">alert("' . $msg . '")</script>';
}