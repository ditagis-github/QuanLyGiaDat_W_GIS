// const { pool } = require('./databases');
const { Pool, Client } = require('pg')
const config = {
    user: 'sa',
    password: '268@lTk',
    server: '112.78.4.175',
    database: 'QUANLYGIADAT',
}
class DatabaseManager {
    constructor(params) {
        this.sql = require('mssql')
    }
    findThuaDat(info) {
        console.log(`
        ------------------------------------------------
        Tim kiem thua dat voi thong tin ` + JSON.stringify(info));
        return new Promise((resolve, reject) => {
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
            if (info.chuSuDung) {
                where.push(`contains(chusudung,'"${info.chuSoHuu}"')`);
            }
            where = where.join(' and ');
            this.sql.connect(config).then(() => {
                const request = new this.sql.Request()
                let sql = `select OBJECTID,ChuSoHuu,TenQuanHuyen,TenPhuongXa,DienTich,SoHieuToBanDo,SoHieuThua from THUADAT where ${where} order by tenquanhuyen,tenphuongxa,chusohuu`
                console.log(sql);
                request.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);

                    } else {
                        if (result.recordset.length > 0)
                            resolve(result.recordset)
                        else resolve(null);
                    }
                    this.sql.close();
                })
            }).catch(err => { reject(err); this.sql.close(); });
        });
    }
    findStreet(text) {
        console.log('Tìm kiếm đường ' + text);
        return new Promise((resolve, reject) => {
            this.sql.connect(config).then(() => {
                const request = new this.sql.Request()
                let sql = `SELECT * FROM (
                    SELECT OBJECTID,tu,den,TenConDuong,
                    ROW_NUMBER() OVER (PARTITION BY TenConDuong ORDER BY OBJECTID) AS RowNumber
                    from timduong 
                    where contains(tenconduong,'"${text}"')
                ) a WHERE a.RowNumber = 1 order by a.TenConDuong`;
                request.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);

                    } else {
                        if (result.recordset.length > 0)
                            resolve(result.recordset)
                        else resolve(null);
                    }
                    this.sql.close();
                })
            }).catch(err => { reject(err); this.sql.close(); });
        });
    }
}
module.exports = DatabaseManager;