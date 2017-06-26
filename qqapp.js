var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

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

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
app.listen(80);
server.listen(80);*/

var util = require('util'); 
//redis缓存
//var Cache = require("./cache");
//var client = new Cache();

var settings = {
	maxLevel:3,
	maxTabCount:5
}

var mysql = require('mysql');
var conn;
function handleError () {
    conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database:'test',
		port: 3306
	});

    //连接错误
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        }
    });

    conn.on('error', function (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();

var server = app.listen(80);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	//将抓取的详细数据放入redis
	socket.on('post_message', function (data) {
		//将post_message保存到数据库
		var crawlName = data.crawlName;
		for(var i=0;i<data.post_messageList.length;i++){
			var message = data.post_messageList[i];
			var querySql = "insert into qq_message(message) values('"+ message +"')";
			conn.query(querySql,function(err){
				console.log(err);				
			});
		}
	});
});

module.exports = app;
