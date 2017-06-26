var redis = require('redis');
//var config = require('../config');
var options = {
	"host":"127.0.0.1",
	"port":"6380"
}

function Cache() {
    this._redis = this._redis ? this._redis : redis.createClient(options);
    /*this.getClient = function(){
    	return this._redis;
	}*/
}

Cache.prototype.keys = function (k,fn) {
    this._redis.keys(k, fn);
}

Cache.prototype.get = function (k, fn) {
    this._redis.get(k, fn);
};

Cache.prototype.set = function (k, v, fn) {
    this._redis.set(k, v, fn);
};

Cache.prototype.expire = function (k, interval) {
    this._redis.expire(k, interval);
};

Cache.prototype.del = function (k, fn) {
    this._redis.del(k, fn);
};

Cache.prototype.lpush = function (k, v, fn) {
    if (this._redis.lpush === undefined) {
        fn(Error(), null);
    } else {
        this._redis.lpush(k, v, fn);
    }
};

Cache.prototype.lpop = function (k,fn) {
    if (this._redis.lpop === undefined) {
        fn(Error(), null);
    } else {
        this._redis.lpop(k, fn);
    }
};

Cache.prototype.rpush = function (k, v, fn) {
    if (this._redis.rpush === undefined) {
        fn(Error(), null);
    } else {
        this._redis.rpush(k, v, fn);
    }
};

Cache.prototype.rpop = function (k,fn) {
    if (this._redis.rpop === undefined) {
        fn(Error(), null);
    } else {
        this._redis.rpop(k, fn);
    }
};

Cache.prototype.sadd = function (k, v, fn) {
    if (this._redis.sadd === undefined) {
        fn(Error(), null);
    } else {
        this._redis.sadd(k, v, fn);
    }
};

Cache.prototype.sismember = function (k,v,fn) {
    if (this._redis.sismember === undefined) {
        fn(Error(), null);
    } else {
        this._redis.sismember(k, v, fn);
    }
};

Cache.prototype.scard = function (k,fn) {
    if (this._redis.scard === undefined) {
        fn(Error(), null);
    } else {
        this._redis.scard(k,fn);
    }
};

Cache.prototype.spop = function (k,fn) {
    if (this._redis.spop === undefined) {
        fn(Error(), null);
    } else {
        this._redis.spop(k,fn);
    }
};

Cache.prototype.hset = function (k, f, v, fn) {
    if (this._redis.hset === undefined) {
        fn(Error(), null);
    } else {
        this._redis.hset(k, f, v, fn);
    }
};

Cache.prototype.hget = function (k, f, fn) {
    if (this._redis.hget === undefined) {
        fn(Error(), null);
    } else {
        this._redis.hget(k, f, fn);
    }
};

module.exports = Cache;