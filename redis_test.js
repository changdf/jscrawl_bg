var Cache = require("./cache");
var utils = require("./util");
var util = require('util'); 
/*var redis = require("redis");
var options = {
	"host":"127.0.0.1",
	"port":"6379"
}
var client = redis.createClient();*/
var client = new Cache();

client.set("string key", "string val");

client.set("string key", "string val");
client.get("string key", function (err, reply) {
    
});

client.lpush("list key","1");
client.lpush("list key","2");

/*client.lpop("list key",function(err){
	
})*/

client.sadd("bigset", "a member");
client.sadd("bigset", "another member");
client.sismember("bigset","a member",function (err,data) {
	if(data){
		console.log("ww")
	}
});

client.hset('sessionid', { password1: 'password1'})

//client.quit();

/*var redis = require("redis");
var client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});*/

client.spop("cdfCrawingUrl",function(err,crawingUrl){
	console.log("CrawingUrl"+crawingUrl);
	//socket.emit('getCrawlUrl', {crawingUrl:crawingUrl});
});

/*var obj={'ww':"ww",'rr':'rr'};
client.lpush("twitter_user_data",JSON.stringify(obj));
client.lpop("twitter_user_data",function(err,data){
	console.log("err"+err);
	console.log(util.inspect(data));
	data = JSON.parse(data);
	console.log(data.ww+"  "+data.rr);
});*/

var tmpStr = utils.toLocalString(utils.addDays(new Date(),-1));
var startDate = tmpStr.substring(0,tmpStr.indexOf(" "))+" "+"00:00:00";
