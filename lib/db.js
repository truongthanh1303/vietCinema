var config 	= require("./../config/config.js"),
	db_config = require(config.CONFIG_PATH + "db.js"),
	colors = require("colors");

var Db = require("mongodb").Db,
	Db_Server = require("mongodb").Server;

var dbLib = function(){
	this.db_server = Db_Server(db_config.address,db_config.port);
	this.username = db_config.username;
	this.pwd = db_config.passwd;
	this._db = new Db(db_config.db_name,this.db_server,{w:1});
};

dbLib.prototype.open = function(callback){
	if(this.db){
		callback(null,this.db);
		return;
	}
	this._db.open(function(err,db){
		if(err){
			callback(err);
		}
		else{
			console.log(colors.green("DATABASE OPENNED"));
			this.db = db;
			callback(err,db);
		}
	}.bind(this));
}

dbLib.prototype.auth  = function(callback){
	if(this.authenticated){
		callback(null,true);
		return;
	}
	this.db.authenticate(this.username,this.pwd,function(err,result){
		if(err){
			callback(err);
		}
		else
		{
			console.log(colors.green("DATABASE AUTHENTICATED"));
			this.authenticated = true;
			callback(err,result);
		}
	}.bind(this));
}

dbLib.prototype.aggregate = function(db, collection, match, group, callback){
	var _collection = db.collection(collection);
	_collection.aggregate(match, group, function(err, result){
		callback(err,result);
	}.bind(this));
}

dbLib.prototype.close  = function(db){
	db.close();
}

dbLib.prototype.insert  = function(db,collection,data,callback){
	var _collection = db.collection(collection);
	_collection.insert(data,{w:1,serializeFunctions:true},function(err,result){
		callback(err,result);
	}.bind(this));
};

dbLib.prototype.find  = function(db,collection,condition,option,callback){
	var _collection = db.collection(collection);
	_collection.find(condition,option).toArray(function(err,data){
		callback(err,data);
	});
};

dbLib.prototype.update  = function(db,collection,condition,data,option,callback){
	var _collection = db.collection(collection);
	_collection.update(condition,data,option,function(err,data){
		callback(err,data);
	});
};

dbLib.prototype.remove  = function(db,collection,condition,callback){
	var _collection = db.collection(collection);
	_collection.remove(condition,{w:1},function(err,data){
		callback(err,data);
	});
};
dbLib.prototype.distinct  = function(db,collection,key,query,option,callback){
	var _collection = db.collection(collection);
	_collection.distinct(key,query,option,function(err,data){
		callback(err,data);
	});
};


module.exports = dbLib;