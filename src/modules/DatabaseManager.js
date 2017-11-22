const config = {
  user: 'sa',
  password: '268@lTk',
  server: '112.78.4.175',
  database: 'QUANLYGIADAT',
  pool:{
    min:1,max:15
  }
}
let sql = require('mssql');
class DatabaseManager {
  constructor(params) {
  }
  static set request(request) {
    this._request = request
  }
  static get request() {
    return this._request;
  }
  static create(params) {
    if (!this._instance)
      this._instance = new DatabaseManager(params);
    return this._instance;
  }
  connect() {
    console.log('connect database');
    return new Promise((resolve, reject) => {
    if (DatabaseManager.request) {
      resolve(DatabaseManager.request);
    } else {
      sql.connect(config).then(function () {
        DatabaseManager.request = new sql.Request();
        resolve(DatabaseManager.request);
      })
    }
    });
  }
  query(sql, request) {
    return new Promise((resolve, reject) => {
      if (request) {
        request.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.recordset)
          }
        })
      } else {
        this.connect().then((request) => {
          request.query(sql, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result)
            }
            ////this.close();
          })
        }).catch(err => {
          console.log(err);
          reject(err);
          ////this.close();
        });
      }
    });
  } 
  select(sql, request) {
    return new Promise((resolve, reject) => {
      if (request) {
        request.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result.recordset)
          }
        })
      } else {
        this.connect().then((request) => {
          request.query(sql, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result.recordset)
            }
            ////this.close();
          })
        }).catch(err => {
          console.log(err);
          reject(err);
          ////this.close();
        });
      }
    });
  }
  close(){
    sql.close();
  }
  findThuaDat(info) {
    console.log(`
        ------------------------------------------------
        Tim kiem thua dat voi thong tin ` + JSON.stringify(info));
    var where = ['1=1'];
    if (info.soto) {
      where.push(`SoHieuToBanDo = '${info.soto}'`);
    }
    if (info.sothua) {
      where.push(`SoHieuThua = '${info.sothua}'`)
    }
    if (info.huyen) {
      where.push(`MaQuanHuyen = '${info.huyen}'`);
    }
    if (info.phuongxa) {
      where.push(`MaPhuongXa = '${info.phuongxa}'`);
    }
    where = where.join(' and ');
    let sql = `select TOP 100 OBJECTID,ChuSoHuu,TenQuanHuyen,TenPhuongXa,DienTich,SoHieuToBanDo,SoHieuThua from THUADAT where ${where} order by tenquanhuyen,tenphuongxa,chusohuu`
    return this.select(sql);
  }
  findStreet(text) {
    console.log('Tìm kiếm đường ' + text);
    let sql = `SELECT TOP 10 * FROM (
            SELECT OBJECTID,tu,den,TenConDuong,
            ROW_NUMBER() OVER (PARTITION BY TenConDuong ORDER BY OBJECTID) AS RowNumber
            from timduong 
            where contains(tenconduong,'"${text}"')
        ) a WHERE a.RowNumber = 1 order by a.TenConDuong`;
    return this.select(sql);
  }

  loaiMucDichSD(params) {
    return new Promise((resolve, reject) => {
      let soTo = params.soTo, soThua = params.soThua, quanHuyen = params.quanHuyen, phuongxa = params.phuongXa;

      let proms = [];
      this.connect().then(request => {
        let sql = `Select kyHieuMucDich,tenDayDu,nhomDonGia,nhomDat from LoaiMucDichSuDung where nhomDonGia is not null and nhomDat is not null and (nhomDat = 'NN' OR nhomDat = 'PNN') order by tenDayDu`
        this.select(sql, request).then(res => {
          let nn = res
            .filter(f => { return f['nhomDat'] === 'NN'; })
            .map(m => { return m['nhomDonGia']; })
            .filter((f, index, self) => { return self.indexOf(f) === index; }).join(',')
          let pnn = res
            .filter((f) => { return f['nhomDat'] === 'PNN'; })
            .map(m => { return m['nhomDonGia']; })
            .filter((f, index, self) => { return self.indexOf(f) === index; }).join(',');
          if (nn && nn.length > 0) {
            sql = `select ${nn} from PHANVT_NN_GIA WHERE SoHieuThua = ${soThua} and soHieuToBanDo = ${soTo} and MaQuanHuyen = ${quanHuyen} and MaPhuongXa = ${phuongxa}`;
            proms.push(this.select(sql, request));
          }
          if (pnn && pnn.length > 0) {
            sql = `select ${pnn} from PHANVT_PNN_GIA WHERE SoHieuThua = ${soThua} and soHieuToBanDo = ${soTo} and MaQuanHuyen = ${quanHuyen} and MaPhuongXa = ${phuongxa}`;
            proms.push(this.select(sql, request));
          }
          Promise.all(proms).then(donGias => {
            let results = [];
            for (var i = 0; i < res.length; i++) {
              var element = res[i];
              let indexDonGia = element['nhomDat'] === 'NN' ? 0 : 1;
              let donGia = donGias[indexDonGia][0][element['nhomDonGia']]
              results.push({
                tenDayDu: element['tenDayDu'],
                donGia: donGia,
                kyHieuMucDich: element['kyHieuMucDich'],
                nhomDonGia: element['nhomDonGia'],
                nhomDat: element['nhomDat']
              })
            }
            // sql.close();
            resolve(results);
          }).catch(err => {  reject(err) });
        }).catch(err => {  reject(err) });
      })
    })



  }
  chitietthuadat(params) {
    return new Promise((resolve, reject) => {
      let results = [];
      let soTo = params.soTo, soThua = params.soThua, quanHuyen = params.quanHuyen, phuongxa = params.phuongXa;
      let sql = `select LOAIMUCDICHSUDUNG.tenDayDu, dienTich, nhomDonGia,nhomDat from DAMUCDICHSUDUNG inner join LOAIMUCDICHSUDUNG on DAMUCDICHSUDUNG.loaiMucDichSuDungId = LOAIMUCDICHSUDUNG.loaiMucDichSuDungId where soThuTuThua = ${soThua} and soHieuToBanDo = ${soTo} and MaQuanHuyen = ${quanHuyen} and MaPhuongXa = ${phuongxa}`
      this.connect().then(request => {
        this.select(sql, request).then(res => {
          if (!res || (res && res.length <= 0)) {  resolve([]); }
          else {
            let proms = [];

            for (let item of res) {
              let tableName = item['nhomDat'] === 'NN' ? 'PHANVT_NN_GIA' : 'PHANVT_PNN_GIA';
              sql = `select ${item['nhomDonGia']} from ${tableName} WHERE SoHieuThua = ${soThua} and soHieuToBanDo = ${soTo} and MaQuanHuyen = ${quanHuyen} and MaPhuongXa = ${phuongxa}`;
              proms.push(this.select(sql, request));
            }
            Promise.all(proms).then(donGias => {
              let results = [];
              for (var i = 0; i < res.length; i++) {
                var element = res[i];
                for (const donGia of donGias[0]) {
                  results.push({
                  tenDayDu: element['tenDayDu'],
                  donGia: donGia[element['nhomDonGia']],
                  dienTich: element['dienTich']
                })
                }
                
              }
              resolve(results);
            }).catch(err => {  reject(err) });
          }
        })
      }).catch(err => { reject(err) });
    });
  }
  cungCapGiaDat(props){
    console.log(props);
      return this.query(`UPDATE THUADAT SET GiaDoDanCungCap = ${props.gia} WHERE OBJECTID = ${props.OBJECTID}`)
  }
}
module.exports = DatabaseManager;