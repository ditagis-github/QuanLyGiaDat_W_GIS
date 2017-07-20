
<?php
	//if (!defined('IN_SITE')) die ('The request not found');
	include_once ('dal.php');
    //header("Content-type: application/json");
     
     
    if(!empty($_POST["parent"])) {
        $results = db_get_danhsachPhuongXa($_POST["parent"]);

        $lstPhuongxa="<option value=''>Chọn Xã, phường, thị trấn...</option>";
        foreach($results as $px){

            $lstPhuongxa = $lstPhuongxa . "<option value='". $px["id"]."'>" . $px["name"] ."</option>";

        }


        $output = array('phuongxa'=>$lstPhuongxa);
        echo json_encode($output,JSON_FORCE_OBJECT);
        //echo 'ok';
    }   
?>     
 
 