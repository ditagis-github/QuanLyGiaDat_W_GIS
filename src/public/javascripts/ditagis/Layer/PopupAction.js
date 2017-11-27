define([
  "ditagis/toolview/bootstrap"

], function (bootstrap) {
  class Popup {
    constructor(options) {
      Number.prototype.format = function () {
        return this.toFixed(6).replace(/\.?0*$/,'')
      }
    }
    chuyeDoiMucDich(props) {
      let notify = $.notify({
        title: `<strong>Chuyển đổi mục đích sử dụng đất</strong>`,
        message: 'Đang tải dữ liệu...'
      }, {
        showProgressbar: true,
        delay: 20000
      })
      // let dataSource = null;
      $.post('/map/thuadat/mdsd', {
          soTo: props.SoHieuToBanDo,
          soThua: props.SoHieuThua,
          phuongXa: props.MaPhuongXa,
          quanHuyen: props.MaQuanHuyen
        })
        .done((datas) => {
          //combox muc dich chuyen
          let cbMDC = document.createElement('select');
          cbMDC.classList.add('form-control');
          let defaultComboValue = document.createElement('option');
          defaultComboValue.value = -1;
          defaultComboValue.innerText = 'Chọn mục đích...';
          cbMDC.appendChild(defaultComboValue);

          for (const data of datas) {
            let option = document.createElement('option');
            option.value = data['kyHieuMucDich'];
            option.setAttribute('data-nhomDat', data['nhomDat']);
            option.setAttribute('data-nhomDonGia', data['nhomDonGia']);
            option.setAttribute('data-donGia', data['donGia']);
            option.innerText = data['tenDayDu'];
            cbMDC.appendChild(option);
          }

          let body = document.createElement('div');
          let columns = ['Mục đích sử đụng đất hiện tại', 'Đơn giá', 'Vị trí', 'Diện tích', 'Mục đích sử dụng chuyển', 'Diện tích', 'Số năm sử dụng']
          let table = bootstrap.table(columns);
          body.appendChild(table);
          let tbody = table.getElementsByTagName('tbody')[0];
          let dataSource = [];
          notify.update({}, {
            'progress': 50
          });
          $.post('/map/thuadat/chuyenmucdich', {
              soTo: props.SoHieuToBanDo,
              soThua: props.SoHieuThua,
              phuongXa: props.MaPhuongXa,
              quanHuyen: props.MaQuanHuyen
            })
            .done((datas) => {
              if (!datas) {
                notify.update({
                  'type': 'info',
                  'message': 'Không đủ dữ liệu để truy vấn',
                  'progress': 90
                });
                return;
              }

              for (let item of datas) {
                let tr = document.createElement('tr');
                for (let key in item) {
                  let value = item[key];
                  let td = document.createElement('td');
                  if (value)
                    td.innerText = !isNaN(value) ? value.format() : value;
                  tr.appendChild(td);
                }


                //dien tich chuyen
                let tdArea = document.createElement('td');
                let inputArea = document.createElement('input');
                inputArea.type = 'number';
                inputArea.placeholder = '0';
                inputArea.value = item['dienTich'];
                inputArea.classList.add('form-control');
                tdArea.appendChild(inputArea);
                //dien tich chuyen
                let tdYear = document.createElement('td');
                let inputYear = document.createElement('input');
                inputYear.type = 'number';
                inputYear.placeholder = '0';
                inputYear.classList.add('form-control');
                tdYear.appendChild(inputYear);

                //muc dich chuyen
                let tdMDC = document.createElement('td');
                let tdMDCChild = cbMDC.cloneNode(true);
                tdMDCChild.addEventListener('change', () => {
                  let mdcSelected = tdMDCChild.options[tdMDCChild.selectedIndex],
                    nhomDat = mdcSelected.getAttribute('data-nhomDat');
                  inputYear.readOnly = tdMDCChild.value === 'ODT' || tdMDCChild.value == "ONT" || nhomDat == "NN"
                })
                tdMDC.appendChild(tdMDCChild);
                dataSource.push({
                  props: item,
                  mdc: tdMDCChild,
                  area: inputArea,
                  year: inputYear
                })

                tr.appendChild(tdMDC);
                tr.appendChild(tdArea);
                tr.appendChild(tdYear);
                tbody.appendChild(tr);
              }
              notify.update({
                'type': 'success',
                'message': 'Truy vấn thành công',
                'progress': 90
              });
            }).fail(err => {
              notify.update({
                'type': 'danger',
                'message': 'Truy vấn thất bại',
                'progress': 90
              });
            })
          let footer = document.createElement('div');
          let label = document.createElement('label');
          label.classList.add('cmd-container');
          label.innerText = 'Phí chuyển đổi: ';
          let price = document.createElement('span');
          price.classList.add('price');
          label.appendChild(price);
          let btnSubmit = document.createElement('button');
          btnSubmit.classList.add('btn', 'btn-primary');
          btnSubmit.innerText = "Chấp nhận";
          btnSubmit.addEventListener('click', () => {
            let total = 0;
            for (const item of dataSource) {
              item.area.value = item.area.value || 0;
              item.year.value = item.year.value || 0;
              if (item.mdc.value !== -1 && item.area.value && parseFloat(item.area.value) > 0 && (parseInt(item.year.value) > 0 || item.year.readOnly)) {
                let area = parseFloat(item.area.value);
                let giaHienTai = area * item.props.donGia,
                  mdcSelected = item.mdc.options[item.mdc.selectedIndex],
                  mdsd = item.mdc.value,
                  donGiaChuyen = parseFloat(mdcSelected.getAttribute('data-donGia'));
                let giaChuyen;
                if (item.year.readOnly) {
                  giaChuyen = area * donGiaChuyen;
                } else {
                  let year = parseInt(item.year.value);
                  giaChuyen = (area * donGiaChuyen * year) / 70.0;
                }

                if (giaChuyen >= giaHienTai) {
                  total += giaChuyen - giaHienTai;
                }
              }
            }
            price.innerText = total.format() + ' VNĐ';
          })
          let btnClose = document.createElement('button');
          btnClose.type = 'button';
          btnClose.classList.add('btn', 'btn-default');
          btnClose.setAttribute('data-dismiss', 'modal');
          btnClose.innerText = 'Đóng';
          footer.appendChild(label);
          footer.appendChild(btnSubmit);
          footer.appendChild(btnClose);
          let modal = bootstrap.modal('modal-thuadat-chuyendoimucdich', `Chuyển mục đích sử dụng | Số tờ: ${props.SoHieuToBanDo} | Số thửa: ${props.SoHieuThua}`, body, footer, {
            dlgLarge: true
          });
          modal.modal();
        }).fail(err => {
          notify.update({
            'type': 'danger',
            'message': 'Truy vấn thất bại',
            'progress': 90
          });
        })
    }
    xemGiaDat(props) {
      let that = this;
      let total = 0;
      let body = document.createElement('div');
      let columns = ['Mục đích sử đụng đất', 'Đơn giá', 'Vị trí', 'Diện tích', 'Thành tiền']
      let table = bootstrap.table(columns);
      body.appendChild(table);
      let tbody = table.getElementsByTagName('tbody')[0];
      let footer = document.createElement('div');
      let label = document.createElement('label');
      label.classList.add('cmd-container');
      label.innerText = 'Tổng tiền: ';
      let price = document.createElement('span');
      price.classList.add('price');

      label.appendChild(price);
      let btnClose = document.createElement('button');
      btnClose.type = 'button';
      btnClose.classList.add('btn', 'btn-default');
      btnClose.setAttribute('data-dismiss', 'modal');
      btnClose.innerText = 'Đóng';
      footer.appendChild(label);
      footer.appendChild(btnClose);
      let modal = bootstrap.modal('modal-giadat', `Xem giá đất | Số tờ: ${props.SoHieuToBanDo} | Số thửa: ${props.SoHieuThua}`, body, footer, {
        dlgLarge: true
      });
      let notify = $.notify({
        title: `<strong>Xem giá đất</strong>`,
        message: 'Đang tải dữ liệu...'
      }, {
        showProgressbar: true,
        delay: 20000
      })
      // let dataSource = null;
      $.post('/map/thuadat/xemgiadat', {
          soTo: props.SoHieuToBanDo,
          soThua: props.SoHieuThua,
          phuongXa: props.MaPhuongXa,
          quanHuyen: props.MaQuanHuyen
        })
        .done((datas) => {
          if (!datas) return;
          for (let item of datas.chiTiet) {
            let tr = document.createElement('tr');
            for (let key in item) {
              let value = item[key];
              let td = document.createElement('td');
              if (value != null || value != undefined)
                td.innerText = !isNaN(value) ? value.format() : value;
              tr.appendChild(td);
            }
            tbody.appendChild(tr);
          }
          price.innerText = datas.tongTien.format() + ' VNĐ';
          notify.update({
            'type': 'success',
            'message': 'Truy vấn thành công',
            'progress': 90
          });
        }).fail(err => {
          notify.update({
            'type': 'danger',
            'message': 'Truy vấn thất bại',
            'progress': 90
          });
        })

      modal.modal();
    }
    cungCapGiaDat(props) {
      var ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
      var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

      //1. Hàm đọc số có ba chữ số;
      function DocSo3ChuSo(baso) {
        var tram;
        var chuc;
        var donvi;
        var KetQua = "";
        tram = parseInt(baso / 100);
        chuc = parseInt((baso % 100) / 10);
        donvi = baso % 10;
        if (tram == 0 && chuc == 0 && donvi == 0) return "";
        if (tram != 0) {
          KetQua += ChuSo[tram] + " trăm ";
          if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
        }
        if ((chuc != 0) && (chuc != 1)) {
          KetQua += ChuSo[chuc] + " mươi";
          if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
        }
        if (chuc == 1) KetQua += " mười ";
        switch (donvi) {
          case 1:
            if ((chuc != 0) && (chuc != 1)) {
              KetQua += " mốt ";
            } else {
              KetQua += ChuSo[donvi];
            }
            break;
          case 5:
            if (chuc == 0) {
              KetQua += ChuSo[donvi];
            } else {
              KetQua += " lăm ";
            }
            break;
          default:
            if (donvi != 0) {
              KetQua += ChuSo[donvi];
            }
            break;
        }
        return KetQua;
      }

      //2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)

      function DocTienBangChu(SoTien) {
        var lan = 0;
        var i = 0;
        var so = 0;
        var KetQua = "";
        var tmp = "";
        var ViTri = new Array();
        if (SoTien < 0) return "Số tiền âm !";
        if (SoTien == 0) return "Không đồng !";
        if (SoTien > 0) {
          so = SoTien;
        } else {
          so = -SoTien;
        }
        if (SoTien > 8999999999999999) {
          //SoTien = 0;
          return "Số quá lớn!";
        }
        ViTri[5] = Math.floor(so / 1000000000000000);
        if (isNaN(ViTri[5]))
          ViTri[5] = "0";
        so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
        ViTri[4] = Math.floor(so / 1000000000000);
        if (isNaN(ViTri[4]))
          ViTri[4] = "0";
        so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
        ViTri[3] = Math.floor(so / 1000000000);
        if (isNaN(ViTri[3]))
          ViTri[3] = "0";
        so = so - parseFloat(ViTri[3].toString()) * 1000000000;
        ViTri[2] = parseInt(so / 1000000);
        if (isNaN(ViTri[2]))
          ViTri[2] = "0";
        ViTri[1] = parseInt((so % 1000000) / 1000);
        if (isNaN(ViTri[1]))
          ViTri[1] = "0";
        ViTri[0] = parseInt(so % 1000);
        if (isNaN(ViTri[0]))
          ViTri[0] = "0";
        if (ViTri[5] > 0) {
          lan = 5;
        } else if (ViTri[4] > 0) {
          lan = 4;
        } else if (ViTri[3] > 0) {
          lan = 3;
        } else if (ViTri[2] > 0) {
          lan = 2;
        } else if (ViTri[1] > 0) {
          lan = 1;
        } else {
          lan = 0;
        }
        for (i = lan; i >= 0; i--) {
          tmp = DocSo3ChuSo(ViTri[i]);
          KetQua += tmp;
          if (ViTri[i] > 0) KetQua += Tien[i];
          if ((i > 0) && (tmp.length > 0)) KetQua += ','; //&& (!string.IsNullOrEmpty(tmp))
        }
        if (KetQua.substring(KetQua.length - 1) == ',') {
          KetQua = KetQua.substring(0, KetQua.length - 1);
        }
        KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
        return KetQua + ' đồng'; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
      }
      let modal, body, footer, input, tienSangChu, btnSubmit, btnClose;
      body = document.createElement('div');
      input = document.createElement('input');
      input.type = 'number';
      input.classList.add('form-control');
      input.addEventListener('keyup', function () {
        if (input.value.length > 0) {
          let price = parseFloat(input.value.replace(',', ''));
          // input.value = price.format();
          tienSangChu.innerText = DocTienBangChu(price);
        }

      })
      body.appendChild(input);
      footer = document.createElement('div');
      tienSangChu = document.createElement('p');
      tienSangChu.classList.add('cmd-container');
      btnSubmit = document.createElement('button');
      btnSubmit.type = 'button';
      btnSubmit.classList.add('btn', 'btn-primary');
      btnSubmit.innerText = 'Cung cấp';
      btnSubmit.addEventListener('click', function () {
        let notify = $.notify({
          title: `<strong>Cung cấp giá đất</strong>`,
          message: 'Hệ thống đang ghi nhận...'
        }, {
          showProgressbar: true,
          delay: 20000
        })
        if (input.value.length > 0) {
          $.post('thuadat/cungcapgiadat', {
            OBJECTID: props['OBJECTID'],
            gia: input.value
          }).done(function () {
            notify.update({
              'type': 'success',
              'message': 'Cung cấp giá đất thành công, <strong>xin CẢM ƠN!</strong>',
              'progress': 90
            });
            modal.modal('toggle');
          }).fail(function () {
            notify.update({
              'type': 'danger',
              'message': 'Có lỗi xảy ra, vui lòng thử lại',
              'progress': 90
            });
          })
        } else {
          notify.update({
            'type': 'danger',
            'message': 'Vui lòng nhập giá đất',
            'progress': 90
          });
        }
      });
      btnClose = document.createElement('button');
      btnClose.type = 'button';
      btnClose.classList.add('btn', 'btn-default');
      btnClose.setAttribute('data-dismiss', 'modal');
      btnClose.innerText = 'Đóng';

      footer.appendChild(tienSangChu);
      footer.appendChild(btnSubmit);
      footer.appendChild(btnClose);

      modal = bootstrap.modal('modal-cungcapgiadat', `Cung cấp giá đất | Số tờ: ${props.SoHieuToBanDo} | Số thửa: ${props.SoHieuThua}`, body, footer, {
        dlgLarge: false
      });
      modal.modal();
    }

  }
  return function (options) {
    return new Popup(options);
  };
});