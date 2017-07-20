<?php
define("IN_SITE", true);

//include_once ('./tracuugiadat/database.php');
include_once ('./tracuugiadat/dal.php');



$dsquanhuyen = db_get_danhsachQuanHuyen();
$ds_vitri = db_get_ds_VitriThuadat_td();


$var_khuvuc ="";  //NT; DT
$var_loai_khuvuc;  //1,2,3


?>
    <!-- Navigation -->
    <?php include('templates/header.php')?>
    <style>
        .ghichu {
            padding: 10px;
        }

        .tooltip.top .tooltip-inner {
            background-color: dodgerblue;
        }

        .tooltip.top .tooltip-arrow {
            border-top-color: dodgerblue;
        }

        .tooltip.bottom .tooltip-inner {
            background-color: dodgerblue;
        }

        .tooltip.bottom .tooltip-arrow {
            border-bottom-color: dodgerblue;
        }

        .tooltip-inner {
            max-width: 400px;
            max-height: 400px;
            overflow-y: auto
        }


        #divKetqua {
            padding-left: 0px;
        }
    </style>
    <!-- Page Content -->
    <div class="container">
        <div class="row">

            <div class="col-md-12">
                <p class="bg-primary">TRA CỨU GIÁ ĐẤT TỈNH BÌNH DƯƠNG</p>
                <div class="panel panel-primary ">
                    <div class="panel-heading">THÔNG TIN TRA CỨU</div>
                    <div class="panel-body">
                        <input type="button" hidden value="Check" onclick="check();" />
                        <div class="panel panel-info ">
                            <div class="panel-heading">Địa chỉ thửa đất</div>
                            <div class="panel-body pn_noidung">
                                <table class="tb_noidung">
                                    <tr>
                                        <td>
                                            <div class=" form-group">
                                                <label for="cboHuyen" class="col-xs-12 col-sm-4 col-md-3  control-label">Huyện, thị xã, thành phố:</label>
                                                <div class="col-xs-12 col-sm-8 col-md-6">
                                                    <select id="cboHuyen" class="form-control" onChange="act_td_chon_huyen(this.value);">
                                                    <option value="">Chọn huyện, thị xã, thành phố...</option>
                                                    <?php foreach($dsquanhuyen as $item){?>
                                                        <option value="<?php echo($item['ma_huyen'])?>"><?php echo($item['name'])?></option>
                                                    <?php }?>

                                                </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="form-group">
                                                <label for="cboPhuongXa" class="col-xs-12 col-sm-4 col-md-3 control-label">Xã, phường, thị trấn:</label>
                                                <div class="col-xs-12 col-sm-8 col-md-6">
                                                    <select id="cboPhuongXa" class="form-control" onChange="act_td_chon_phuongxa(this.value);">
                                                    <option value="">Chọn xã, phường, thị trấn...</option>
                                                </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div class="form-group">
                                                <label for="txtTenduong" class="col-xs-12 col-sm-4 col-md-3 control-label">Tuyến đường:</label>
                                                <div class="col-xs-12 col-sm-8 col-md-6">
                                                    <input class="form-control" id="txtTenduong" type="text" placeholder="Nhập Tuyến đường..." onKeyUp="act_td_chon_phuongxa(0);">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="form-group">
                                                <label for="cbo_vitri" class="col-xs-12 col-sm-4 col-md-3 control-label">Vị trí thửa đất:</label>
                                                <div class="col-xs-12 col-sm-8 col-md-6">
                                                    <select id="cbo_vitri" class="form-control" onChange="act_chon_vitri_thuadat(this.value);">
                                                    <option value="">Chọn vị trí thửa đất ...</option>
                                                    <?php foreach($ds_vitri as $item){?>
                                                        <option value="<?php echo($item['code'])?>"><?php echo($item['name'])?></option>
                                                    <?php }?>
                                                </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>


                                </table>
                                <hr/>
                                <div class="div_table" id="dv_tb_tuyenduong">
                                    <table class="table table-bordered">
                                        <!--<tr>
                                        <th>TÊN ĐƯỜNG</th><th>TỪ</th><th>ĐOẠN</th><th>GIÁ ĐẤT</th>
                                    </tr>
                                    <tr>
                                        <td></td><td></td><td></td><td></td>
                                    </tr>-->
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div id="dv_test"></div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="div_ketqua">
        <div class="modal fade col-xs-12 col-md-12 col-lg-12" id="divKetqua" tabindex="-10" role="dialog" aria-labelledby="modalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #337ab7;color: #ffffff">

                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

                        <h3 class="modal-title" id="lineModalLabel">KẾT QUẢ TRA CỨU</h3>

                    </div>
                    <div style="text-align: right; padding-right: 20px;padding-top: 5px;">
                        <a href="#" id="export_doc"><i class="fa fa-file-word-o" aria-hidden="true"></i> In kết quả</a>
                    </div>

                    <div class="modal-body" id='area-print'>
                        <?php include ('./tracuugiadat/htmls/tuyenduong_chitiet.php');?>
                    </div>
                    <div class="modal-footer">

                        <button type="button" class="btn btn-danger btn-default btn-group-justified" data-dismiss="modal">Close</button>

                    </div>
                </div>

            </div>
        </div>
    </div>
    <div>
        <div class="modal fade" id="div-minimap" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #337ab7;color: #ffffff">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                        <h3 class="modal-title" id="lineModalLabel">Bản đồ</h3>

                    </div>
                    <div class="modal-body" id='area-print'>
                        <iframe id="mapiframe" src="map.html"></iframe>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <script src="tracuugiadat/js/scripts.js"></script>
    <?php include('templates/footer.php')?>