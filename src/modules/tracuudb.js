const { Client,Pool } = require('pg')
class TraCuuDB {
  constructor() {
    const config = {
      host: 'ditagis.com',
      port: 5432,
      user: 'postgres',
      password: 'ditagis@2017',
      database:'BinhDuong_TraCuuGiaDat'
    };
    this.client = new Client(config)
    this.client.connect();
  }
  query(query) {
    return new Promise((resolve, reject) => {
      this.client.query(query)
        .then(res => {
          resolve(res.rows)
        })
        .catch(e => reject(e))
    });
  }
  getAllDistrict() {
    return new Promise((resolve, reject) => {
      this.client.query('SELECT name,ma_huyen FROM tbl_quanhuyen')
        .then(res => {
          resolve(res.rows)
        })
        .catch(e => reject(e))
    });
  }

  getWardByDistrictId(id) {
    return new Promise((resolve, reject) => {
      var query = {
        text: `SELECT id,name FROM tbl_phuongxa where ma_huyen = $1`,
        values: [id]
      }
      this.query(query).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  getAllStreetNameByLocal(xa, duong) {
    return new Promise((resolve, reject) => {
      if (!xa) reject('xa is null')
      var sql = `SELECT a.* 
            FROM tbl_danhmuc_giaothong a,
                 (SELECT b.ma_huyen, a.khuvuc
                    FROM tbl_phuongxa a, tbl_quanhuyen b
                   WHERE a.ma_huyen = b.ma_huyen
                     AND a.id = $1
                  ) b
            WHERE a.dvhc_huyen = b.ma_huyen
                    AND a.LOAI_VUNG = b.khuvuc`;
      var values = [xa];

      if (duong) {
        sql += ` and LOWER(a.ten_duong) like $2`;
        values.push('%' + duong.toLowerCase() + '%')
      }
      sql += ` ORDER BY ten_duong`;
      this.query({
        text: sql,
        values: values
      }).then(res => resolve(res)).catch(err => reject(err));
    });

  }
  getAllPosition() {
    return new Promise((resolve, reject) => {
      var sql = `SELECT * FROM tbl_vitri_thuadat`;
      this.query(sql).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  getGiaoThongById(duong) {
    return new Promise((resolve, reject) => {
      var sql = `select a.*,a.ten_duong ten_duongchinh, a.loai_khu_vuc loai_khuvuc_2 from tbl_danhmuc_giaothong a where id = $1 `;
      this.query({
        text: sql,
        values: [duong]
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  getGiaoThong_HemById(duong, loai_hem) {
    return new Promise((resolve, reject) => {
      var sql = `
        SELECT b.id, b.name ten_duong, b.code code_hem, vung loai_vung, ma_huyen, b.he_so_d, b.he_so_kn, b.he_so_kp, b.loai_khuvuc_duongchinh loai_khu_vuc,
               a.ten_duong ten_duongchinh, a.tu, a.den, a.tenduong2, b.loai_khu_vuc loai_khuvuc_2
        FROM tbl_danhmuc_giaothong a  ,
              tbl_danhmuc_hem b
        WHERE a.id= $1
        AND a.dvhc_huyen = b.ma_huyen
        AND a.loai_vung = b.vung
        AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh
        AND b.code = $2`;
      this.query({
        text: sql,
        values: [duong, loai_hem]
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  getDetails(duong, vitri, sonam) {
    return new Promise((resolve, reject) => {
      var ttdPromise, gia1Promise, gia2Promise, gia3Promise;
      if (vitri == "MT") {
        ttdPromise = this.getGiaoThongById(duong);
        gia1Promise = this.db_get_bang_gia_td(duong);
      }
      else {
        ttdPromise = this.getGiaoThong_HemById(duong, vitri);
        gia1Promise = this.db_get_bang_gia_hem_td(duong, vitri);
      }
      gia2Promise = this.get_bang_gia_chuyendoi(duong, vitri);
      
      gia3Promise = this.get_bang_gia_chuyendoi3(duong, vitri, sonam);
      Promise.all([ttdPromise, gia1Promise, gia2Promise, gia3Promise]).then(results => {
        const
          ttd = results[0][0],
          gia = results[1];
          console.log(gia);
        var rt = {
          gia1: {
            d1_lua: gia[0].lua || '',
            d1_cln: gia[0].cln || '',
            d1_rsx: gia[0].rsx || '',
            d1_nts: gia[0].nts || '',
            d1_odt: gia[0].odt || '',
            d1_tdv: gia[0].tmdv || '',
            d1_skc: gia[0].skc || '',
            d2_lua: gia[1].lua || '',
            d2_cln: gia[1].cln || '',
            d2_odt: gia[1].odt || '',
            d2_tdv: gia[1].tmdv || '',
            d2_skc: gia[1].skc || '',
            d3_lua: gia[2].lua || '',
            d3_cln: gia[2].cln || '',
            d3_odt: gia[2].odt || '',
            d3_tdv: gia[2].tmdv || '',
            d3_skc: gia[2].skc || '',
            d4_lua: gia[3].lua || '',
            d4_cln: gia[3].cln || '',
            d4_odt: gia[3].odt || '',
            d4_tdv: gia[3].tmdv || '',
            d4_skc: gia[3].skc || ''
          },
          gia2: {
            d1_lua: gia[0].lua_2 || '',
            d1_cln: gia[0].cln_2 || '',
            d1_rsx: gia[0].rsx_2 || '',
            d1_nts: gia[0].nts_2 || '',
            d1_odt: gia[0].odt_2 || '',
            d1_tdv: gia[0].tmdv_2 || '',
            d1_skc: gia[0].skc_2 || '',
            d2_lua: gia[1].lua_2 || '',
            d2_cln: gia[1].cln_2 || '',
            d2_odt: gia[1].odt_2 || '',
            d2_tdv: gia[1].tmdv_2 || '',
            d2_skc: gia[1].skc_2 || '',
            d3_lua: gia[2].lua_2 || '',
            d3_cln: gia[2].cln_2 || '',
            d3_odt: gia[2].odt_2 || '',
            d3_tdv: gia[2].tmdv_2 || '',
            d3_skc: gia[2].skc_2 || '',
            d4_lua: gia[3].lua_2 || '',
            d4_cln: gia[3].cln_2 || '',
            d4_odt: gia[3].odt_2 || '',
            d4_tdv: gia[3].tmdv_2 || '',
            d4_skc: gia[3].skc_2 || ''
          },
          gia3: results[2],
          gia4: results[3],
          ten_duong: ttd.ten_duong,
          tu: ttd.tu,
          den: ttd.den,
          vung: ttd.loai_vung,
          loai: ttd.loai_khu_vuc,
          loai_kv2: ttd.loai_khuvuc_2,
          duongchinh: ttd.ten_duongchinh,
          hs_d: ttd.he_so_d,
          hs_kn: ttd.he_so_kn,
          hs_kp: ttd.ho_so_kp
        };
        resolve(rt);
      }).catch(err => {
        // console.log(err);
      })

    });
  }
  db_get_bang_gia_td(duong) {
    return new Promise((resolve, reject) => {
      if (!duong)
        reject('parameter is null')
      var sql = this.QUERY_get_bang_gia_td();
      this.query({
        text: sql,
        values: [duong]
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  db_get_bang_gia_hem_td(duong, hem) {
    return new Promise((resolve, reject) => {
      if (!duong || !hem)
        reject('parameter is null')
      var query = this.QUERY_get_bang_gia_hem_td(hem);
      this.query({
        text: query,
        values: [duong, hem]
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  get_bang_gia_chuyendoi(duong, vitri) {
    return new Promise((resolve, reject) => {
      this.db_get_thongtin_tenduong(duong).then(thong_tin_duong => {
        var khuvuc = thong_tin_duong["loai_vung"];
        var sql, values = [];
        if (khuvuc == 'NT') {
          sql = "SELECT A0.THU_TU, A0.PHAM_VI, ";
          sql += "      A2.ODT - A1.LUA AS LUA_DAT_O_THM , ";
          sql += "      A2.ODT_2 - A1.LUA_2 AS LUA_DAT_O_VHM, ";
          sql += "      A2.TMDV_2 - A1.LUA_2 AS LUA_TMDV70,  ";
          sql += "      A2.SKC_2 - A1.LUA_2 AS LUA_SXKD70, ";
          sql += "      A2.ODT - A1.CLN AS CLN_DAT_O_THM , ";
          sql += "      A2.ODT_2 - A1.CLN_2 AS CLN_DAT_O_VHM, ";
          sql += "      A2.TMDV_2 - A1.CLN_2 AS CLN_TMDV70,  ";
          sql += "      A2.SKC_2 - A1.CLN_2 AS CLN_SXKD70 ";
          sql += " FROM tbl_chuyen_md A0, ";
        }
        else if (khuvuc == 'DT') {
          sql = "SELECT A0.THU_TU, A0.PHAM_VI, ";
          sql += "      A1.ODT - A2.LUA AS LUA_DAT_O_THM , ";
          sql += "      A1.ODT_2 - A2.LUA_2 AS LUA_DAT_O_VHM, ";
          sql += "      A1.TMDV_2 - A2.LUA_2 AS LUA_TMDV70,  ";
          sql += "      A1.SKC_2 - A2.LUA_2 AS LUA_SXKD70, ";

          sql += "      A1.ODT - A2.CLN AS CLN_DAT_O_THM , ";
          sql += "      A1.ODT_2 - A2.CLN_2 AS CLN_DAT_O_VHM, ";
          sql += "      A1.TMDV_2 - A2.CLN_2 AS CLN_TMDV70,  ";
          sql += "      A1.SKC_2 - A2.CLN_2 AS CLN_SXKD70 ";
          sql += " FROM tbl_chuyen_md_dt A0, ";
        }
        if (vitri == "MT") {
          sql += ` ( ${this.QUERY_get_bang_gia_td({ duong: '$1' })} ) A1, `;
          sql += ` ( ${this.QUERY_get_bang_gia_td({ duong: '$1' })} ) A2 `;
          values.push(duong);
        }
        else {
          sql += `
          ( ${this.QUERY_get_bang_gia_hem_td(vitri, { duong: '$1', hem: '$2' })}) A1,
          ( ${this.QUERY_get_bang_gia_hem_td(vitri, { duong: '$1', hem: '$2' })}) A2 `;
          values.push(duong, vitri);
        }

        sql += " WHERE A0.VITRI_GOC = A1.VITRI ";
        sql += "   AND A0.VITRI_CHUYEN = A2.VITRI ";
        sql += " ORDER BY A0.THU_TU ";
        this.query({
          text: sql,
          values: values
        }).then(res => resolve(res)).catch(err => reject(err));
      });
    });
  }
  QUERY_get_bang_gia_td(parameter={}) {
    let duong = parameter.duong || '$1'
    let sql = `
    SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, 
           SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) LUA, 
           SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) CLN, 
           SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) RSX, 
           SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) NTS, 
           SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, 
           SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, 
           SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, 

           SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) LUA_2, 
           SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) CLN_2, 
           SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) RSX_2, 
           SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) NTS_2, 
           SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, 
           SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, 
           SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 

    FROM ( 
    	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
    		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
    		    ELSE ma_loai_dat END MA_LOAI_DAT, 
    		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, 
    		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat 
    	FROM tbl_giadat a, 
    	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = ${duong}) b 
    	  WHERE a.ma_dvhc = b.dvhc_huyen 
    	  AND a.khu_vuc = b.loai_khu_vuc 
    	  AND a.ma_vung = b.loai_vung AND a.ma_vung is NOT NULL 
    	  GROUP BY 
    		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
    		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
    		    ELSE ma_loai_dat END, 
    		vitri 
    	UNION ALL 
    	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
    		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
    		    ELSE ma_loai_dat END MA_LOAI_DAT, 
    		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, 
    		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat 
    	FROM tbl_giadat a, 
    	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = ${duong}) b 
    	  WHERE a.ma_dvhc = b.dvhc_huyen 
    	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khu_vuc end) 
    	  AND a.ma_vung  is NULL 
    	  GROUP BY 
    		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
    		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
    		    ELSE ma_loai_dat END, 
    		vitri 


    		) A 
    GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END ORDER BY vitri` ;

    return sql;
  }
  QUERY_get_bang_gia_hem_td(hem, parameter={}) {
    let iHem = parameter.hem || '$2',
      iDuong = parameter.duong || '$1';

    let giatinh = 1;
    if (hem == 'HD4') giatinh = 80 / 100;

    let sql = `
    SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, 
    SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*${giatinh} LUA, 
    SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*${giatinh} CLN, 
    SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*${giatinh} RSX, 
    SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*${giatinh} NTS, 
    SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, 
    SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, 
    SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, 

    SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*${giatinh} LUA_2, 
    SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*${giatinh} CLN_2, 
    SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*${giatinh} RSX_2, 
    SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*${giatinh} NTS_2, 
    SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, 
    SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, 
    SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 
    FROM ( 
    SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
        WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
        ELSE ma_loai_dat END MA_LOAI_DAT, 
    vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, 
    MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat 
    FROM tbl_giadat a, 
        (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.loai_khuvuc_duongchinh loai_khuvuc_dc,  vung loai_vung,  
                  b.he_so_d, b.he_so_kn, b.he_so_kp 
        FROM tbl_danhmuc_giaothong a  , 
              tbl_danhmuc_hem b 
        WHERE a.id= ${iDuong}
        AND a.dvhc_huyen = b.ma_huyen 
        AND a.loai_vung = b.vung 
        AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh 
        AND b.code = ${iHem}
        ) b 
    WHERE a.ma_dvhc = b.ma_huyen 
    AND a.khu_vuc = b.loai_khuvuc 
    AND a.ma_vung = b.loai_vung 
    AND a.ma_vung is not NULL 
    GROUP BY 
    CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
        WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
        ELSE ma_loai_dat END, 
    vitri 
    union all 
    SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
        WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
        ELSE ma_loai_dat END MA_LOAI_DAT, 
    vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, 
    MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat 
    FROM tbl_giadat a, 
        (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.loai_khuvuc_duongchinh loai_khuvuc_dc,  vung loai_vung,  
                  b.he_so_d, b.he_so_kn, b.he_so_kp 
        FROM tbl_danhmuc_giaothong a  , 
              tbl_danhmuc_hem b 
        WHERE a.id= ${iDuong}
        AND a.dvhc_huyen = b.ma_huyen 
        AND a.loai_vung = b.vung 
        AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh 
        AND b.code = ${iHem}) b 
    WHERE a.ma_dvhc = b.ma_huyen 
    AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khuvuc end) 
    AND a.ma_vung is NULL 
    GROUP BY 
    CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' 
        WHEN ma_loai_dat = 'NKH'  THEN 'CLN' 
        ELSE ma_loai_dat END, 
    vitri 
    ) A 
    GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END ORDER BY vitri`  ;
    return sql;
  }
  get_bang_gia_chuyendoi3(duong, vitri, sonam) {
    return new Promise((resolve, reject) => {
      this.db_get_thongtin_tenduong(duong).then(thong_tin_duong => {
        var khuvuc = thong_tin_duong["loai_vung"];
        var sql, values = [sonam];
        if (khuvuc == 'NT') {
          sql =
            `SELECT A0.THU_TU, A0.PHAM_VI, 
            A2.TMDV_2 - A1.CLN_2 AS B3_CLN_TMDV , 
            A2.SKC_2 - A1.CLN_2 AS B3_CLN_SXKD, 
            ROUND(A2.ODT - (A2.SKC*$1/70),1) AS B3_SXKD_DAT_O_THM,  
            ROUND(A2.ODT_2 - (A2.SKC_2*$1/70),1) AS B3_SXKD_DAT_O_VHM, 
            ROUND(A2.ODT - (A2.TMDV*$1/70),1) AS B3_TMDV_DAT_O_THM , 
            ROUND(A2.ODT_2 - (A2.TMDV_2*$1/70),1) AS B3_TMDV_DAT_O_VHM, 
            ROUND((A2.TMDV_2 - A2.SKC_2) *$1/70,1) AS B3_SXKD_TMDV
          FROM tbl_chuyen_md A0, `;
        }
        else if (khuvuc == 'DT') {
          sql =
            `SELECT A0.THU_TU, A0.PHAM_VI, 
            A1.TMDV_2 - A2.CLN_2 AS B3_CLN_TMDV , 
            A1.SKC_2 - A2.CLN_2 AS B3_CLN_SXKD, 
            ROUND(A1.ODT - (A1.SKC*$1/70),1) AS B3_SXKD_DAT_O_THM,  
            ROUND(A1.ODT_2 - (A1.SKC_2*$1/70),1) AS B3_SXKD_DAT_O_VHM, 
            ROUND(A1.ODT - (A1.TMDV*$1/70),1) AS B3_TMDV_DAT_O_THM , 
            ROUND(A1.ODT_2 - (A1.TMDV_2*$1/70),1) AS B3_TMDV_DAT_O_VHM, 
            ROUND((A1.TMDV_2 - A1.SKC_2) *$1/70,1) AS B3_SXKD_TMDV
          FROM tbl_chuyen_md_dt A0, `;
        }
        if (vitri == "MT") {
          sql += ` ( ${this.QUERY_get_bang_gia_td({ duong: '$2' })} ) A1, `;
          sql += ` ( ${this.QUERY_get_bang_gia_td({ duong: '$2' })} ) A2 `;
          values.push(duong);
        }
        else {
          sql +=
            `( ${this.QUERY_get_bang_gia_hem_td(vitri, { duong: '$2', hem: '$3' })}) A1,
            ( ${this.QUERY_get_bang_gia_hem_td(vitri, { duong: '$2', hem: '$3' })}) A2 `;
          values.push(duong, vitri);
        }

        sql +=
          `WHERE A0.VITRI_GOC = A1.VITRI 
           AND A0.VITRI_CHUYEN = A2.VITRI
         ORDER BY A0.THU_TU `;
        this.query({
          text: sql,
          values: values
        }).then(res => resolve(res)).catch(err => reject(err));
      });
    });
  }
  act_tinh_bang5(duong, vitri, sonam) {

    return this.get_bang_gia_chuyendoi3(duong, vitri, sonam);

  }
  db_get_thongtin_tenduong(duong) {
    return new Promise((resolve, reject) => {

      var sql = "select a.*,a.ten_duong ten_duongchinh, a.loai_khu_vuc loai_khuvuc_2 from tbl_danhmuc_giaothong a where id = $1 ";
      this.query({
        text: sql,
        values: [duong]
      }).then(res => resolve(res[0])).catch(err => reject(err));

    });
  }
}
module.exports = TraCuuDB;

