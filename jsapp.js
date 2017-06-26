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
var Cache = require("./cache");
var client = new Cache();

var settings = {
	maxLevel:3,
	maxTabCount:5
}

var server = app.listen(80);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	//处理获取的抓取链接
	socket.on('post_url', function (data) {
		//将post_url保存在redis
		var crawlName = data.crawlName;
		console.log(util.inspect(data));
		console.log("data"+data.post_urlList);
		for(var i=0;i<data.post_urlList.length;i++){
			client.sadd(crawlName+"CrawingUrl",data.post_urlList[i]);
			//计算爬虫的层次
			if(data.post_urlList[i].indexOf("?")!=-1){
				client.sadd(crawlName+"CrawlLevel",data.post_urlList[i].substring(0,data.post_urlList[i].indexOf("?")));
			}
			else{
				client.sadd(crawlName+"CrawlLevel",data.post_urlList[i]);
			}
		}
	});
	
	//将抓取的详细数据放入redis
	socket.on('post_detail_data', function (data) {
		//将post_detail_data保存在redis
		var crawlName = data.crawlName;
		for(var i=0;i<data.post_detail_data.length;i++){
			client.lpush(crawlName+"DetailData",data.post_detail_data[i]);
		}
	});
	
	socket.on('getCrawlUrl', function (data) {
		//从redis获取数据
		var crawlName = data.crawlName;
		var tabCount = data.tabCount;
		if(tabCount>settings.maxTabCount){
			return;
		}
		client.spop(crawlName+"CrawingUrl",function(err,crawingUrl){
			socket.emit('getCrawlUrl', {crawingUrl:crawingUrl});
		});
	});

	socket.on('errorUrl', function (data){
		//将未能正常抓取的链接保存到redis
		var crawlName = data.crawlName;
		client.sadd(crawlName+"ErrorUrl",data.errorUrl);
	});
});


module.exports = app;
