var mysql = require('mysql');
var utils = require("./util");
var conn = mysql.createPool({
    host: 'localhost',
	user: 'root',
	password: 'root',
	database:'test',
	port: 3306
});

/*function handleError () {
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
handleError();*/
/*conn.query('SELECT * from qq_message', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].id,rows[0].message);
});*/

/*var querySql = "select url from twitter_user";
conn.query(querySql,function(err,data){
	for(var i=0;i<data.length;i++){
		console.log(data[i].url);	
	}
});*/

/*conn.getConnection(function (err, conn) {
	var querySql = "select url from twitter_user";
    conn.query(querySql,function(err,rows){
	    conn.release();
        for (var i in rows) {
            console.log(rows[i].url);
        }
    });
});*/

/*conn.getConnection(function (err, conn) {
	var querySql = "insert into twitter_user set ?";
    conn.query(querySql,{nickname:"nickName",url:"url",tag:"tag"},function(err,rows){
        conn.release();
    });
});*/

conn.getConnection(function (err, conn) {
	var tmpStr = utils.toLocalString(utils.addDays(new Date(),-1));
	var startDate = tmpStr.substring(0,tmpStr.indexOf(" "))+" "+"00:00:00";
	var endDate = utils.toLocalString(new Date());
	var querySql = "select * from twitter_message message,twitter_user user where message.user_id=user.id and publish_time between '"+startDate+"' and '"+endDate+"'";
	console.log(querySql);
    conn.query(querySql,function(err,rows){
	    conn.release();
        for (var i in rows) {
	        //放入redis用于去重
            //client.sadd("twitter_user_data_set",rows[i].url);
            var time = utils.toLocalString(rows[i].publish_time);
            var user = rows[i].url;
            var content = rows[i].content;
            var obj={"time":time,"user":user,"content":content};
            console.log(JSON.stringify(obj));
        }
    });
});