var colors = require("colors");
var config = require("./../config/config.js"),
	_dbLib = require(config.LIB_PATH + "db.js"),
	_dbConfig = require(config.CONFIG_PATH + "db.js");
var db_model  = require(config.MODEL_PATH + "db.js");
var promotion_model = function(){
	db_model.open(function(db){
		this.db = db;
	}.bind(this));
	this.collection = "promotion";
}

promotion_model.prototype.remove = function(condition,callback){
	if(this.db){
		db_model.remove(this.db,this.collection,condition,callback);
	}
};

promotion_model.prototype.update = function(condition,data,option,callback){
	if(this.db){
		db_model.update(this.db,this.collection,condition,data,option,callback);
	}
};

promotion_model.prototype.insert = function(data,callback){
	if(this.db){
		db_model.insert(this.db,this.collection,data,callback);
	}
};

promotion_model.prototype.find = function(condition,option,callback){
	if(this.db){
		db_model.find(this.db,this.collection,condition,option,callback);
	}
};

promotion_model.prototype.findAllPromotion = function(callback){
	if(this.db){
		this.find({},{},callback);
	}
};

promotion_model.prototype.lotteRemove = function(callback){
	this.remove({company:"lotte"},callback);
}

promotion_model.prototype.cgvRemove = function(callback){
	this.remove({company:"cgv"},callback);
}

promotion_model.prototype.platinumRemove = function(callback){
	this.remove({company:"platinum"},callback);
}

promotion_model.prototype.bhdRemove = function(callback){
	this.remove({company:"bhd"},callback);
}

promotion_model.prototype.galaxyRemove = function(callback){
	this.remove({company:"galaxy"},callback);
}


promotion_model.prototype.lotteInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	for(var i = 0 ; i < data.length ; i++){
		data[i].company = "lotte";
	}
	this.insert(data,callback);
};

promotion_model.prototype.cgvInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	for(var i = 0 ; i < data.length ; i++){
		data[i].company = "cgv";
	}
	this.insert(data,callback);
};

promotion_model.prototype.galaxyInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	for(var i = 0 ; i < data.length ; i++){
		data[i].company = "galaxy";
	}
	this.insert(data,callback);
};

promotion_model.prototype.platinumInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	for(var i = 0 ; i < data.length ; i++){
		data[i].company = "platinum";
	}
	this.insert(data,callback);
};

promotion_model.prototype.bhdInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	for(var i = 0 ; i < data.length ; i++){
		data[i].company = "bhd";
	}
	this.insert(data,callback);
};

module.exports = promotion_model;