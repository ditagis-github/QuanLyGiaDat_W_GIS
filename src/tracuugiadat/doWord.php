<?php


require_once 'PHPWord/PHPWord.php';

include_once('f_common_to_word.php');


if (isset($_GET['id'])) {

    $id = $_GET['id'];
    $vitri = $_GET['vitri'];
    $sonam = $_GET['sonam'];

    $data = act_td_xem_chitiet_array($id,$vitri,$sonam);

    $str="";

    $PHPWord = new PHPWord();

    $document = $PHPWord->loadTemplate('../files/bangketqua_form.docx');


    $document->setValue('Vitri',$data['vitri'] );
    $document->setValue('Vung',$data['vung']);
    $document->setValue('sonam',$sonam);

    $document->setValue('b1_1_1',$data['b1_1_1']);
    $document->setValue('b1_1_2',$data['b1_1_2']);
    $document->setValue('b1_1_3',$data['b1_1_3']);
    $document->setValue('b1_1_4',$data['b1_1_4']);
    $document->setValue('b1_1_5',$data['b1_1_5']);
    $document->setValue('b1_1_6',$data['b1_1_6']);
    $document->setValue('b1_1_7',$data['b1_1_7']);

    $document->setValue('b1_2_1',$data['b1_2_1']);
    $document->setValue('b1_2_2',$data['b1_2_2']);
    $document->setValue('b1_2_5',$data['b1_2_5']);
    $document->setValue('b1_2_6',$data['b1_2_6']);
    $document->setValue('b1_2_7',$data['b1_2_7']);

    $document->setValue('b1_3_1',$data['b1_3_1']);
    $document->setValue('b1_3_2',$data['b1_3_2']);
    $document->setValue('b1_3_5',$data['b1_3_5']);
    $document->setValue('b1_3_6',$data['b1_3_6']);
    $document->setValue('b1_3_7',$data['b1_3_7']);

    $document->setValue('b1_4_1',$data['b1_4_1']);
    $document->setValue('b1_4_2',$data['b1_4_2']);
    $document->setValue('b1_4_5',$data['b1_4_5']);
    $document->setValue('b1_4_6',$data['b1_4_6']);
    $document->setValue('b1_4_7',$data['b1_4_7']);

    //bang2
    $document->setValue('b2_1_1',$data['b2_1_1']);
    $document->setValue('b2_1_2',$data['b2_1_2']);
    $document->setValue('b2_1_3',$data['b2_1_3']);
    $document->setValue('b2_1_4',$data['b2_1_4']);
    $document->setValue('b2_1_5',$data['b2_1_5']);
    $document->setValue('b2_1_6',$data['b2_1_6']);
    $document->setValue('b2_1_7',$data['b2_1_7']);

    $document->setValue('b2_2_1',$data['b2_2_1']);
    $document->setValue('b2_2_2',$data['b2_2_2']);
    $document->setValue('b2_2_5',$data['b2_2_5']);
    $document->setValue('b2_2_6',$data['b2_2_6']);
    $document->setValue('b2_2_7',$data['b2_2_7']);

    $document->setValue('b2_3_1',$data['b2_3_1']);
    $document->setValue('b2_3_2',$data['b2_3_2']);
    $document->setValue('b2_3_5',$data['b2_3_5']);
    $document->setValue('b2_3_6',$data['b2_3_6']);
    $document->setValue('b2_3_7',$data['b2_3_7']);

    $document->setValue('b2_4_1',$data['b2_4_1']);
    $document->setValue('b2_4_2',$data['b2_4_2']);
    $document->setValue('b2_4_5',$data['b2_4_5']);
    $document->setValue('b2_4_6',$data['b2_4_6']);
    $document->setValue('b2_4_7',$data['b2_4_7']);

    //bang3
    $document->setValue('b3_1_1',$data['b3_1_1']);
    $document->setValue('b3_1_2',$data['b3_1_2']);
    $document->setValue('b3_1_3',$data['b3_1_3']);
    $document->setValue('b3_1_4',$data['b3_1_4']);

    $document->setValue('b3_2_1',$data['b3_2_1']);
    $document->setValue('b3_2_2',$data['b3_2_2']);
    $document->setValue('b3_2_3',$data['b3_2_3']);
    $document->setValue('b3_2_4',$data['b3_2_4']);

    $document->setValue('b3_3_1',$data['b3_3_1']);
    $document->setValue('b3_3_2',$data['b3_3_2']);
    $document->setValue('b3_3_3',$data['b3_3_3']);
    $document->setValue('b3_3_4',$data['b3_3_4']);

    $document->setValue('b3_4_1',$data['b3_4_1']);
    $document->setValue('b3_4_2',$data['b3_4_2']);
    $document->setValue('b3_4_3',$data['b3_4_3']);
    $document->setValue('b3_4_4',$data['b3_4_4']);

    $document->setValue('b3_5_1',$data['b3_5_1']);
    $document->setValue('b3_5_2',$data['b3_5_2']);
    $document->setValue('b3_5_3',$data['b3_5_3']);
    $document->setValue('b3_5_4',$data['b3_5_4']);

    $document->setValue('b3_6_1',$data['b3_6_1']);
    $document->setValue('b3_6_2',$data['b3_6_2']);
    $document->setValue('b3_6_3',$data['b3_6_3']);
    $document->setValue('b3_6_4',$data['b3_6_4']);

    //BANG 4
    $document->setValue('b4_1_1',$data['b4_1_1']);
    $document->setValue('b4_1_2',$data['b4_1_2']);
    $document->setValue('b4_1_3',$data['b4_1_3']);
    $document->setValue('b4_1_4',$data['b4_1_4']);

    $document->setValue('b4_2_1',$data['b4_2_1']);
    $document->setValue('b4_2_2',$data['b4_2_2']);
    $document->setValue('b4_2_3',$data['b4_2_3']);
    $document->setValue('b4_2_4',$data['b4_2_4']);

    $document->setValue('b4_3_1',$data['b4_3_1']);
    $document->setValue('b4_3_2',$data['b4_3_2']);
    $document->setValue('b4_3_3',$data['b4_3_3']);
    $document->setValue('b4_3_4',$data['b4_3_4']);

    $document->setValue('b4_4_1',$data['b4_4_1']);
    $document->setValue('b4_4_2',$data['b4_4_2']);
    $document->setValue('b4_4_3',$data['b4_4_3']);
    $document->setValue('b4_4_4',$data['b4_4_4']);

    $document->setValue('b4_5_1',$data['b4_5_1']);
    $document->setValue('b4_5_2',$data['b4_5_2']);
    $document->setValue('b4_5_3',$data['b4_5_3']);
    $document->setValue('b4_5_4',$data['b4_5_4']);

    $document->setValue('b4_6_1',$data['b4_6_1']);
    $document->setValue('b4_6_2',$data['b4_6_2']);
    $document->setValue('b4_6_3',$data['b4_6_3']);
    $document->setValue('b4_6_4',$data['b4_6_4']);

    $document->setValue('b5_1_1',$data['b5_1_1']);
    $document->setValue('b5_1_2',$data['b5_1_2']);
    $document->setValue('b5_1_3',$data['b5_1_3']);
    $document->setValue('b5_1_4',$data['b5_1_4']);
    $document->setValue('b5_1_5',$data['b5_1_5']);
    $document->setValue('b5_1_6',$data['b5_1_6']);
    $document->setValue('b5_1_7',$data['b5_1_7']);

    $document->setValue('b5_2_1',$data['b5_2_1']);
    $document->setValue('b5_2_2',$data['b5_2_2']);
    $document->setValue('b5_2_3',$data['b5_2_3']);
    $document->setValue('b5_2_4',$data['b5_2_4']);
    $document->setValue('b5_2_5',$data['b5_2_5']);
    $document->setValue('b5_2_6',$data['b5_2_6']);
    $document->setValue('b5_2_7',$data['b5_2_7']);

    $document->setValue('b5_3_1',$data['b5_3_1']);
    $document->setValue('b5_3_2',$data['b5_3_2']);
    $document->setValue('b5_3_3',$data['b5_3_3']);
    $document->setValue('b5_3_4',$data['b5_3_4']);
    $document->setValue('b5_3_5',$data['b5_3_5']);
    $document->setValue('b5_3_6',$data['b5_3_6']);
    $document->setValue('b5_3_7',$data['b5_3_7']);

    $document->setValue('b5_4_1',$data['b5_4_1']);
    $document->setValue('b5_4_2',$data['b5_4_2']);
    $document->setValue('b5_4_3',$data['b5_4_3']);
    $document->setValue('b5_4_4',$data['b5_4_4']);
    $document->setValue('b5_4_5',$data['b5_4_5']);
    $document->setValue('b5_4_6',$data['b5_4_6']);
    $document->setValue('b5_4_7',$data['b5_4_7']);

    $document->setValue('b5_5_1',$data['b5_5_1']);
    $document->setValue('b5_5_2',$data['b5_5_2']);
    $document->setValue('b5_5_3',$data['b5_5_3']);
    $document->setValue('b5_5_4',$data['b5_5_4']);
    $document->setValue('b5_5_5',$data['b5_5_5']);
    $document->setValue('b5_5_6',$data['b5_5_6']);
    $document->setValue('b5_5_7',$data['b5_5_7']);

    $document->setValue('b5_6_1',$data['b5_6_1']);
    $document->setValue('b5_6_2',$data['b5_6_2']);
    $document->setValue('b5_6_3',$data['b5_6_3']);
    $document->setValue('b5_6_4',$data['b5_6_4']);
    $document->setValue('b5_6_5',$data['b5_6_5']);
    $document->setValue('b5_6_6',$data['b5_6_6']);
    $document->setValue('b5_6_7',$data['b5_6_7']);




    $filename="ketqua_tracuu.docx";
    $document->save($filename );


    header("Cache-Control: public");
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    //header("Content-Type: text/html; charset=UTF-8");
    //header("Content-Type: application/vnd.ms-word; charset=utf-8");

    header('Content-Disposition: attachment; filename='.$filename);
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filename));

    //ob_clean();   //use on local
    flush();
    readfile($filename);
    unlink($filename); // deletes the temporary file


}


?>

