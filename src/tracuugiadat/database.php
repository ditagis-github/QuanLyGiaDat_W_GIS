<?php
    
    //if (!defined('IN_SITE')) die ('The request not found');
    
	$conn=null;
    //Ham ket noi
    
    require 'config.php';
    function db_connect(){
        global $conn;
        if (!$conn){
            $connectString = "host=".DB_SERVER.
            " port=5432 dbname=".DB_DATABASE." user=".DB_USERNAME." password=".DB_PASSWORD. " options='--client_encoding=UTF8'";
            $conn = pg_connect($connectString)
            or die('Kh�ng th? k?t n?i CSDL');
            
            // mysqli_set_charset($conn,'UTF-8');
            // mysqli_query($conn,"SET NAMES 'utf8'");
        }
    }
    
    //Ham ngat ket nnoi
    function db_close(){
        global $conn;
        if ($conn){
            pg_close($conn);
        }
    }
    
    //Lay danh sach
    function db_get_list($sql){
        //error_log("SQL start=>" . $sql);
        $data=array();

            db_connect();
            global $conn;

            $result = pg_query($conn,$sql);

            while ($row = pg_fetch_assoc($result)){
                $data[] = $row;
            }




        //error_log("SQL => end");
        return $data;
    }
 
    
    //Lay chi tiet
    function db_get_row($sql){
        db_connect();
        global $conn;
        
        //echo $sql;
        $result = pg_query($conn,$sql);
        $row = array();
        if (mysqli_num_rows($result)>0){
            $row = pg_fetch_assoc($result);
        }
        return $row;
        
    }
    
    //Thuc thi Insert, update, delete
    function db_execute($sql){
        db_connect();
        global $conn;
        return pg_query($conn, $sql);
    }
    
    function db_test(){
         
        return 'ok';
    }
?>