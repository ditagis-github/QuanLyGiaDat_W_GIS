<?php
/**
 * Created by  TuanAnh
 * Date: 2016-04-30
 * Time: 8:49 AM
 */
?>
<div class="panel panel-info ">
    <div class="panel-heading">Hiện trạng giao thông</div>
    <div class="panel-body pn_noidung" >

        <table class="tb_noidung">
            <tr>
                <td>
                    <div class="form-group">
                        <label for="cbo_tenduong" class="col-sm-5 control-label">Tên đường chính hoặc KDC, KCN,...:</label>
                        <div class="col-sm-7">
                            <select id="cbo_tenduong" class="form-control" onchange="act_chon_tenduong(this.value);">
                                <option value="">Chọn tên đường chính hoặc KDC, KCN, ...</option>
                            </select>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="form-group">
                        <label for="cbo_vitri" class="col-sm-5 control-label">Vị trí thửa đất:</label>
                        <div class="col-sm-7">
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

            <tr>
                <td>
                    <div class="form-group">
                        <label for="cbo_berong" class="col-sm-5 control-label">Bề rộng mặt đường hẻm (mét):</label>
                        <div class="col-sm-7">
                            <select id="cbo_berong" class="form-control" onchange="act_chon_berong_matduong(this.value);" >
                                <option value="">Chọn bề rộng mặt đường hẻm ...</option>
                            </select>
                        </div>
                    </div>
                </td>
            </tr>

            <tr>
                <td>
                    <div class="form-group">
                        <label for="cbo_vitri_tiepgiap" class="col-sm-5 control-label">
                            Vị trí và khoảng cách từ thửa đất đến đường hoặc hẻm gần nhất nếu thửa đất không tiếp giáp đường hoặc hẻm (mét):
                        </label>
                        <div class="col-sm-7">
                            <table style="width: 100%;">
                                <tr>
                                    <td>
                                        <select id="cbo_vitri_tiepgiap" class="form-control" onChange="set_khoangcach(this.value);">
                                            <option value="">Chọn vị trí ...</option>

                                            <?php foreach($ds_tiepgiap as $item){?>
                                                <option value="<?php echo($item['id'])?>"><?php echo($item['name'])?></option>
                                            <?php }?>

                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input class="form-control txt_loaidat" id="txt_khoangcach" type="number"   placeholder="Nhập khoảng cách..."/>
                                    </td>
                                </tr>
                            </table>

                        </div>

                    </div>
                </td>
            </tr>

        </table>

    </div>
</div>
