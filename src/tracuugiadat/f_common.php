<?php
/**
 * Created by TuanAnh
 * Date: 2016-04-30
 * Time: 9:43 AM
 */

header("Content-type: application/json");

include_once ('f_common_func.php');

    switch ($_REQUEST['act']){
        case 'cbo_tenduong':
            if (!empty($_POST["id"]))
                act_chon_tenduong($_POST["id"]);
            break;

        case 'cbo_chonhuyen':
            if (!empty($_POST["huyen"]))
                act_chon_huyen($_POST["huyen"]);
            break;

        case 'cbo_chonxa':
            if (!empty($_POST["xa"]))
            act_chon_xa($_POST["xa"],$_POST["duong"]);
            break;

        case 'xem_chitiet':
            if (!empty($_POST["id"]))
                act_td_xem_chitiet($_POST["id"],$_POST["vitri"],$_POST["sonam"]);  //
            break;

        case 'tinh_bang5':
            if (!empty($_POST["id"]))
                act_tinh_bang5($_POST["id"],$_POST["vitri"],$_POST["sonam"]);  //
            break;

    }


?>