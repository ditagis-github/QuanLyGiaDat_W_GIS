<?php
    //if (!defined('IN_SITE')) die ('The request not found');


	include_once ('database.php');
    //include_once ('./tracuugiadat/helper.php');
    
    
 
    function db_get_danhsachQuanHuyen(){
         
        $sql = "SELECT * FROM tbl_quanhuyen where status = '1' order by name ";
        return db_get_list($sql);
        }
        
    function db_get_danhsachPhuongXa($huyen){
         
        $sql = "SELECT * FROM tbl_phuongxa where ma_huyen = '{$huyen}' and status = '1' order by name  ";
        return db_get_list($sql);
        //return $sql;
        }
    
    function db_get_danhsachDatNongNghiep(){
     
        $sql = "SELECT kyhieu FROM tbl_kyhieuloaidat where loaidat='DNN' order by kyhieu  ";
        return db_get_list($sql);
    }
    
    function db_get_khuvuc_kyhieudat($phuong_xa){
     
        $sql = "SELECT a.khuvuc, b.name,  case when a.khuvuc = 'DT' then 'ODT' else 'ONT' end kyhieu ";
        $sql = $sql . "FROM tbl_phuongxa a, tbl_khuvuc b ";
        $sql = $sql .  "where a.id = {$phuong_xa} ";
        $sql = $sql . "and a.khuvuc = b.id ";
         
        $result =  db_get_row($sql);
        return $result;
    }
    
    function db_get_ds_VitriThuadat(){
     
        $sql = "SELECT * FROM tbl_giaothong_vitri   ";
        return db_get_list($sql);
    }
    
    function db_get_ds_duong_hem($vitri){
     
        $sql = "SELECT a.* FROM tbl_giaothong_berong a, tbl_giaothong_vitri b where a.parent = b.id  and b.code = '{$vitri}'   ";
        return db_get_list($sql);
    }
    
    function db_get_ds_tiepgiap(){
     
        $sql = "SELECT * FROM tbl_giaothong_tiepgiap  ";
        return db_get_list($sql);
    }
    
     function db_get_ds_hinhdang(){
     
        $sql = "SELECT * FROM tbl_kichthuoc_hinhdang  ";
        return db_get_list($sql);
    }

    function db_get_ds_tenduong_theo_khuvuc($xa){

        $sql = "SELECT a.id, a.tenduong2 AS tenduong "
                . "FROM tbl_danhmuc_giaothong a, "
                . "     (SELECT b.ma_huyen, a.`khuvuc` "
                . "        FROM tbl_phuongxa a, tbl_quanhuyen b "
                . "       WHERE a.parent = b.id "
                . "         AND a.id = {$xa} "
                . "      ) b "
                . "WHERE a.dvhc_huyen = b.ma_huyen "
                . "        AND a.`LOAI_VUNG` = b.khuvuc "
                . "ORDER BY tenduong ";
        return db_get_list($sql);
    }

function db_get_thongtin_tenduong($duong){
    $sql = "select a.*,a.ten_duong ten_duongchinh, a.loai_khu_vuc loai_khuvuc_2 from tbl_danhmuc_giaothong a where id = {$duong} ";
    $res = db_get_row($sql);
    return $res; //
}

    function db_get_thongtin_tenduong_hem($duong, $loai_hem){
        $sql = "";
        $sql .= "SELECT b.`id`, b.name ten_duong, b.code code_hem, vung loai_vung, ma_huyen, b.`he_so_d`, b.`he_so_kn`, b.`he_so_kp`, b.`loai_khuvuc_duongchinh` loai_khu_vuc, ";
        $sql .= "       a.ten_duong ten_duongchinh, a.tu, a.den, a.`tenduong2`, b.loai_khu_vuc loai_khuvuc_2 ";
        $sql .= "FROM tbl_danhmuc_giaothong a  , ";
        $sql .= "      tbl_danhmuc_hem b ";
        $sql .= "WHERE a.id= {$duong} ";
        $sql .= "AND a.dvhc_huyen = b.ma_huyen ";
        $sql .= "AND a.loai_vung = b.vung ";
        $sql .= "AND a.`loai_khu_vuc` = b.`loai_khuvuc_duongchinh` ";
        $sql .= "AND b.`code` = '{$loai_hem}' " ;
        $res = db_get_row($sql);
        return $res; //
    }



    function db_get_ds_tenduong_theo_khuvuc_all($xa,$duong){

        $sql = "SELECT a.* "
            . "FROM tbl_danhmuc_giaothong a, "
            . "     (SELECT b.ma_huyen, a.khuvuc "
            . "        FROM tbl_phuongxa a, tbl_quanhuyen b "
            . "       WHERE a.ma_huyen = b.ma_huyen "
            . "         AND a.id = {$xa} "
            . "      ) b "
            . "WHERE a.dvhc_huyen = b.ma_huyen "
            . "        AND a.LOAI_VUNG = b.khuvuc ";

            if (!empty($duong))
                $sql = $sql . " and a.ten_duong like '%{$duong}%'  " ;

        //$sql = $sql . " and (LOWER(CONVERT(a.ten_duong USING utf8))  like '%". mb_strtolower($duong,'utf-8') . "%' "
        //    . " or LOWER(CONVERT(a.ten_duong USING utf8)) like '%" . mb_strtolower(stripVietName($duong),'utf-8') . "%' )";

        $sql = $sql . "ORDER BY ten_duong ";
        return db_get_list($sql);
    }


function db_get_ds_VitriThuadat_td(){

    $sql = "SELECT * FROM tbl_vitri_thuadat   ";
    return db_get_list($sql);
}

function db_get_bang_gia_td($duong){

    $sql = QUERY_get_bang_gia_td($duong);

    //error_log("db_get_bang_gia_td:sql=>" . $sql);

    return db_get_list($sql);


}

function db_get_bang_gia_hem_td($duong,$hem){

    /*
    $giatinh = 1;
    if ($hem=='HD4') $giatinh = 70/100;

    $sql = "";
    $sql .= "SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} LUA, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} CLN, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} RSX, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} NTS, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, ";

    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} LUA_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} CLN_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} RSX_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} NTS_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 ";

    $sql .= "FROM ( ";

    $sql .= "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
    $sql .= "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
    $sql .= "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
    $sql .= "	FROM tbl_giadat a, ";
    $sql .= "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
    $sql .= "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
	$sql .= "				FROM tbl_danhmuc_giaothong a  , ";
	$sql .= "							tbl_danhmuc_hem b ";
	$sql .= "				WHERE a.id= {$duong} ";
	$sql .= "				AND a.dvhc_huyen = b.ma_huyen ";
	$sql .= "				AND a.loai_vung = b.vung ";
	$sql .= "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
	$sql .= "				AND b.code = '{$hem}' ";
	$sql .= "				) b ";
    $sql .= "	  WHERE a.ma_dvhc = b.ma_huyen ";
    $sql .= "	  AND a.khu_vuc = b.loai_khuvuc ";
    $sql .= "	  AND a.ma_vung = b.loai_vung ";
    $sql .= "	  AND a.ma_vung is not NULL ";
    $sql .= "	  GROUP BY ";
    $sql .= "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END, ";
    $sql .= "		vitri ";
    $sql .= "	union all ";
    $sql .= "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
    $sql .= "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
    $sql .= "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
    $sql .= "	FROM tbl_giadat a, ";
    $sql .= "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
    $sql .= "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
    $sql .= "				FROM tbl_danhmuc_giaothong a  , ";
    $sql .= "							tbl_danhmuc_hem b ";
    $sql .= "				WHERE a.id= {$duong} ";
    $sql .= "				AND a.dvhc_huyen = b.ma_huyen ";
    $sql .= "				AND a.loai_vung = b.vung ";
    $sql .= "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
    $sql .= "				AND b.code = '{$hem}' ";
    $sql .= "				) b ";
    $sql .= "	  WHERE a.ma_dvhc = b.ma_huyen ";
    $sql .= "	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khuvuc end) ";
    $sql .= "	  AND a.ma_vung is NULL ";
    $sql .= "	  GROUP BY ";
    $sql .= "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END, ";
    $sql .= "		vitri ";


    $sql .= "		) A ";
    $sql .= "GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END" ;
    */
    $sql = QUERY_get_bang_gia_hem_td($duong,$hem);

    //error_log("db_get_bang_gia_hem_td:sql=>" . $sql);
    return db_get_list($sql);

}

////query
function QUERY_get_bang_gia_td($duong){
    $sql = "";
    $sql .= "SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) LUA, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) CLN, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) RSX, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) NTS, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, ";

    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) LUA_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) CLN_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) RSX_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) NTS_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 ";

    $sql .= "FROM ( ";
    $sql .= "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
    $sql .= "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
    $sql .= "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
    $sql .= "	FROM tbl_giadat a, ";
    $sql .= "	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = {$duong}) b ";
    $sql .= "	  WHERE a.ma_dvhc = b.dvhc_huyen ";
    $sql .= "	  AND a.khu_vuc = b.loai_khu_vuc ";
    $sql .= "	  AND a.ma_vung = b.loai_vung AND a.ma_vung is NOT NULL ";
    $sql .= "	  GROUP BY ";
    $sql .= "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END, ";
    $sql .= "		vitri ";
    $sql .= "	UNION ALL " ;
    $sql .= "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
    $sql .= "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
    $sql .= "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
    $sql .= "	FROM tbl_giadat a, ";
    $sql .= "	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = {$duong}) b ";
    $sql .= "	  WHERE a.ma_dvhc = b.dvhc_huyen ";
    $sql .= "	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khu_vuc end) ";
    $sql .= "	  AND a.ma_vung  is NULL ";
    $sql .= "	  GROUP BY ";
    $sql .= "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END, ";
    $sql .= "		vitri ";
    $sql .= "		) A ";
    $sql .= "GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END" ;

    return $sql;
}
function QUERY_get_bang_gia_hem_td($duong,$hem){

    $giatinh = 1;
    if ($hem=='HD4') $giatinh = 80/100;

    $sql = "";
    $sql .= "SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} LUA, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} CLN, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} RSX, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{$giatinh} NTS, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, ";

    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} LUA_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} CLN_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} RSX_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{$giatinh} NTS_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, ";
    $sql .= "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 ";

    $sql .= "FROM ( ";

    $sql .= "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
    $sql .= "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
    $sql .= "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
    $sql .= "	FROM tbl_giadat a, ";
    $sql .= "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
    $sql .= "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
    $sql .= "				FROM tbl_danhmuc_giaothong a  , ";
    $sql .= "							tbl_danhmuc_hem b ";
    $sql .= "				WHERE a.id= {$duong} ";
    $sql .= "				AND a.dvhc_huyen = b.ma_huyen ";
    $sql .= "				AND a.loai_vung = b.vung ";
    $sql .= "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
    $sql .= "				AND b.code = '{$hem}' ";
    $sql .= "				) b ";
    $sql .= "	  WHERE a.ma_dvhc = b.ma_huyen ";
    $sql .= "	  AND a.khu_vuc = b.loai_khuvuc ";
    $sql .= "	  AND a.ma_vung = b.loai_vung ";
    $sql .= "	  AND a.ma_vung is not NULL ";
    $sql .= "	  GROUP BY ";
    $sql .= "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END, ";
    $sql .= "		vitri ";
    $sql .= "	union all ";
    $sql .= "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
    $sql .= "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
    $sql .= "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
    $sql .= "	FROM tbl_giadat a, ";
    $sql .= "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
    $sql .= "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
    $sql .= "				FROM tbl_danhmuc_giaothong a  , ";
    $sql .= "							tbl_danhmuc_hem b ";
    $sql .= "				WHERE a.id= {$duong} ";
    $sql .= "				AND a.dvhc_huyen = b.ma_huyen ";
    $sql .= "				AND a.loai_vung = b.vung ";
    $sql .= "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
    $sql .= "				AND b.code = '{$hem}' ";
    $sql .= "				) b ";
    $sql .= "	  WHERE a.ma_dvhc = b.ma_huyen ";
    $sql .= "	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khuvuc end) ";
    $sql .= "	  AND a.ma_vung is NULL ";
    $sql .= "	  GROUP BY ";
    $sql .= "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
    $sql .= "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
    $sql .= "		    ELSE ma_loai_dat END, ";
    $sql .= "		vitri ";


    $sql .= "		) A ";
    $sql .= "GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END" ;


    return $sql;

}


function get_bang_gia_chuyendoi($duong,$vitri){

    $sql = QUERY_CHUYEN_DOI_MDSD($duong,$vitri);
    //error_log("QUERY_CHUYEN_DOI_MDSD_HEM:sql=>" . $sql);
    return db_get_list($sql);

}
function QUERY_CHUYEN_DOI_MDSD($duong,$vitri){
    $thong_tin_duong = db_get_thongtin_tenduong($duong);
    $khuvuc=$thong_tin_duong["loai_vung"];
    $sql = "";

    if (strcmp($khuvuc,"NT")){
        $sql = "SELECT A0.THU_TU, A0.PHAM_VI, ";
        $sql .= "      A2.ODT - A1.LUA AS LUA_DAT_O_THM , ";
        $sql .= "      A2.ODT_2 - A1.LUA_2 AS LUA_DAT_O_VHM, ";
        $sql .= "      A2.TMDV_2 - A1.LUA_2 AS LUA_TMDV70,  ";
        $sql .= "      A2.SKC_2 - A1.LUA_2 AS LUA_SXKD70, ";
        $sql .= "      A2.ODT - A1.CLN AS CLN_DAT_O_THM , ";
        $sql .= "      A2.ODT_2 - A1.CLN_2 AS CLN_DAT_O_VHM, ";
        $sql .= "      A2.TMDV_2 - A1.CLN_2 AS CLN_TMDV70,  ";
        $sql .= "      A2.SKC_2 - A1.CLN_2 AS CLN_SXKD70 ";
        $sql .= " FROM tbl_chuyen_md A0, ";
    }
    else if (strcmp($khuvuc,"DT")) {
        $sql = "SELECT A0.THU_TU, A0.PHAM_VI, ";

        $sql .= "      A1.ODT - A2.LUA AS LUA_DAT_O_THM , ";
        $sql .= "      A1.ODT_2 - A2.LUA_2 AS LUA_DAT_O_VHM, ";
        $sql .= "      A1.TMDV_2 - A2.LUA_2 AS LUA_TMDV70,  ";
        $sql .= "      A1.SKC_2 - A2.LUA_2 AS LUA_SXKD70, ";

        $sql .= "      A1.ODT - A2.CLN AS CLN_DAT_O_THM , ";
        $sql .= "      A1.ODT_2 - A2.CLN_2 AS CLN_DAT_O_VHM, ";
        $sql .= "      A1.TMDV_2 - A2.CLN_2 AS CLN_TMDV70,  ";
        $sql .= "      A1.SKC_2 - A2.CLN_2 AS CLN_SXKD70 ";
        $sql .= " FROM tbl_chuyen_md_dt A0, ";

    }

    if ($vitri=="MT"){
        $sql .= " (" . QUERY_get_bang_gia_td($duong) . " ) A1, ";
        $sql .= " (" . QUERY_get_bang_gia_td($duong) . " ) A2 ";
    }
    else{
        $sql .= " (" . QUERY_get_bang_gia_hem_td($duong,$vitri) . " ) A1, ";
        $sql .= " (" . QUERY_get_bang_gia_hem_td($duong,$vitri) . " ) A2 ";
    }

    $sql .= " WHERE A0.VITRI_GOC = A1.VITRI ";
    $sql .= "   AND A0.VITRI_CHUYEN = A2.VITRI ";
    $sql .= " ORDER BY A0.THU_TU ";




    return $sql;
}



function QUERY_CHUYEN_DOI_MDSD_B3($duong,$vitri,$sonam){

    $thong_tin_duong = db_get_thongtin_tenduong($duong);
    $khuvuc=$thong_tin_duong["loai_vung"];
    $sql = "";

    if (strcmp($khuvuc,"NT")){
        $sql = "SELECT A0.THU_TU, A0.PHAM_VI, ";

        $sql .= "      A2.TMDV_2 - A1.CLN_2 AS B3_CLN_TMDV , ";
        $sql .= "      A2.SKC_2 - A1.CLN_2 AS B3_CLN_SXKD, ";
        $sql .= "      ROUND(A2.ODT - (A2.SKC*{$sonam}/70),1) AS B3_SXKD_DAT_O_THM,  ";
        $sql .= "      ROUND(A2.ODT_2 - (A2.SKC_2*{$sonam}/70),1) AS B3_SXKD_DAT_O_VHM, ";
        $sql .= "      ROUND(A2.ODT - (A2.TMDV*{$sonam}/70),1) AS B3_TMDV_DAT_O_THM , ";
        $sql .= "      ROUND(A2.ODT_2 - (A2.TMDV_2*{$sonam}/70),1) AS B3_TMDV_DAT_O_VHM, ";
        $sql .= "      ROUND((A2.TMDV_2 - A2.SKC_2) *{$sonam}/70,1) AS B3_SXKD_TMDV";
        $sql .= " FROM tbl_chuyen_md A0, ";
    }
    else if (strcmp($khuvuc,"DT")) {
        $sql = "SELECT A0.THU_TU, A0.PHAM_VI, ";

        $sql .= "      A1.TMDV_2 - A2.CLN_2 AS B3_CLN_TMDV , ";
        $sql .= "      A1.SKC_2 - A2.CLN_2 AS B3_CLN_SXKD, ";
        $sql .= "      ROUND(A1.ODT - (A1.SKC*{$sonam}/70),1) AS B3_SXKD_DAT_O_THM,  ";
        $sql .= "      ROUND(A1.ODT_2 - (A1.SKC_2*{$sonam}/70),1) AS B3_SXKD_DAT_O_VHM, ";
        $sql .= "      ROUND(A1.ODT - (A1.TMDV*{$sonam}/70),1) AS B3_TMDV_DAT_O_THM , ";
        $sql .= "      ROUND(A1.ODT_2 - (A1.TMDV_2*{$sonam}/70),1) AS B3_TMDV_DAT_O_VHM, ";
        $sql .= "      ROUND((A1.TMDV_2 - A1.SKC_2) *{$sonam}/70,1) AS B3_SXKD_TMDV";
        $sql .= " FROM tbl_chuyen_md_dt A0, ";
    }



    if ($vitri=="MT"){
        $sql .= " (" . QUERY_get_bang_gia_td($duong) . " ) A1, ";
        $sql .= " (" . QUERY_get_bang_gia_td($duong) . " ) A2 ";
    }
    else{
        $sql .= " (" . QUERY_get_bang_gia_hem_td($duong,$vitri) . " ) A1, ";
        $sql .= " (" . QUERY_get_bang_gia_hem_td($duong,$vitri) . " ) A2 ";
    }

    $sql .= " WHERE A0.VITRI_GOC = A1.VITRI ";
    $sql .= "   AND A0.VITRI_CHUYEN = A2.VITRI ";
    $sql .= " ORDER BY A0.THU_TU ";



    return $sql;
}

function get_bang_gia_chuyendoi_b3($duong,$vitri,$sonam){

    $sql = QUERY_CHUYEN_DOI_MDSD_B3($duong,$vitri,$sonam);
    //error_log("QUERY_CHUYEN_DOI_MDSD_B3_NT:sql=>" . $sql);
    return db_get_list($sql);

}


//////////////////////////////

function stripVietName($str){
    if(!$str) return false;
    $unicode = array(
        'a'=>'�|�|?|�|?|?|?|?|?|?|?|�|?|?|?|?|?',
        'd'=>'?',
        'e'=>'�|�|?|?|?|�|?|?|?|?|?',
        'i'=>'�|�|?|?|?',
        'o'=>'�|�|?|�|?|�|?|?|?|?|?|?|?|?|?|?|?',
        'u'=>'�|�|?|?|?|?|?|?|?|?|?',
        'y'=>'�|?|?|?|?',
    );
    foreach($unicode as $nonUnicode=>$uni)
        $str = preg_replace("/($uni)/i",$nonUnicode,$str);
    return $str;
}
?>