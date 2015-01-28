var colors = require("colors");
var config = require("./../config/config.js"),
	_dbLib = require(config.LIB_PATH + "db.js"),
	_dbConfig = require(config.CONFIG_PATH + "db.js");

var db ={
	dbLib : new _dbLib(),
}

db.open = function(callback){
	this.dbLib.open(function(err,db){
		if(err){
			console.log(colors.red("[DATABASE] retry open and authentication"));
			setTimeout(this.open.bind(this,callback),1000*10);
		}
		else{
			this.dbLib.auth(function(err,res){
				if(err){
					console.log(colors.red("[DATABASE] retry authentication"));
					setTimeout(this.open.bind(this,callback),1000*10);
				}
				else{
					callback(db);
				}
			});
		}
	}.bind(this));
};

db.aggregate = function(db, collection, match, group, callback){
	this.dbLib.aggregate(db, collection, match, group, callback);
}

db.insert  = function(db,collection,data,callback){
	this.dbLib.insert(db,collection,data,callback);
};
db.find  = function(db,collection,condition,option,callback){
	this.dbLib.find(db,collection,condition,option,callback);
};
db.update  = function(db,collection,condition,data,option,callback){
	this.dbLib.update(db,collection,condition,data,option,callback);
};

db.remove  = function(db,collection,condition,callback){
	this.dbLib.remove(db,collection,condition,callback);
};

db.distinct  = function(db,collection,key,query,option,callback){
	this.dbLib.distinct(db,collection,key,query,option,callback); 
};
module.exports = db;

