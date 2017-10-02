define([
  "ditagis/toolview/bootstrap"

], function (bootstrap) {
  class Popup {
    constructor(options) {
    }
    chuyeDoiMucDich(props) {
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
          $.post('/map/thuadat/chitiet', {
            soTo: props.SoHieuToBanDo, soThua: props.SoHieuThua, phuongXa: props.MaPhuongXa, quanHuyen: props.MaQuanHuyen
          })
            .done((datas) => {
              if (!datas) return;

              for (let item of datas) {
                let tr = document.createElement('tr');
                for (let key in item) {
                  if (key === 'nhomDat') continue;
                  let value = item[key];
                  let td = document.createElement('td');
                  td.innerText = value;
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
            })
          let footer = document.createElement('div');
          let label = document.createElement('label');
          label.classList.add('cmd-container');
          label.innerText = 'Phí chuyển đổi: ';
          this.price = document.createElement('span');
          this.price.classList.add('price');
          label.appendChild(this.price);
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
            this.price.innerText = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' VNĐ';
          })
          let btnClose = document.createElement('button');
          btnClose.type = 'button';
          btnClose.classList.add('btn', 'btn-default');
          btnClose.setAttribute('data-dismiss', 'modal');
          btnClose.innerText = 'Đóng';
          footer.appendChild(label);
          footer.appendChild(btnSubmit);
          footer.appendChild(btnClose);
          let modal = bootstrap.modal('modal-giadat', 'Chuyển mục đích sử dụng', body, footer, { dlgLarge: true });
          modal.modal();
        })
    }
  }
  return function (options) {
    return new Popup(options);
  };
});
