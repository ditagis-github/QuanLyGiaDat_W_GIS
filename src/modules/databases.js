const { Client,Pool } = require('pg')
const config = {
  host: '112.78.5.153',
  port: 5432,
  user: 'postgres',
  password: '123',
  database:'BinhDuong_TraCuuGiaDat'
};
const client = new Client(config)
module.exports = client
exports.pool = new Pool(config);