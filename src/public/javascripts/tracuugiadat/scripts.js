function act_chon_huyen(val) {
  //$("#div_tb1_c1").html("&nbsp;");
  $.ajax({
    type: "POST",
    dataType: 'json',
    url: "./get_phuongxa",
    data: 'parent=' + val,
    success: function (data) {
      console.log(data);
      $("#cboPhuongXa").html(data.phuongxa);
      $("#txt_kyhieu_do").val("");
      $("#dv_tb1_khuvuc").html("&nbsp;");
      //alert('ok');
    }
  });
}

function getKhuvuc_kyhieudat(val) {
  $.ajax({
    type: "POST",
    url: "./tracuugiadat/get_khuvuc_kyhieudat.php",
    data: 'id=' + val,
    success: function (data) {
      //alert (data);
      var s = data.split(";");
      $("#txt_kyhieu_do").val(s[1]);
      $("#dv_tb1_khuvuc").html(s[0]);

      //test set value to div
      $("#div_tb1_c1").html(s[0]);

    }
  });
}





function set_khoangcach(val) {
  if (val == 1) {
    $("#txt_khoangcach").val(0);
    $("#txt_khoangcach").attr("disabled", "true");
  } else {
    $("#txt_khoangcach").attr("disabled", false);
    $("#txt_khoangcach").val('');

  }
}

//actionn khi chon Phuong Xa
function act_chon_phuongxa(val) {
  //$("#div_tb1_c1").html('');
  $.ajax({
    type: "POST",
    url: "./tracuugiadat/get_khuvuc_kyhieudat.php",
    data: 'id=' + val,
    dataType: 'json',
    success: function (data) {
      //alert (data);
      //var s = data.split(";");
      $("#txt_kyhieu_do").val(data.kyhieu);
      $("#dv_tb1_khuvuc").html(data.khuvuc);
      $("#cbo_tenduong").html(data.dstenduong);

      $var_khuvuc = data.khuvuc_code;


      //test set value to div
      //$("#div_tb1_c1").html(data.dstenduong);
      //alert(data.dstenduong);
    }
  });
}

//Khi chọn Tên đường => xac dinh Loai khu vuc từ danhmuc_giaothong
function act_chon_tenduong(val) {
  $("#cbo_vitri").val("");
  $("#dv_tb1_tuyenduong").html('');
  $.ajax({
    type: "POST",
    url: "./tracuugiadat/f_common.php?act=cbo_tenduong",
    data: 'id=' + val,
    dataType: 'json',
    success: function (res) {
      $var_loai_khuvuc = res.loaikhuvuc
      $("#div_tb1_c1").html($var_loai_khuvuc);
      $("#div_tb1_c2").html(res.heso_d);
      $("#div_tb1_c3").html(res.heso_kn);
      $("#div_tb1_c4").html(res.heso_kp);
    }
  });
}


function act_chon_berong_matduong(val) {
  $var_tuyenduong = "";
  $var_berong = $('#cbo_berong').val();

  if ($var_berong == "MTC") {
    $var_tuyenduong = $('#cbo_tenduong').find("option:selected").text();
  } else {
    $var_tuyenduong = "Đường hoặc lối đi công cộng {BE_RONG}<br>thông ra tuyến {LOAI}";


    $var_str_berong = "";
    $var_str_loai = "";

    if ($var_berong == "T4M")
      $var_str_berong = "TRÊN 4M";
    else if ($var_berong == "D4M")
      $var_str_berong = "DƯỚI 4M";
    else
      $var_str_berong = "#";

    if ($var_khuvuc == 'NT') {
      $var_str_loai = "ĐƯỜNG KHU VỰC " + $var_loai_khuvuc;
    } else if ($var_khuvuc == 'DT') {
      $var_str_loai = "ĐƯỜNG PHỐ LOẠI " + $var_loai_khuvuc;
    }
    $var_tuyenduong = $var_tuyenduong.replace("{BE_RONG}", $var_str_berong);
    $var_tuyenduong = $var_tuyenduong.replace("{LOAI}", $var_str_loai);
  }
  $("#dv_tb1_tuyenduong").html($var_tuyenduong);
}

function act_td_chon_huyen(val) {
  //$("#div_tb1_c1").html("&nbsp;");
  //alert(val);
  $.ajax({
    type: "POST",
    dataType: 'json',
    url: "./tracuu/get_phuongxa",
    data: 'mahuyen=' + val,
    success: function (res) {
      var html = '';
      for (let item of res) {
        html += `<option value=${item.id}>${item.name}</option>`
      }
      $("#cboPhuongXa").html(html);
    }
  });
}

function act_td_chon_phuongxa(val) {
  //$("#div_tb1_c1").html('');
  $xa = $("#cboPhuongXa").val();
  $tenduong = $("#txtTenduong").val();
  //alert($tenduong);
  $.ajax({
    type: "POST",
    url: "./tracuu/cbo_chonxa",
    data: {
      xa: $xa,
      duong: $tenduong
    },
    dataType: 'json',
    success: function (data) {
      var str = `<table class='table table-bordered table-hover' id='tblist'> 
                    <tr class=\"bg-info\"> 
                    <th class=\"bg-info\">TÊN ĐƯỜNG</th><th class=\"bg-info\">TỪ</th><th class=\"bg-info\">ÐẾN</th><th class=\"bg-info\">GIÁ</th> 
                    </tr> `;


      for (let item of data) {
        var str_row_temp = ` <tr> 
                <td>${item.ten_duong}</td><td>${item.tu}</td><td>${item.den}</td>
                <td><a data-target='#divKetqua' title='Xem giá đất' onclick='act_td_xem(${item.id});'>Xem giá đất</a> | 
                <a title='Xem vị trí tại bản đồ' data-tenduong='${item.ten_duong}' data-tu='${item.tu}' data-den='${item.den}' onclick='focusmap(this);'>Xem vị trí</a> </td>
                </tr> `;
        str += str_row_temp;
      }
      $("#dv_tb_tuyenduong").html(str)
      //alert(data.ds_duong);
    }
  });
}


function f_layvitri(vitri, duong, duongchinh, tu, den) {
  $diengiai = "";

  if (vitri == "MT") {
    $diengiai = "<b>Mặt tiền</b> - đường <b>" + duong + "</b>";

    if (tu.length > 0)
      $diengiai = $diengiai + " (đoạn từ <b>" + tu + "</b> đến <b>" + den + "</b>)";
  } else {
    //$diengiai = duong + " (đường <b>" + duongchinh + "</b>";

    $diengiai = "Đường hoặc lối đi công cộng có bề rộng mặt đường <b>{vitri}</b> thông ra đường "; //từ 4 mét trở lên
    if (vitri == "HT4")
      $diengiai = $diengiai.replace("{vitri}", "từ 4 mét trở lên");
    else if (vitri == "HD4")
      $diengiai = $diengiai.replace("{vitri}", "dưới 4 mét");

    $diengiai = $diengiai + " <b>" + duongchinh + "</b>"

    if (tu.length > 0)
      $diengiai = $diengiai + " ( đoạn từ <b>" + tu + "</b> đến <b>" + den + "</b>)";



  }

  return $diengiai;


}

function reset_bang_chuyendoi() {
  for ($b = 3; $b <= 5; $b++) {
    for ($i = 1; $i <= 4; $i++) {
      $("#div_b" + $b + "_d" + $i + "c1").html("");
      $("#div_b" + $b + "_d" + $i + "c2").html("");
      $("#div_b" + $b + "_d" + $i + "c3").html("");

      if ($b != 5)
        $("#div_b" + $b + "_d" + $i + "c4").html("");

    }
  }
}

function act_td_xem(val) {

  $("#dv_vitri").html("");
  $("#dv_loai").html("");
  $("#dv_tb1").html("");
  $("#dv_tb2").html("");
  $("#dv_tb3").html("");
  $("#dv_tb4").html("");
  $("#dv_tb5").html("");

  reset_bang_chuyendoi();


  var vitri = $('#cbo_vitri').val();
  var nam = 50;



  //if (nam.length==0) nam = 50;

  //alert(nam);

  if (vitri.length == 0) {
    alert("Vui lòng chọn vị trí thửa đất!")
    $("#divKetqua").modal("hide");
  } else {

    //$("#divKetqua").show();

    $("#dv_vitri").html('');
    $.ajax({
      type: "POST",
      url: "./tracuu/viewdetail",
      data: {
        id: val,
        vitri: vitri,
        sonam: nam
      },
      dataType: 'json',
      success: function (data) {
        var
          TITLE_BANG_1_TD = `<h6>Giá đất theo Bảng giá đất được áp dụng làm căn cứ:</h6>
                        1. Tính tiền sử dụng đất khi Nhà nước công nhận quyền sử dụng đất ở của hộ gia đình, cá nhân đối với phần diện tích trong hạn mức; cho phép chuyển mục đích sử dụng đất từ đất nông nghiệp, đất phi nông nghiệp không phải là đất ở sang đất ở đối với phần diện tích trong hạn mức giao đất ở cho hộ gia đình, cá nhân.<br>
                        2. Tính thuế sử dụng đất.<br>
                        3. Tính phí và lệ phí trong quản lý, sử dụng đất đai.<br>
                        4. Tính tiền xử phạt vi phạm hành chính trong lĩnh vực đất đai.<br>
                        5. Tính tiền bồi thường cho Nhà nước khi gây thiệt hại trong quản lý và sử dụng đất đai.<br>
                        6. Tính giá trị quyền sử dụng đất để trả cho người tự nguyện trả lại đất cho Nhà nước đối với trường hợp đất trả lại là đất Nhà nước giao đất có thu tiền sử dụng đất, công nhận quyền sử dụng đất có thu tiền sử dụng đất, đất thuê trả tiền thuê đất một lần cho cả thời gian thuê.<br>
                        7. Xác định giá đất cụ thể theo phương pháp hệ số điều chỉnh giá đất quy định tại Điều 18 Nghị định số 44/2014/NĐ-CP ngày 15 tháng 5 năm 2014 của Chính phủ quy định về giá đất
                        `,
          TITLE_BANG_2_TD = `<h6>Giá đất theo Hệ số K được áp dụng:</h6>
                        1. Khi xác định giá trị thửa đất hoặc khu đất có giá trị dưới 20 tỷ đồng (tính theo giá đất trong bảng giá đất) thì áp dụng hệ số K để thực hiện:<br>
                        a) Tính tiền sử dụng đất khi Nhà nước công nhận quyền sử dụng đất của hộ gia đình, cá nhân đối với phần diện tích đất ở vượt hạn mức; cho phép chuyển mục đích sử dụng đất từ đất nông nghiệp, đất phi nông nghiệp không phải là đất ở sang đất ở đối với phần diện tích vượt hạn mức giao đất ở cho hộ gia đình, cá nhân. Tính tiền thuê đất đối với đất nông nghiệp vượt hạn mức giao đất, vượt hạn mức nhận chuyển quyền sử dụng đất nông nghiệp của hộ gia đình, cá nhân;<br>
                        b) Tính tiền sử dụng đất khi Nhà nước giao đất có thu tiền sử dụng đất không thông qua hình thức đấu giá quyền sử dụng đất; công nhận quyền sử dụng đất, cho phép chuyển mục đích sử dụng đất đối với tổ chức mà phải nộp tiền sử dụng đất;<br>
                        c) Tính tiền thuê đất đối với trường hợp Nhà nước cho thuê đất không thông qua hình thức đấu giá quyền sử dụng đất;<br>
                        d) Xác định giá trị quyền sử dụng đất (giao, thuê) để tính vào giá trị doanh nghiệp khi cổ phần hóa doanh nghiệp nhà nước mà doanh nghiệp cổ phần hóa sử dụng đất thuộc trường hợp Nhà nước giao đất có thu tiền sử dụng đất, cho thuê đất trả tiền thuê đất một lần cho cả thời gian thuê; tính tiền thuê đất đối với trường hợp doanh nghiệp nhà nước thực hiện cổ phần hóa mà được Nhà nước cho thuê đất trả tiền thuê đất hàng năm;<br>
                        đ) Xác định lại giá đất cụ thể để tính tiền thuê đất tại thời điểm có quyết định cho phép chuyển sang thuê đất theo hình thức trả tiền thuê đất một lần của tổ chức kinh tế, tổ chức sự nghiệp công lập tự chủ tài chính, hộ gia đình, cá nhân, người Việt Nam định cư ở nước ngoài, doanh nghiệp có vốn đầu tư nước ngoài đang được Nhà nước cho thuê đất trả tiền thuê đất hàng năm nay chuyển sang thuê đất trả tiền thuê đất một lần cho cả thời gian thuê;<br>
                        e) Xác định lại giá đất cụ thể khi người mua tài sản được Nhà nước tiếp tục cho thuê đất trong thời hạn sử dụng đất còn lại, sử dụng đất đúng mục đích đã được xác định trong dự án;<br>
                        g) Xác định tiền nhận chuyển nhượng quyền sử dụng đất được trừ vào tiền sử dụng đất, tiền thuê đất phải nộp.<br>
                        h) Xác định giá khởi điểm để đấu giá quyền sử dụng đất đối với trường hợp nhà nước giao đất có thu tiền sử dụng đất, cho thuê đất thu tiền thuê đất một lần cho cả thời gian thuê.
                        2. Thuê đất thu tiền hàng năm mà phải xác định lại đơn giá thuê đất để điều chỉnh cho chu kỳ tiếp theo.<br>
                        3. Xác định giá khởi điểm để đấu giá quyền sử dụng đất khi Nhà nước cho thuê đất thu tiền thuê đất hàng năm
                        `,
          TITLE_CLN_NKH = `<h6>Đất trồng cây lâu năm và Đất nông nghiệp khác</h6>
                        Đất nông nghiệp khác là đất sử dụng để xây dựng nhà kính và các loại nhà khác phục vụ mục đích trồng trọt, kể cả các hình thức trồng trọt không trực tiếp trên đất; xây dựng chuồng trại chăn nuôi gia súc, gia cầm và các loại động vật khác được pháp luật cho phép; đất trồng trọt, chăn nuôi, nuôi trồng thủy sản cho mục đích học tập, nghiên cứu thí nghiệm; đất ươm tạo cây giống, con giống và đất trồng hoa, cây cảnh`,
          TITLE_TM_DV = `<h6>Đất thương mại, dịch vụ</h6>
                        Là đất sử dụng xây dựng các cơ sở kinh doanh, dịch vụ, thương mại và các công trình khác phục vụ cho kinh doanh, dịch vụ, thương mại (kể cả trụ sở, văn phòng đại diện của các tổ chức kinh tế)`,
          TITLE_SXKD = `<h6>Đất sản xuất, kinh doanh</h6>
                        Đất sản xuất, kinh doanh phi nông nghiệp không phải là đất thương mại, dịch vụ: bao gồm các loại đất: đất khu công nghiệp; đất cụm công nghiệp; đất khu chế xuất; đất cơ sở sản xuất phi nông nghiệp; đất sử dụng cho hoạt động khoáng sản; đất sản xuất vật liệu xây dựng, làm đồ gốm.`;

        var banggia1 = `<table class='table table-bordered ' width="100%" id = 'tb_ketqua'>
                    <tr>
                        <th rowspan='2' width='20px'>
                            Vị trí
                        </th>
                        <th colspan='7'>
                            <a href="#" data-toggle="tooltip" data-placement="auto" data-container="body" data-html="true" title="${TITLE_BANG_1_TD}">
                            <div id='div_tieude'>Theo Quyết định số 04/2017/QĐ-UBND (Giá đất theo Bảng giá đất)</div>
                                </a>
                        </th>
                    </tr>
                     <tr>
                        <th ><a href="#" data-toggle="tooltip" data-placement="auto" data-container="body" data-html="true" title="Đất trồng lúa và Đất trồng cây hàng năm">LUA, CHN</a></th>
                        <th ><a href="#" data-toggle="tooltip" data-placement="auto" data-container="body" data-html="true" title="${TITLE_CLN_NKH}">CLN, NKH</a></th>
                        <th ><a href="#" data-toggle="tooltip" data-container="body" data-html="true" title="Đất rừng sản xuất và Đất rừng phòng hộ">RSX, RPH</a></th>
                        <th ><a href="#" data-toggle="tooltip" data-container="body" data-html="true" title="Đất nuôi trồng thủy sản">NTTS</a></th>
                        <th ><a href="#" data-toggle="tooltip" data-container="body" data-html="true" title="Đất ở">Đất ở</a></th>
                        <th ><a href="#" data-toggle="tooltip" data-placement="auto"data-container="body" data-html="true" title="${TITLE_TM_DV}">TM-DV</a></th>
                        <th ><a href="#" data-toggle="tooltip" data-placement="auto"data-container="body" data-html="true" title="${TITLE_SXKD}">SXKD</a></th>
                    </tr>
                    <tr>
                        <th>1</th>
                        <td><div id="div_b1_d1c1">${data.gia1.d1_lua}</div></td>
                        <td><div id="div_b1_d1c2">${data.gia1.d1_cln}</div></td>
                        <td rowspan='4'><div id="div_b1_d1c3">${data.gia1.d1_rsx}</div></td>
                        <td rowspan='4'><div id="div_b1_d1c4">${data.gia1.d1_nts}</div></td>
                        <td><div id="div_b1_d1c5">${data.gia1.d1_odt}</div></td>
                        <td><div id="div_b1_d1c6">${data.gia1.d1_tdv}</div></td>
                        <td><div id="div_b1_d1c7">${data.gia1.d1_skc}</div></td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td><div id="div_b1_d2c1">${data.gia1.d2_lua}</div></td>
                        <td><div id="div_b1_d2c2">${data.gia1.d2_cln}</div></td>
                        <td><div id="div_b1_d2c5">${data.gia1.d2_odt}</div></td>
                        <td><div id="div_b1_d2c6">${data.gia1.d2_tdv}</div></td>
                        <td><div id="div_b1_d2c7">${data.gia1.d2_skc}</div></td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td><div id="div_b1_d3c1">${data.gia1.d3_lua}</div></td>
                        <td><div id="div_b1_d3c2">${data.gia1.d3_cln}</div></td>
                        <td><div id="div_b1_d3c5">${data.gia1.d3_odt}</div></td>
                        <td><div id="div_b1_d3c6">${data.gia1.d3_tdv}</div></td>
                        <td><div id="div_b1_d3c7">${data.gia1.d3_skc}</div></td>
                    </tr>
                    <tr>
                        <th>4</th>
                        <td><div id="div_b1_d4c1">${data.gia1.d4_lua}</div></td>
                        <td><div id="div_b1_d4c2">${data.gia1.d4_cln}</div></td>
                        <td><div id="div_b1_d4c5">${data.gia1.d4_odt}</div></td>
                        <td><div id="div_b1_d4c6">${data.gia1.d4_tdv}</div></td>
                        <td><div id="div_b1_d4c7">${data.gia1.d4_skc}</div></td>
                    </tr>
                </table>`
        var s_tu = data.tu || "";
        var s_den = data.den || "";
        var diengiai = f_layvitri(vitri, data.ten_duong, data.duongchinh, s_tu, s_den);
        $("#dv_vitri").html(diengiai);

        $("#dv_tenduong").html("TÊN ĐƯỜNG : " + data.ten_duong);

        var ghichu = "(";
        if (data.vung == "DT")
          ghichu += "Đường phố Loại: " + data.loai_kv2;
        else
          ghichu += "Đường Khu vực: " + data.loai_kv2;

        //$ghichu = $ghichu + data.loai;
        ghichu += "; Hệ số Đ: " + data.hs_d;
        ghichu += "; Hệ số K<sub>NN</sub>: " + data.hs_kn;
        ghichu += "; Hệ số K<sub>PNN</sub>: " + data.hs_kp;
        ghichu += ")";

        $("#dv_loai").html(ghichu);

        $("#dv_tb1").html(banggia1);
        $("#txtduong").val(val);


        var bang_gia2 = `<table class='table table-bordered ' width="100%" id = 'tb_ketqua'>
                                    <tr>
                                        <th rowspan='2' width='20px'>
                                            Vị trí
                                        </th>
                                        <th colspan='7'>
                                            <a href="#" data-toggle="tooltip" data-placement="auto" data-container="body" data-html="true" title="${TITLE_BANG_2_TD}">
                                            <div id='div_tieude'>Theo Quyết định số 05/2017/QĐ-UBND (Giá đất theo Hệ số K)</div>
                                                </a>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th ><a href="#" data-toggle="tooltip" data-placement="auto" data-container="body" data-html="true" title="Đất trồng lúa và Đất trồng cây hàng năm">LUA, CHN</a></th>
                                        <th ><a href="#" data-toggle="tooltip" data-placement="auto" data-container="body" data-html="true" title="${TITLE_CLN_NKH}">CLN, NKH</a></th>
                                        <th ><a href="#" data-toggle="tooltip" data-container="body" data-html="true" title="Đất rừng sản xuất và Đất rừng phòng hộ">RSX, RPH</a></th>
                                        <th ><a href="#" data-toggle="tooltip" data-container="body" data-html="true" title="Đất nuôi trồng thủy sản">NTTS</a></th>
                                        <th ><a href="#" data-toggle="tooltip" data-container="body" data-html="true" title="Đất ở">Đất ở</a></th>
                                        <th ><a href="#" data-toggle="tooltip" data-placement="auto"data-container="body" data-html="true" title="${TITLE_TM_DV}">TM-DV</a></th>
                                        <th ><a href="#" data-toggle="tooltip" data-placement="auto"data-container="body" data-html="true" title="${TITLE_SXKD}">SXKD</a></th>
                                    </tr>
                                    <tr>
                                        <th>1</th>
                                        <td><div id="div_b2_d1c1">${data.gia2.d1_lua}</div></td>
                                        <td><div id="div_b2_d1c2">${data.gia2.d1_cln}</div></td>
                                        <td rowspan='4'><div id="div_b2_d1c3">${data.gia2.d1_rsx}</div></td>
                                        <td rowspan='4'><div id="div_b2_d1c4">${data.gia2.d1_nts}</div></td>
                                        <td><div id="div_b2_d1c5">${data.gia2.d1_odt}</div></td>
                                        <td><div id="div_b2_d1c6">${data.gia2.d1_tdv}</div></td>
                                        <td><div id="div_b2_d1c7">${data.gia2.d1_skc}</div></td>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <td><div id="div_b2_d2c1">${data.gia2.d2_lua}</div></td>
                                        <td><div id="div_b2_d2c2">${data.gia2.d2_cln}</div></td>
                                        <td><div id="div_b2_d2c5">${data.gia2.d2_odt}</div></td>
                                        <td><div id="div_b2_d2c6">${data.gia2.d2_tdv}</div></td>
                                        <td><div id="div_b2_d2c7">${data.gia2.d2_skc}</div></td>
                                    </tr>
                                    <tr>
                                        <th>3</th>
                                        <td><div id="div_b2_d3c1">${data.gia2.d3_lua}</div></td>
                                        <td><div id="div_b2_d3c2">${data.gia2.d3_cln}</div></td>
                                        <td><div id="div_b2_d3c5">${data.gia2.d3_odt}</div></td>
                                        <td><div id="div_b2_d3c6">${data.gia2.d3_tdv}</div></td>
                                        <td><div id="div_b2_d3c7">${data.gia2.d3_skc}</div></td>
                                    </tr>
                                    <tr>
                                        <th>4</th>
                                        <td><div id="div_b2_d4c1">${data.gia2.d4_lua}</div></td>
                                        <td><div id="div_b2_d4c2">${data.gia2.d4_cln}</div></td>
                                        <td><div id="div_b2_d4c5">${data.gia2.d4_odt}</div></td>
                                        <td><div id="div_b2_d4c6">${data.gia2.d4_tdv}</div></td>
                                        <td><div id="div_b2_d4c7">${data.gia2.d4_skc}</div></td>
                                    </tr>
                                </table>

                                <script>
                                    $(document).ready(function(){
                                        $('[data-toggle="tooltip"]').tooltip();
                                    });
                                </script>`
        $("#dv_tb2").html(bang_gia2);

        //bang gia 3
        var bang_gia3 =
          `<table class='table table-bordered ' width="100%" id = 'tb_ketqua'>
                    <tr>
                        <th rowspan="2" width="200px">Phạm vi chuyển mục đích<br>(tính từ HLATĐB vào)
                        </th>
                        <th colspan="4">Chuyển từ đất LUA, CHN sang</th>
                    </tr>
                    <tr>
                        <th>Đất ở (trong hạn mức)</th>
                        <th>Đất ở (vượt hạn mức)</th>
                        <th>TM-DV (70 năm)</th>
                        <th>SXKD (70 năm)</th>
                    </tr>`
        var bang_gia4 =
          `<table class='table table-bordered ' width="100%" id = 'tb_ketqua'>
                    <tr>
                        <th rowspan="2" width="200px">Phạm vi chuyển mục đích<br>(tính từ HLATĐB vào)</th>
                        <th colspan="4">Chuyển từ đất CLN, NKH sang</th>
                    </tr>
                    <tr>
                        <th>Đất ở (trong hạn mức)</th>
                        <th>Đất ở (vượt hạn mức)</th>
                        <th>TM-DV (70 năm)</th>
                        <th>SXKD (70 năm)</th>
                   </tr>`
        var bang_gia5 =
          `<table class='table table-bordered ' width="100%" id = 'tb_ketqua'>
                   <tr>
                       <th rowspan="2" width="200px">Phạm vi chuyển mục đích<br>(tính từ HLATĐB vào)</th>
                       <th colspan="7" style="text-align: right">
               
                           <div class="divNam">
                               Số năm sử dụng đất SXKD, TM-DV:
                               <input type="number" min="0" value="50" style="width: 50px;text-align: center"   id="txtNam">
                               <input type="text" value="" style="width: 50px;text-align: center"   id="txtduong" HIDDEN>
                               <input type="submit" value="Tính" id="btTinh" onclick="chuyen_pnn_sang_dat_o2();">
                           </div>
               
                       </th>
                   </tr>
                   <tr>
                       <th>Chuyển từ đất CLN, NKH sang TM-DV </th>
                       <th>Chuyển từ đất CLN, NKH sang SXKD </th>
                       <th>Chuyển từ đất SXKD sang Đất ở (trong hạn mức)</th>
                       <th>Chuyển từ đất SXKD sang Đất ở (vượt hạn mức)</th>
                       <th>Chuyển từ đất TMDV sang Đất ở (trong hạn mức)</th>
                       <th>Chuyển từ đất TMDV sang Đất ở (vượt hạn mức)</th>
                       <th>Chuyển từ đất SXKD sang TM-DV</th>
                   </tr>`
        var dong = 0;
        for (let row of data.gia3) {
          dong += 1;
          var sTencot = "div_b3_d" + dong;
          bang_gia3 +=
            `<tr>
                        <th>${row["pham_vi"]}</th>
                        <td><div id='${sTencot}c1'>${row["lua_dat_o_thm"]}</div></td>
                        <td><div id='${sTencot}c2'>${row["lua_dat_o_vhm"]}</div></td>
                        <td><div id='${sTencot}c3'>${row["lua_tmdv70"]}</div></td>
                        <td><div id='${sTencot}c4'>${row["lua_sxkd70"]}</div></td>
                    </tr>`;
          sTencot = "div_b4_d" + dong;
          bang_gia4 +=
            `<tr>
                        <th>${row["pham_vi"]}</th>
                        <td><div id='${sTencot}c1'>${row["cln_dat_o_thm"]}</div></td>
                        <td><div id='${sTencot}c2'>${row["cln_dat_o_vhm"]}</div></td>
                        <td><div id='${sTencot}c3'>${row["cln_tmdv70"]}</div></td>
                        <td><div id='${sTencot}c4'>${row["cln_sxkd70"]}</div></td>
                    </tr>`;
        }
        dong = 0;
        for (const row of data.gia4) {
          dong++;
          let sTencot = "div_b5_d" + dong;
          bang_gia5 +=
            `<tr>
              <th>${row["pham_vi"]}</th>
              <td><div id='${sTencot}c1'>${row["b3_cln_tmdv"]}</div></td>
              <td><div id='${sTencot}c2'>${row["b3_cln_sxkd"]}</div></td>
              <td><div id='${sTencot}c3'>${row["b3_sxkd_dat_o_thm"]}</div></td>
              <td><div id='${sTencot}c41'>${row["b3_sxkd_dat_o_vhm"]}</div></td>
              <td><div id='${sTencot}c5'>${row["b3_tmdv_dat_o_thm"]}</div></td>
              <td><div id='${sTencot}c6'>${row["b3_tmdv_dat_o_vhm"]}</div></td>
              <td><div id='${sTencot}c7'>${row["b3_sxkd_tmdv"]}</div></td>
            </tr>`
        }
        bang_gia3 += '</table>'
        bang_gia4 += '</table>'
        bang_gia5 += '</table>'
        $("#dv_tb3").html(bang_gia3);
        $("#dv_tb4").html(bang_gia4);
        $("#dv_tb5").html(bang_gia5);
        $("#txtduong").val(val);


      },

      error: function (xhr, status, error) {
        alert("An AJAX error occured: " + status + "\nError: " + error);
        //alert("An AJAX error occured: " + xhr.responseText );
      }
    });
    document.getElementById("export_doc").href = "tracuugiadat/doWord.php?id=" + val + "&vitri=" + vitri + "&sonam=" + nam;
    $("#divKetqua").modal("show");

  }
}

/*$('a[data-target=#divKetqua]').on('click', function (ev) {
    ev.preventDefault();
    var vitri = $('#cbo_vitri').val();
    if (vitri.length <= 0) {
        alert('Please select any one item in grid');
        $("#divKetqua").modal("hide");
    }
    else {
        alert('show');
        $("#divKetqua").modal("show");

    }
});*/



function tinh_gia_chuyen_LUA_CHN() {

  //Dat o trong han muc///////////////////////////////////////
  //gia LUA, CHN theo QD 66
  var b1_d1c1 = $("#div_b1_d1c1").html().toNum();
  var b1_d2c1 = $("#div_b1_d2c1").html().toNum();
  var b1_d3c1 = $("#div_b1_d3c1").html().toNum();
  var b1_d4c1 = $("#div_b1_d4c1").html().toNum();
  //gia CLN, NKH
  var b1_d1c2 = $("#div_b1_d1c2").html().toNum();
  var b1_d2c2 = $("#div_b1_d2c2").html().toNum();
  var b1_d3c2 = $("#div_b1_d3c2").html().toNum();
  var b1_d4c2 = $("#div_b1_d4c2").html().toNum();

  //gia DAT O theo QD 66
  var b1_d1c5 = $("#div_b1_d1c5").html().toNum();
  var b1_d2c5 = $("#div_b1_d2c5").html().toNum();
  var b1_d3c5 = $("#div_b1_d3c5").html().toNum();
  var b1_d4c5 = $("#div_b1_d4c5").html().toNum();

  //QD 67
  //LUA, CHN
  var b2_d1c1 = $("#div_b2_d1c1").html().toNum();
  var b2_d2c1 = $("#div_b2_d2c1").html().toNum();
  var b2_d3c1 = $("#div_b2_d3c1").html().toNum();
  var b2_d4c1 = $("#div_b2_d4c1").html().toNum();
  //CLN, NKH
  var b2_d1c2 = $("#div_b2_d1c2").html().toNum();
  var b2_d2c2 = $("#div_b2_d2c2").html().toNum();
  var b2_d3c2 = $("#div_b2_d3c2").html().toNum();
  var b2_d4c2 = $("#div_b2_d4c2").html().toNum();

  //Đất ở
  var b2_d1c5 = $("#div_b2_d1c5").html().toNum();
  var b2_d2c5 = $("#div_b2_d2c5").html().toNum();
  var b2_d3c5 = $("#div_b2_d3c5").html().toNum();
  var b2_d4c5 = $("#div_b2_d4c5").html().toNum();

  //TM-DV
  var b2_d1c6 = $("#div_b2_d1c6").html().toNum();
  var b2_d2c6 = $("#div_b2_d2c6").html().toNum();
  var b2_d3c6 = $("#div_b2_d3c6").html().toNum();
  var b2_d4c6 = $("#div_b2_d4c6").html().toNum();

  //SXKD
  var b2_d1c7 = $("#div_b2_d1c7").html().toNum();
  var b2_d2c7 = $("#div_b2_d2c7").html().toNum();
  var b2_d3c7 = $("#div_b2_d3c7").html().toNum();
  var b2_d4c7 = $("#div_b2_d4c7").html().toNum();

  ////////////////////////////////////////////////////

  //tinh chenh lech
  var b3_d1c1 = b1_d1c5 - b1_d1c1;
  var b3_d2c1 = b1_d2c5 - b1_d2c1;
  var b3_d3c1 = b1_d3c5 - b1_d3c1;
  var b3_d4c1 = b1_d4c5 - b1_d4c1;

  //Tinh gia chuyen doi
  //vitri 1
  $("#div_b3_d1c1").html(b3_d1c1.myformat(1));
  //vitri 2
  $("#div_b3_d2c1").html(b3_d2c1.myformat(1));
  //vitri 3
  $("#div_b3_d3c1").html(b3_d3c1.myformat(1));
  //vitri 4
  $("#div_b3_d4c1").html(b3_d4c1.myformat(1));
  ///////////////////////////////////////////////////////

  //dat o vuot han muc
  var b3_d1c2 = b2_d1c5 - b2_d1c1;
  var b3_d2c2 = b2_d2c5 - b2_d2c1;
  var b3_d3c2 = b2_d3c5 - b2_d3c1;
  var b3_d4c2 = b2_d4c5 - b2_d4c1;
  //vitri 1
  $("#div_b3_d1c2").html(b3_d1c2.myformat(1));
  //vitri 2
  $("#div_b3_d2c2").html(b3_d2c2.myformat(1));
  //vitri 3
  $("#div_b3_d3c2").html(b3_d3c2.myformat(1));
  //vitri 4
  $("#div_b3_d4c2").html(b3_d4c2.myformat(1));
  /////////////////////////////////////////////////////////////

  //tinh gia chuyen TM-DV
  var b3_d1c3 = b2_d1c6 - b1_d1c1;
  var b3_d2c3 = b2_d2c6 - b1_d2c1;
  var b3_d3c3 = b2_d3c6 - b1_d3c1;
  var b3_d4c3 = b2_d4c6 - b1_d4c1;

  //vitri 1
  $("#div_b3_d1c3").html(b3_d1c3.myformat(1));
  //vitri 2
  $("#div_b3_d2c3").html(b3_d2c3.myformat(1));
  //vitri 3
  $("#div_b3_d3c3").html(b3_d3c3.myformat(1));
  //vitri 4
  $("#div_b3_d4c3").html(b3_d4c3.myformat(1));
  ////////////////////////////////////////////////////////

  //tinh gia SXKD
  var b3_d1c4 = b2_d1c7 - b1_d1c1;
  var b3_d2c4 = b2_d2c7 - b1_d2c1;
  var b3_d3c4 = b2_d3c7 - b1_d3c1;
  var b3_d4c4 = b2_d4c7 - b1_d4c1;

  //vitri 1
  $("#div_b3_d1c4").html(b3_d1c4.myformat(1));
  //vitri 2
  $("#div_b3_d2c4").html(b3_d2c4.myformat(1));
  //vitri 3
  $("#div_b3_d3c4").html(b3_d3c4.myformat(1));
  //vitri 4
  $("#div_b3_d4c4").html(b3_d4c4.myformat(1));
  ////////////////////////////////////////

  //tinh gia Chuyển từ đất CLN, NKH =>
  //Đất ở (trong hạn mức)
  //vitri 1
  $("#div_b4_d1c1").html((b1_d1c5 - b1_d1c2).myformat(1));
  //vitri 2
  $("#div_b4_d2c1").html((b1_d2c5 - b1_d2c2).myformat(1));
  //vitri 3
  $("#div_b4_d3c1").html((b1_d3c5 - b1_d3c2).myformat(1));
  //vitri 4
  $("#div_b4_d4c1").html((b1_d4c5 - b1_d4c2).myformat(1));

  //Đất ở (vượt hạn mức)
  //vitri 1
  $("#div_b4_d1c2").html((b2_d1c5 - b2_d1c2).myformat(1));
  //vitri 2
  $("#div_b4_d2c2").html((b2_d2c5 - b2_d2c2).myformat(1));
  //vitri 3
  $("#div_b4_d3c2").html((b2_d3c5 - b2_d3c2).myformat(1));
  //vitri 4
  $("#div_b4_d4c2").html((b2_d4c5 - b2_d4c2).myformat(1));

  //TM-DV (70 năm)
  //vitri 1
  $("#div_b4_d1c3").html((b2_d1c6 - b2_d1c2).myformat(1));
  //vitri 2
  $("#div_b4_d2c3").html((b2_d2c6 - b2_d2c2).myformat(1));
  //vitri 3
  $("#div_b4_d3c3").html((b2_d3c6 - b2_d3c2).myformat(1));
  //vitri 4
  $("#div_b4_d4c3").html((b2_d4c6 - b2_d4c2).myformat(1));

  //SXKD (70 năm)
  //vitri 1
  $("#div_b4_d1c4").html((b2_d1c7 - b2_d1c2).myformat(1));
  //vitri 2
  $("#div_b4_d2c4").html((b2_d2c7 - b2_d2c2).myformat(1));
  //vitri 3
  $("#div_b4_d3c4").html((b2_d3c7 - b2_d3c2).myformat(1));
  //vitri 4
  $("#div_b4_d4c4").html((b2_d4c7 - b2_d4c2).myformat(1));

  ////////////////////////////////////////////////////////////
  //Bảng 5
  //Dat Phi nong nghiep => Dat

  chuyen_pnn_sang_dat_o();

  /*//Chuyển từ đất SXKD (50 năm) => Đất ở
  //vitri 1

  $("#div_b5_d1c1").html((b2_d1c5 - b2_d1c7*50/70).myformat(1));
  //vitri 2
  $("#div_b5_d2c1").html((b2_d2c5 - b2_d2c7*50/70).myformat(1));
  //vitri 3
  $("#div_b5_d3c1").html((b2_d3c5 - b2_d3c7*50/70).myformat(1));
  //vitri 4
  $("#div_b5_d4c1").html((b2_d4c5 - b2_d4c7*50/70).myformat(1));

  //Chuyển từ đất TMDV (50 năm) => Đất ở
  //vitri 1

  $("#div_b5_d1c2").html((b2_d1c5 - b2_d1c6*50/70).myformat(1));
  //vitri 2
  $("#div_b5_d2c2").html((b2_d2c5 - b2_d2c6*50/70).myformat(1));
  //vitri 3
  $("#div_b5_d3c2").html((b2_d3c5 - b2_d3c6*50/70).myformat(1));
  //vitri 4
  $("#div_b5_d4c2").html((b2_d4c5 - b2_d4c6*50/70).myformat(1));


  //Chuyển từ đất SXKD (50 năm) => TM-DV (50 năm)
  //vitri 1
  $("#div_b5_d1c3").html(((b2_d1c6*50/70) - (b2_d1c7*50/70)).myformat(1));
  //vitri 2
  $("#div_b5_d2c3").html(((b2_d2c6*50/70) - (b2_d2c7*50/70)).myformat(1));
  //vitri 3
  $("#div_b5_d3c3").html(((b2_d3c6*50/70) - (b2_d3c7*50/70)).myformat(1));
  //vitri 4
  $("#div_b5_d4c3").html(((b2_d4c6*50/70) - (b2_d4c7*50/70)).myformat(1));*/
}


function chuyen_pnn_sang_dat_o() {
  //Bảng 5


  //Dat Phi nong nghiep => Dat o

  //CLN, NKH
  var b2_d1c2 = $("#div_b2_d1c2").html().toNum();
  var b2_d2c2 = $("#div_b2_d2c2").html().toNum();
  var b2_d3c2 = $("#div_b2_d3c2").html().toNum();
  var b2_d4c2 = $("#div_b2_d4c2").html().toNum();
  //Đất ở
  var b2_d1c5 = $("#div_b2_d1c5").html().toNum();
  var b2_d2c5 = $("#div_b2_d2c5").html().toNum();
  var b2_d3c5 = $("#div_b2_d3c5").html().toNum();
  var b2_d4c5 = $("#div_b2_d4c5").html().toNum();

  //TM-DV
  var b2_d1c6 = $("#div_b2_d1c6").html().toNum();
  var b2_d2c6 = $("#div_b2_d2c6").html().toNum();
  var b2_d3c6 = $("#div_b2_d3c6").html().toNum();
  var b2_d4c6 = $("#div_b2_d4c6").html().toNum();

  //SXKD
  var b2_d1c7 = $("#div_b2_d1c7").html().toNum();
  var b2_d2c7 = $("#div_b2_d2c7").html().toNum();
  var b2_d3c7 = $("#div_b2_d3c7").html().toNum();
  var b2_d4c7 = $("#div_b2_d4c7").html().toNum();

  var nam = $("#txtNam").val();



  //TM-DV (70 năm)
  //vitri 1
  $("#div_b5_d1c4").html((b2_d1c6 * nam / 70 - b2_d1c2).myformat(1));
  //vitri 2
  $("#div_b5_d2c4").html((b2_d2c6 * nam / 70 - b2_d2c2).myformat(1));
  //vitri 3
  $("#div_b5_d3c4").html((b2_d3c6 * nam / 70 - b2_d3c2).myformat(1));
  //vitri 4
  $("#div_b5_d4c4").html((b2_d4c6 * nam / 70 - b2_d4c2).myformat(1));

  //SXKD (70 năm)
  //vitri 1
  $("#div_b5_d1c5").html((b2_d1c7 * nam / 70 - b2_d1c2).myformat(1));
  //vitri 2
  $("#div_b5_d2c5").html((b2_d2c7 * nam / 70 - b2_d2c2).myformat(1));
  //vitri 3
  $("#div_b5_d3c5").html((b2_d3c7 * nam / 70 - b2_d3c2).myformat(1));
  //vitri 4
  $("#div_b5_d4c5").html((b2_d4c7 * nam / 70 - b2_d4c2).myformat(1));

  //Chuyển từ đất SXKD (50 năm) => Đất ở
  //vitri 1

  $("#div_b5_d1c1").html((b2_d1c5 - b2_d1c7 * nam / 70).myformat(1));
  //vitri 2
  $("#div_b5_d2c1").html((b2_d2c5 - b2_d2c7 * nam / 70).myformat(1));
  //vitri 3
  $("#div_b5_d3c1").html((b2_d3c5 - b2_d3c7 * nam / 70).myformat(1));
  //vitri 4
  $("#div_b5_d4c1").html((b2_d4c5 - b2_d4c7 * nam / 70).myformat(1));

  //Chuyển từ đất TMDV (50 năm) => Đất ở
  //vitri 1

  $("#div_b5_d1c2").html((b2_d1c5 - b2_d1c6 * nam / 70).myformat(1));
  //vitri 2
  $("#div_b5_d2c2").html((b2_d2c5 - b2_d2c6 * nam / 70).myformat(1));
  //vitri 3
  $("#div_b5_d3c2").html((b2_d3c5 - b2_d3c6 * nam / 70).myformat(1));
  //vitri 4
  $("#div_b5_d4c2").html((b2_d4c5 - b2_d4c6 * nam / 70).myformat(1));


  //Chuyển từ đất SXKD (50 năm) => TM-DV (50 năm)
  //vitri 1
  $("#div_b5_d1c3").html(((b2_d1c6 * nam / 70) - (b2_d1c7 * nam / 70)).myformat(1));
  //vitri 2
  $("#div_b5_d2c3").html(((b2_d2c6 * nam / 70) - (b2_d2c7 * nam / 70)).myformat(1));
  //vitri 3
  $("#div_b5_d3c3").html(((b2_d3c6 * nam / 70) - (b2_d3c7 * nam / 70)).myformat(1));
  //vitri 4
  $("#div_b5_d4c3").html(((b2_d4c6 * nam / 70) - (b2_d4c7 * nam / 70)).myformat(1));

}

function chuyen_pnn_sang_dat_o2() {
  //Bảng 5

  var vitri = $('#cbo_vitri').val();
  var nam = $("#txtNam").val();
  var duong = $("#txtduong").val();
  $("#dv_tb5").html("");

  document.getElementById("export_doc").href = "tracuugiadat/doWord.php?id=" + duong + "&vitri=" + vitri + "&sonam=" + nam;

  $.ajax({
    type: "POST",
    url: "./tracuu/tinh_bang5",
    data: {
      id: duong,
      vitri: vitri,
      sonam: nam
    },
    dataType: 'json',
    success: function (data) {
      var bang_gia5 =
        `<table class='table table-bordered ' width="100%" id = 'tb_ketqua'>
               <tr>
                   <th rowspan="2" width="200px">Phạm vi chuyển mục đích<br>(tính từ HLATĐB vào)</th>
                   <th colspan="7" style="text-align: right">
           
                       <div class="divNam">
                           Số năm sử dụng đất SXKD, TM-DV:
                           <input type="number" min="0" value="50" style="width: 50px;text-align: center"   id="txtNam">
                           <input type="text" value="" style="width: 50px;text-align: center"   id="txtduong" HIDDEN>
                           <input type="submit" value="Tính" id="btTinh" onclick="chuyen_pnn_sang_dat_o2();">
                       </div>
           
                   </th>
               </tr>
               <tr>
                   <th>Chuyển từ đất CLN, NKH sang TM-DV </th>
                   <th>Chuyển từ đất CLN, NKH sang SXKD </th>
                   <th>Chuyển từ đất SXKD sang Đất ở (trong hạn mức)</th>
                   <th>Chuyển từ đất SXKD sang Đất ở (vượt hạn mức)</th>
                   <th>Chuyển từ đất TMDV sang Đất ở (trong hạn mức)</th>
                   <th>Chuyển từ đất TMDV sang Đất ở (vượt hạn mức)</th>
                   <th>Chuyển từ đất SXKD sang TM-DV</th>
               </tr>`
      var dong = 0;
      for (const row of data) {
        dong++;
        let sTencot = "div_b5_d" + dong;
        bang_gia5 +=
          `<tr>
          <th>${row["pham_vi"]}</th>
          <td><div id='${sTencot}c1'>${row["b3_cln_tmdv"]}</div></td>
          <td><div id='${sTencot}c2'>${row["b3_cln_sxkd"]}</div></td>
          <td><div id='${sTencot}c3'>${row["b3_sxkd_dat_o_thm"]}</div></td>
          <td><div id='${sTencot}c41'>${row["b3_sxkd_dat_o_vhm"]}</div></td>
          <td><div id='${sTencot}c5'>${row["b3_tmdv_dat_o_thm"]}</div></td>
          <td><div id='${sTencot}c6'>${row["b3_tmdv_dat_o_vhm"]}</div></td>
          <td><div id='${sTencot}c7'>${row["b3_sxkd_tmdv"]}</div></td>
        </tr>`
      }
      bang_gia5 += '</table>'
      $("#dv_tb5").html(bang_gia5);
      $("#txtNam").val(nam);
      $("#txtduong").val(duong);

    },

    error: function (xhr, status, error) {
      alert("An AJAX error occured: " + status + "\nError: " + error);
      //alert("An AJAX error occured: " + xhr.responseText );
    }
  });
}

/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 *
 * 12345678.9.format(2, 3, '.', ',');  // "12.345.678,90"
 123456.789.format(4, 4, ' ', ':');  // "12 3456:7890"
 12345678.9.format(0, 3, '-');       // "12-345-679"

 */
Number.prototype.format = function (n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}
Number.prototype.format = function (n) {
  //var n = 1;
  var x = 3;
  var s = ',';
  var c = '.';

  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

Number.prototype.myformat = function (dec) {
  var x = 3;
  var s = ',';
  var c = '.';
  var n = dec;

  var num = this.toFixed(Math.max(0, ~~n));

  if ((num % 1) > 0) {
    n = dec;
  } else {
    n = 0;
  }
  num = this.toFixed(Math.max(0, ~~n));
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

String.prototype.toNum = function () {
  var strNum = this.replace(',', '');
  return strNum;
}



function check() {
  $("#divKetqua").modal("show");
}


function get_data_to_wordfile(id, vitri, nam) {
  $str = "";
  $.ajax({
    type: "POST",
    url: "./tracuugiadat/f_common.php?act=xem_chitiet",
    data: {
      id: id,
      vitri: vitri,
      sonam: nam
    },
    dataType: 'json',
    success: function (data) {
      $str = data.bang_gia;
    },

    error: function (xhr, status, error) {
      alert("An AJAX error occured: " + status + "\nError: " + error);
      //alert("An AJAX error occured: " + xhr.responseText );
    }
  });

  return $str;
}

function focusmap(evt) {
  Loader.show();
  const it = $(evt),
    tenduong = it.attr('data-tenduong'),
    tu = it.attr('data-tu'),
    den = it.attr('data-den');

  var iframe = document.getElementById("mapiframe");
  var iframeWindow = (iframe.contentWindow || iframe.contentDocument);
  iframeWindow.Map.zoom(tenduong, tu, den).then((data) => {
    $('#div-minimap').modal('toggle');
    Loader.hide();
  }).catch(() => {
    alert('Không tìm được vị trí trên bản đồ');
    Loader.hide();
  })


}