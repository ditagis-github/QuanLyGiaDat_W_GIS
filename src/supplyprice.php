<?php
$name = $_POST['name'];
$thuadatid = $_POST['thuadatid'];
$loaithuadat = $_POST['loaithuadat'];
$phone = $_POST['phonenumber'];
$price = $_POST['price'];

$conn = pg_connect("host=112.78.5.153 port=5432 dbname=GiaDatBD user=postgres password=123") or die('Không thể kết nối đến máy chủ dữ liệu');

$query = "INSERT INTO nguoidancungcap(mathuadat, ten, sodienthoai, giatien,loaithuadat)
VALUES ($thuadatid, N'$name', '$phone', $price,'$loaithuadat')";
$result = pg_query($query);
$response = new stdClass();


if (!$result) {
	$errormessage = pg_last_error();
    $response->error = 'Could not connect to Mysql';
$response->message = "Error with query: " . $errormessage;
	exit();
}
$response->message = "Cập nhật thành công";
echo json_encode($response);
pg_close();

