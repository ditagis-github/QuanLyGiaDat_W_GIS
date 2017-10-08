define([
  "ditagis/toolview/bootstrap"

], function (bootstrap) {
  class Popup {
    constructor(options) {
      Number.prototype.format = function() {
        var re = '\\d(?=(\\d{' + 3 + '})+' +  '$' + ')';
        return this.toFixed(0).replace(new RegExp(re, 'g'), '$&,');
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
      $.post('/map/thuadat/mdsd', { soTo: props.SoHieuToBanDo, soThua: props.SoHieuThua, phuongXa: props.MaPhuongXa, quanHuyen: props.MaQuanHuyen })
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
          let columns = ['Mục đích sử đụng đất hiện tại', 'Đơn giá', 'Diện tích', 'Mục đích sử dụng chuyển', 'Diện tích', 'Số năm sử dụng']
          let table = bootstrap.table(columns);
          body.appendChild(table);
          let tbody = table.getElementsByTagName('tbody')[0];
          let dataSource = [];
          notify.update({}, { 'progress': 50 });
          $.post('/map/thuadat/chitiet', {
            soTo: props.SoHieuToBanDo, soThua: props.SoHieuThua, phuongXa: props.MaPhuongXa, quanHuyen: props.MaQuanHuyen
          })
            .done((datas) => {
              if (!datas) return;

              for (let item of datas) {
                let tr = document.createElement('tr');
                for (let key in item) {
                  let value = item[key];
                  let td = document.createElement('td');
                  if(value)
                  td.innerText = !isNaN(value)?value.format():value;
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
                dataSource.push({ props: item, mdc: tdMDCChild, area: inputArea, year: inputYear })

                tr.appendChild(tdMDC);
                tr.appendChild(tdArea);
                tr.appendChild(tdYear);
                tbody.appendChild(tr);
              }
              notify.update({ 'type': 'success', 'message': 'Truy vấn thành công', 'progress': 90 });
            }).fail(err => {
              notify.update({ 'type': 'danger', 'message': 'Truy vấn thất bại', 'progress': 90 });
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
            price.innerText = total.format() +' VNĐ';
          })
          let btnClose = document.createElement('button');
          btnClose.type = 'button';
          btnClose.classList.add('btn', 'btn-default');
          btnClose.setAttribute('data-dismiss', 'modal');
          btnClose.innerText = 'Đóng';
          footer.appendChild(label);
          footer.appendChild(btnSubmit);
          footer.appendChild(btnClose);
          let modal = bootstrap.modal('modal-thuadat-chuyendoimucdich', `Chuyển mục đích sử dụng | Số tờ: ${props.SoHieuToBanDo} | Số thửa: ${props.SoHieuThua}`, body, footer, { dlgLarge: true });
          modal.modal();
        }).fail(err => {
          notify.update({ 'type': 'danger', 'message': 'Truy vấn thất bại', 'progress': 90 });
        })
    }
    xemGiaDat(props) {
      let that = this;
      let total = 0;
      let body = document.createElement('div');
      let columns = ['Mục đích sử đụng đất', 'Đơn giá', 'Diện tích', 'Thành tiền']
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
      let modal = bootstrap.modal('modal-giadat', `Xem giá đất | Số tờ: ${props.SoHieuToBanDo} | Số thửa: ${props.SoHieuThua}`, body, footer, { dlgLarge: true });
      let notify = $.notify({
        title: `<strong>Xem giá đất</strong>`,
        message: 'Đang tải dữ liệu...'
      }, {
          showProgressbar: true,
          delay: 20000
        })
      // let dataSource = null;
      $.post('/map/thuadat/chitiet', {
        soTo: props.SoHieuToBanDo, soThua: props.SoHieuThua, phuongXa: props.MaPhuongXa, quanHuyen: props.MaQuanHuyen
      })
        .done((datas) => {
          if (!datas) return;
          for (let item of datas) {
            let tr = document.createElement('tr');
            for (let key in item) {
              let value = item[key];
              let td = document.createElement('td');
              if(value)
              td.innerText = !isNaN(value)?value.format():value;
              tr.appendChild(td);
            }

            //muc dich chuyen
            let donGia = item['donGia'] || 0,
              dienTich = item['dienTich'] || 0,
              thanhTien = 0;
            donGia = parseFloat(donGia);
            dienTich = parseFloat(dienTich);
            thanhTien = donGia * dienTich;
            total+=thanhTien;

            let tdThanhTien = document.createElement('td');
            tdThanhTien.innerText = thanhTien.format() +' VNĐ';
            tr.appendChild(tdThanhTien);
            tbody.appendChild(tr);
          }
          price.innerText = total.format() +' VNĐ';
          notify.update({ 'type': 'success', 'message': 'Truy vấn thành công', 'progress': 90 });
        }).fail(err => {
          notify.update({ 'type': 'danger', 'message': 'Truy vấn thất bại', 'progress': 90 });
        })
  
      modal.modal();
    }
    
  }
  return function (options) {
    return new Popup(options);
  };
});
