<?php
    header("Content-type: application/json");
    include_once ('dal.php');
	//echo 'called';
    if(!empty($_POST["id"])) {
        $results = db_get_khuvuc_kyhieudat($_POST["id"]);
        
        //echo $results['name'].";".$results['kyhieu'];

        $dstenduong="";
        $dstenduong = get_ds_tenduong_html($_POST["id"]);
        $output=null;
        $output =  array('kyhieu'=>$results['kyhieu'],
                         'khuvuc'=>$results['name'],
                         'khuvuc_code'=>$results['khuvuc'],
                         'dstenduong'=> $dstenduong
                        );

        echo json_encode($output,JSON_FORCE_OBJECT);
        }

    function get_ds_tenduong_html($xa){
        $lst = db_get_ds_tenduong_theo_khuvuc($xa);
        $rs="<option value=''>Chọn tên đường chính hoặc KDC, KCN, ... </option>";

        foreach($lst as $item){
            $rs = $rs . "<option value='". $item["id"]."'>" . $item["tenduong"] ."</option>";
        }

        return $rs;
    }
?>