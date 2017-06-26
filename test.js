

var WebSocket = require('faye-websocket-node'),
http = require('http');

var server = http.createServer();

/*
淘宝手机
https://s.taobao.com/list?spm=a217h.1099669.a214da9-static.1.Vu23tL&app=vproduct&vlist=1&q=%E6%89%8B%E6%9C%BA&cat=1512&from_type=3c

https://s.taobao.com/list?spm=a217h.1099669.a214da9-static.1.Vu23tL&app=vproduct&vlist=1&q=%E6%89%8B%E6%9C%BA&cat=1512&from_type=3c&smToken=aadd57492abd4d07afb4e0f4eab9d569&smSign=lQFw9G%2B5vT3O%2Fhuky8HvjA%3D%3D

redis端口:6379
redis-server.exe redis.windows.conf
redis-cli -h 127.0.0.1 -p 6379 



//维护一个全局队列
var post = {
    url: '',
    data:{
	    
    }
};

*/


server.on('upgrade', function(request, socket, body) {
  if (WebSocket.isWebSocket(request)) {
    var ws = new WebSocket(request, socket, body);

    ws.on('message', function(event) {
      ws.send(event.data);
    });

    ws.on('close', function(event) {
      console.log('close', event.code, event.reason);
      ws = null;
    });
  }
});

server.listen(3002);