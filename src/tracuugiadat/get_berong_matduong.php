<?php
    include_once ('dal.php');

  if(!empty($_POST["vitri"])) {
  	       $rs = db_get_ds_duong_hem($_POST["vitri"]);
  	       
             if (count($rs) > 1 )
           {
 ?>
            <option value="">Chọn bề rộng mặt đường hẻm ...</option>
 <?php         
           }
           
           foreach($rs as $item) {
 ?>
            <option value="<?php echo $item["code"]; ?>"><?php echo $item["name"];?></option>
<?php
           }
      }	 
?>
