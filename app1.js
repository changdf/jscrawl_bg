var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
//自定义工具类
var utils = require("./util");

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

var mysql = require('mysql');
var conn = mysql.createPool({
    host: 'localhost',
	user: 'root',
	password: 'root',
	database:'twitter',
	port: 3306
});

conn.getConnection(function (err, conn) {
	var querySql = "select * from twitter_user";
    conn.query(querySql,function(err,rows){
	    conn.release();
        for (var i in rows) {
            client.sadd("twitter_user",rows[i].url);
            //保存url和id的关系
            client.set(rows[i].url,rows[i].id);
        }
    });
});

conn.getConnection(function (err, conn) {
	var tmpStr = utils.toLocalString(utils.addDays(new Date(),-1));
	var startDate = tmpStr.substring(0,tmpStr.indexOf(" "))+" "+"00:00:00";
	var endDate = utils.toLocalString(new Date());
	var querySql = "select * from twitter_message message,twitter_user user where message.user_id=user.id and publish_time between '"+startDate+"' and '"+endDate+"'";
    conn.query(querySql,function(err,rows){
	    conn.release();
        for (var i in rows) {
            var time = utils.toLocalString(rows[i].publish_time);
            var url = rows[i].url;
            var content = rows[i].content;
            var obj={"url":url,"content":content,"time":time};
            //放入redis用于去重
            client.sadd("twitter_user_data_set",JSON.stringify(obj));
        }
    });
});


var server = app.listen(80);
var io = require('socket.io').listen(server);
var uptime = null;
var downtime = null;
io.sockets.on('connection', function (socket) {
	//将抓取的详细数据放入redis
	socket.on('post_messageList', function (data) {
		//将post_message保存到数据库
		var crawlName = data.crawlName;
		data.post_messageList.forEach(function (post_message,i) {
			console.log(post_message.message.content);
		})
		data.post_messageList.forEach(function (post_message,i) {
			var message = post_message.message;
			var retweet = post_message.retweet;
			if(retweet==0){
				uptime = data.post_messageList[i].time;
			}else{
				for(var k=i+1;k<data.post_messageList.length;k++){
					if(data.post_messageList[k].retweet==0){
						downtime = data.post_messageList[k].time;
						break;
					}
				}
			}
			var time = null;
			if(retweet==1){
				if(uptime!=null && downtime!=null){
					if(new Date(message.time).getTime()>=new Date(downtime).getTime()){
						time = message.time;
					}else{
						time = utils.toLocalString(new Date((new Date(uptime).getTime()+new Date(downtime).getTime())/2));
					}
				}else if(uptime!=null && downtime==null){
					time = uptime;
				}else if(uptime==null && downtime!=null){
					time = downtime;
				}else if(uptime==null && downtime==null){
					time = message.time;
				}
			}else{
				time = message.time;
			}
			//判断是否已经抓取
            var obj={"url":message.url,"content":message.content,"time":message.time};
            /*con = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: 'root',
				database:'test',
				port: 3306
			});
			var querySql = "insert into twitter_message set ?";
			var user_id = 1;
			con.query(querySql,{user_id:user_id,content:content,publish_time:message.time,real_time:time},function(err,rows){
  			});*/

            //放入redis用于去重
            client.sismember("twitter_user_data_set",JSON.stringify(obj),function (err,data) {
				if(data!=1){
					client.get(message.url, function (err, reply) {
						var user_id = parseInt(reply);
						conn.getConnection(function (err, conn) {
							var querySql = "insert into twitter_message set ?";
							conn.query(querySql,{user_id:user_id,content:message.content,publish_time:message.time,real_time:time},function(err,rows){
				        		conn.release();
		  		  			});
						})
					});
				}
			});
		});
	});

	socket.on('getCrawlUrl', function (data) {
		//从redis获取数据
		var crawlName = data.crawlName;
		var tabCount = data.tabCount;
		if(tabCount>settings.maxTabCount){
			return;
		}
		client.spop("twitter_user",function(err,crawingUrl){
			socket.emit('getCrawlUrl', {crawingUrl:crawingUrl});
		});
	});
	
});

module.exports = app;
