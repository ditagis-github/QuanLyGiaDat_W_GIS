<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Tra cứu giá đất, chuyển mục đích sử dụng đất tỉnh Bình Dương</title>

    <!-- jQuery -->
    <script src="./templates/js/jquery.js"></script>
    <!-- Bootstrap Core CSS -->
    <link href="./templates/css/bootstrap.min.css" rel="stylesheet">


    <!-- Custom CSS -->
    <link href="./templates/css/modern-business.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="./templates/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="tracuugiadat/html5shiv.js"></script>
    <script src="tracuugiadat/respond.min.js"></script>
    <![endif]-->

</head>

<body>

<?php
    include('tracuugiadat/htmls/header.php');
    $msg = "";

if (isset($_GET['ketqua'])) {
    $kq = $_GET['ketqua'];
    if ($kq=="ok"){
        $msg = "Thông tin đã được gửi<br>Chân thành cám ơn.";
    }
    else if ($kq=="error"){
        $msg = '<div style="color: red">Thông tin chưa gửi được</div>';
    }

}
?>
<div class="container">
    <div class="row  box" style="text-align: center;">
         <div><h3><?php echo($msg); ?></h3></div>
    </div>
    <div class="row" style="text-align: center;"><a href="index.php"><span class="fa fa-home" aria-hidden="true" style="font-size: x-large"></span> Về trang chủ</a></div>
</div>
</body>

</html>
<style>
    .box {
        display: flex;
        flex-wrap: wrap; /* optional. only if you want the items to wrap */
        justify-content: center; /* for horizontal alignment */


    }
</style>