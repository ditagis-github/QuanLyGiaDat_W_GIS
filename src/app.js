var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var map = require('./routes/map');
var tracuu = require('./routes/tracuu');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', map);
app.use('/tracuu', tracuu);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * SOCKET IO
 */
const { Client } = require('pg')
const config = {
  host: '112.78.5.153',
  port: 5432,
  user: 'postgres',
  password: '123',
  database: 'BinhDuong_GiaDat'
};
const client = new Client(config)
client.connect();
io.on('connection', function (socket) {
  socket.on('findThuaDat', function (req) {
    console.log(req);
    var where = ['1=1'];
    if (req.soto) {
      where.push(`sohieutoba = '${req.soto}'`);
    }
    if (req.sothua) {
      where.push(`sohieuthua = '${req.sothua}'`)
    }
    if (req.huyen) {
      where.push(`maquanhuye = '${req.huyen}'`);
    }
    if (req.maphuongxa) {
      where.push(`maphuongxa = '${req.maphuongxa}'`);
    }
    where = where.join(' and ');
    client.query({
      text: `select gid,chusohuu,tenquanhuy,tenphuongx,dientich,sohieutoba,sohieuthua from thuadat where ${where} `
    }).then(res => {
      socket.emit('findThuaDat', res.rows)
    })
      .catch(e => console.log(e))
  })
  socket.on('findStreet', function (req) {
    client.query({
      // text: 'select gid,tu,den,tenconduon from timduong where tenconduon = $1',
      text:`select gid,tu,den,tenconduon from timduong where vn_unaccent(tenconduon) like vn_unaccent($1) order by tenconduon`,
      values: [`${req.text}%`]
    })
      .then(res => {
        socket.emit('findStreet', res.rows)
      })
      .catch(e => console.log(e))

  });
});

module.exports.app = app;
module.exports.server = server;
