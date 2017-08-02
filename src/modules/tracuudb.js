class TraCuuDB {
  constructor() {
    this.client = require('./databases');
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
        sql += ` and a.ten_duong like '%$2%'`;
        values.push(duong)
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
        SELECT b.id, b.name ten_duong, b.code code_hem, vung loai_vung, ma_huyen, b.he_so_d, b.he_so_kn, b.he_so_kp, b.loai_khuvuc_duongchinh loai_khu_vuc,;
               a.ten_duong ten_duongchinh, a.tu, a.den, a.tenduong2, b.loai_khu_vuc loai_khuvuc_2;
        FROM tbl_danhmuc_giaothong a  ,;
              tbl_danhmuc_hem b;
        WHERE a.id= $1;
        AND a.dvhc_huyen = b.ma_huyen;
        AND a.loai_vung = b.vung;
        AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh;
        AND b.code = $2`;
      this.query({
        text: sql,
        values: [duong, loai_hem]
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  getDetails(duong, vitri, sonam) {
    return new Promise((resolve, reject) => {
      var ttdPromise, gia1Promise, gia2Promise;
      if (vitri == "MT") {
        ttdPromise = this.getGiaoThongById(duong);
        gia1Promise = this.db_get_bang_gia_td(duong);

      }

      else {
        ttdPromise = this.getGiaoThong_HemById(duong, vitri);
        gia1Promise = this.db_get_bang_gia_hem_td(duong, vitri);
      }
      gia2Promise = this.get_bang_gia_chuyendoi(duong, vitri);

      Promise.all([ttdPromise, gia1Promise, gia2Promise]).then(results => {
        const
          ttd = results[0][0],
          gia = results[1];
        var rt = {
          gia1: {
            d1_lua: gia[0].lua||'',
            d1_cln: gia[0].cln||'',
            d1_rsx: gia[0].rsx||'',
            d1_nts: gia[0].nts||'',
            d1_odt: gia[0].odt||'',
           d1_tdv: gia[0].tmdv||'',
            d1_skc: gia[0].skc||'',
            d2_lua: gia[1].lua||'',
            d2_cln: gia[1].cln||'',
            d2_odt: gia[1].odt||'',
           d2_tdv: gia[1].tmdv||'',
            d2_skc: gia[1].ksc||'',
            d3_lua: gia[2].lua||'',
            d3_cln: gia[2].cln||'',
            d3_odt: gia[2].odt||'',
            d3_tdv: gia[2].tdv||'',
            d3_skc: gia[2].skc||'',
            d4_lua: gia[3].lua||'',
            d4_cln: gia[3].cln||'',
            d4_odt: gia[3].odt||'',
            d4_tdv: gia[3].tdv||'',
            d4_skc: gia[3].skc||''
          },
          gia2: {
            d1_lua: gia[0].lua_2||'',
            d1_cln: gia[0].cln_2||'',
            d1_rsx: gia[0].rsx_2||'',
            d1_nts: gia[0].nts_2||'',
            d1_odt: gia[0].odt_2||'',
           d1_tdv: gia[0].tmdv_2||'',
            d1_skc: gia[0].skc_2||'',
            d2_lua: gia[1].lua_2||'',
            d2_cln: gia[1].cln_2||'',
            d2_odt: gia[1].odt_2||'',
           d2_tdv: gia[1].tmdv_2||'',
            d2_skc: gia[1].ksc_2||'',
            d3_lua: gia[2].lua_2||'',
            d3_cln: gia[2].cln_2||'',
            d3_odt: gia[2].odt_2||'',
            d3_tdv: gia[2].tdv_2||'',
            d3_skc: gia[2].skc_2||'',
            d4_lua: gia[3].lua_2||'',
            d4_cln: gia[3].cln_2||'',
            d4_odt: gia[3].odt_2||'',
            d4_tdv: gia[3].tdv_2||'',
            d4_skc: gia[3].skc_2||''
          },
          gia3: results[2],
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
        console.log(rt);
        resolve(rt);
      }).catch(err => {
        console.log(err);
      })

    });
  }
  db_get_bang_gia_td(duong) {
    return new Promise((resolve, reject) => {
      if (!duong)
        reject('parameter is null')
      var sql = "";
      sql += "SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) LUA, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) CLN, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) RSX, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) NTS, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, ";

      sql += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) LUA_2, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) CLN_2, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) RSX_2, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) NTS_2, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, ";
      sql += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 ";

      sql += "FROM ( ";
      sql += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      sql += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      sql += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
      sql += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
      sql += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
      sql += "	FROM tbl_giadat a, ";
      sql += "	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = $1) b ";
      sql += "	  WHERE a.ma_dvhc = b.dvhc_huyen ";
      sql += "	  AND a.khu_vuc = b.loai_khu_vuc ";
      sql += "	  AND a.ma_vung = b.loai_vung AND a.ma_vung is NOT NULL ";
      sql += "	  GROUP BY ";
      sql += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      sql += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      sql += "		    ELSE ma_loai_dat END, ";
      sql += "		vitri ";
      sql += "	UNION ALL ";
      sql += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      sql += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      sql += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
      sql += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
      sql += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
      sql += "	FROM tbl_giadat a, ";
      sql += "	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = $1) b ";
      sql += "	  WHERE a.ma_dvhc = b.dvhc_huyen ";
      sql += "	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khu_vuc end) ";
      sql += "	  AND a.ma_vung  is NULL ";
      sql += "	  GROUP BY ";
      sql += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      sql += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      sql += "		    ELSE ma_loai_dat END, ";
      sql += "		vitri ";
      sql += "		) A ";
      sql += "GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END";
      this.query({
        text: sql,
        values: [duong]
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  db_get_bang_gia_hem_td(duong, hem) {

    return new Promise((resolve, reject) => {
      if (duong || hem)
        reject('parameter is null')
      var giatinh = 1;
      if (hem == 'HD4') giatinh = 80 / 100;
      var query = "";
      query += "SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} LUA, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} CLN, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} RSX, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} NTS, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} LUA_2, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} CLN_2, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} RSX_2, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} NTS_2, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, ";
      query += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 ";
      query += "FROM ( ";
      query += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      query += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      query += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
      query += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
      query += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
      query += "	FROM tbl_giadat a, ";
      query += "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
      query += "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
      query += "				FROM tbl_danhmuc_giaothong a  , ";
      query += "							tbl_danhmuc_hem b ";
      query += "				WHERE a.id= $2 ";
      query += "				AND a.dvhc_huyen = b.ma_huyen ";
      query += "				AND a.loai_vung = b.vung ";
      query += "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
      query += "				AND b.code = '{hem}' ";
      query += "				) b ";
      query += "	  WHERE a.ma_dvhc = b.ma_huyen ";
      query += "	  AND a.khu_vuc = b.loai_khuvuc ";
      query += "	  AND a.ma_vung = b.loai_vung ";
      query += "	  AND a.ma_vung is not NULL ";
      query += "	  GROUP BY ";
      query += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      query += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      query += "		    ELSE ma_loai_dat END, ";
      query += "		vitri ";
      query += "	union all ";
      query += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      query += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      query += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
      query += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
      query += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
      query += "	FROM tbl_giadat a, ";
      query += "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
      query += "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
      query += "				FROM tbl_danhmuc_giaothong a  , ";
      query += "							tbl_danhmuc_hem b ";
      query += "				WHERE a.id= $2 ";
      query += "				AND a.dvhc_huyen = b.ma_huyen ";
      query += "				AND a.loai_vung = b.vung ";
      query += "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
      query += "				AND b.code = '{hem}' ";
      query += "				) b ";
      query += "	  WHERE a.ma_dvhc = b.ma_huyen ";
      query += "	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khuvuc end) ";
      query += "	  AND a.ma_vung is NULL ";
      query += "	  GROUP BY ";
      query += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
      query += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
      query += "		    ELSE ma_loai_dat END, ";
      query += "		vitri ";
      query += "		) A ";
      query += "GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END";
      this.query({
        text: sql,
        values: [giatinh, duong, hem]
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }
  get_bang_gia_chuyendoi(duong, vitri) {
    return new Promise((resolve, reject) => {
      this.db_get_thongtin_tenduong(duong).then(thong_tin_duong => {
        var khuvuc = thong_tin_duong["loai_vung"];
        var sql;
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
          var sql_BangGia = "";
          sql_BangGia += "SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) LUA, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) CLN, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) RSX, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) NTS, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, ";

          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) LUA_2, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) CLN_2, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) RSX_2, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END) NTS_2, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, ";
          sql_BangGia += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 ";

          sql_BangGia += "FROM ( ";
          sql_BangGia += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          sql_BangGia += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          sql_BangGia += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
          sql_BangGia += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
          sql_BangGia += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
          sql_BangGia += "	FROM tbl_giadat a, ";
          sql_BangGia += "	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = $1) b ";
          sql_BangGia += "	  WHERE a.ma_dvhc = b.dvhc_huyen ";
          sql_BangGia += "	  AND a.khu_vuc = b.loai_khu_vuc ";
          sql_BangGia += "	  AND a.ma_vung = b.loai_vung AND a.ma_vung is NOT NULL ";
          sql_BangGia += "	  GROUP BY ";
          sql_BangGia += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          sql_BangGia += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          sql_BangGia += "		    ELSE ma_loai_dat END, ";
          sql_BangGia += "		vitri ";
          sql_BangGia += "	UNION ALL ";
          sql_BangGia += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          sql_BangGia += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          sql_BangGia += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
          sql_BangGia += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
          sql_BangGia += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
          sql_BangGia += "	FROM tbl_giadat a, ";
          sql_BangGia += "	     (SELECT * FROM tbl_danhmuc_giaothong WHERE id = $1) b ";
          sql_BangGia += "	  WHERE a.ma_dvhc = b.dvhc_huyen ";
          sql_BangGia += "	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khu_vuc end) ";
          sql_BangGia += "	  AND a.ma_vung  is NULL ";
          sql_BangGia += "	  GROUP BY ";
          sql_BangGia += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          sql_BangGia += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          sql_BangGia += "		    ELSE ma_loai_dat END, ";
          sql_BangGia += "		vitri ";
          sql_BangGia += "		) A ";
          sql_BangGia += "GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END";
          sql += " (" + sql_BangGia + " ) A1, ";
          sql += " (" + sql_BangGia + " ) A2 ";
        }
        else {
          var query_BangGia_Hem = "";
          query_BangGia_Hem += "SELECT CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END VITRI, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} LUA, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} CLN, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} RSX, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END)*{giatinh} NTS, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) ODT, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) TMDV, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat as numeric),1) ELSE NULL END) SKC, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'LUA' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} LUA_2, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'CLN' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} CLN_2, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'RSX' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} RSX_2, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'NTS' THEN ROUND(CAST(gia_dat*he_so_kn as numeric)) ELSE NULL END)*{giatinh} NTS_2, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) ODT_2, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'TMDV' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) TMDV_2, ";
          query_BangGia_Hem += "       SUM(CASE WHEN ma_loai_dat = 'SKC' THEN ROUND(CAST(gia_dat*he_so_kp as numeric),1) ELSE NULL END) SKC_2 ";
          query_BangGia_Hem += "FROM ( ";
          query_BangGia_Hem += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          query_BangGia_Hem += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          query_BangGia_Hem += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
          query_BangGia_Hem += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
          query_BangGia_Hem += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
          query_BangGia_Hem += "	FROM tbl_giadat a, ";
          query_BangGia_Hem += "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
          query_BangGia_Hem += "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
          query_BangGia_Hem += "				FROM tbl_danhmuc_giaothong a  , ";
          query_BangGia_Hem += "							tbl_danhmuc_hem b ";
          query_BangGia_Hem += "				WHERE a.id= $1 ";
          query_BangGia_Hem += "				AND a.dvhc_huyen = b.ma_huyen ";
          query_BangGia_Hem += "				AND a.loai_vung = b.vung ";
          query_BangGia_Hem += "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
          query_BangGia_Hem += "				AND b.code = '{hem}' ";
          query_BangGia_Hem += "				) b ";
          query_BangGia_Hem += "	  WHERE a.ma_dvhc = b.ma_huyen ";
          query_BangGia_Hem += "	  AND a.khu_vuc = b.loai_khuvuc ";
          query_BangGia_Hem += "	  AND a.ma_vung = b.loai_vung ";
          query_BangGia_Hem += "	  AND a.ma_vung is not NULL ";
          query_BangGia_Hem += "	  GROUP BY ";
          query_BangGia_Hem += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          query_BangGia_Hem += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          query_BangGia_Hem += "		    ELSE ma_loai_dat END, ";
          query_BangGia_Hem += "		vitri ";
          query_BangGia_Hem += "	union all ";
          query_BangGia_Hem += "	SELECT CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          query_BangGia_Hem += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          query_BangGia_Hem += "		    ELSE ma_loai_dat END MA_LOAI_DAT, ";
          query_BangGia_Hem += "		vitri, max(b.he_so_kn) he_so_kn, max(b.he_so_kp) he_so_kp, ";
          query_BangGia_Hem += "		MAX(gia_dat*CASE WHEN ma_loai_dat = 'ODT' OR ma_loai_dat = 'ONT'  OR ma_loai_dat = 'TMDV' OR ma_loai_dat = 'SKC' THEN b.he_so_d ELSE 1 END) gia_dat ";
          query_BangGia_Hem += "	FROM tbl_giadat a, ";
          query_BangGia_Hem += "	     (SELECT ma_huyen,  b.loai_khu_vuc loai_khuvuc, b.`loai_khuvuc_duongchinh` loai_khuvuc_dc,  vung loai_vung,  ";
          query_BangGia_Hem += "	                b.he_so_d, b.he_so_kn, b.he_so_kp ";
          query_BangGia_Hem += "				FROM tbl_danhmuc_giaothong a  , ";
          query_BangGia_Hem += "							tbl_danhmuc_hem b ";
          query_BangGia_Hem += "				WHERE a.id= $1 ";
          query_BangGia_Hem += "				AND a.dvhc_huyen = b.ma_huyen ";
          query_BangGia_Hem += "				AND a.loai_vung = b.vung ";
          query_BangGia_Hem += "				AND a.loai_khu_vuc = b.loai_khuvuc_duongchinh ";
          query_BangGia_Hem += "				AND b.code = '{hem}' ";
          query_BangGia_Hem += "				) b ";
          query_BangGia_Hem += "	  WHERE a.ma_dvhc = b.ma_huyen ";
          query_BangGia_Hem += "	  AND a.khu_vuc = (case when  b.loai_vung = 'DT' THEN 1 else b.loai_khuvuc end) ";
          query_BangGia_Hem += "	  AND a.ma_vung is NULL ";
          query_BangGia_Hem += "	  GROUP BY ";
          query_BangGia_Hem += "		CASE WHEN ma_loai_dat = 'CHN' THEN 'LUA' ";
          query_BangGia_Hem += "		    WHEN ma_loai_dat = 'NKH'  THEN 'CLN' ";
          query_BangGia_Hem += "		    ELSE ma_loai_dat END, ";
          query_BangGia_Hem += "		vitri ";
          query_BangGia_Hem += "		) A ";
          query_BangGia_Hem += "GROUP BY CASE WHEN vitri IS NULL THEN 1 ELSE VITRI END";
          sql += " (" + query_BangGia_Hem + " ) A1, ";
          sql += " (" + query_BangGia_Hem + " ) A2 ";
        }

        sql += " WHERE A0.VITRI_GOC = A1.VITRI ";
        sql += "   AND A0.VITRI_CHUYEN = A2.VITRI ";
        sql += " ORDER BY A0.THU_TU ";
        this.query({
          text: sql,
          values: [duong]
        }).then(res => resolve(res)).catch(err => reject(err));
      });
    });
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

