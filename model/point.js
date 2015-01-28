var colors = require("colors");
var config = require("./../config/config.js"),
	_dbConfig = require(config.CONFIG_PATH + "db.js");
var db_model  = require(config.MODEL_PATH + "db.js");
var kindPoint_model = function(){
	db_model.open(function(db){
		this.db = db;
	}.bind(this));
	this.collection = "kindPoint";
}

kindPoint_model.prototype.distinct = function(key,query,callback){
	if(this.db){	
		db_model.distinct(this.db,this.collection,key,query,{},callback);
	}
};

kindPoint_model.prototype.remove = function(condition,callback){
	if(this.db){	
		db_model.remove(this.db,this.collection,condition,callback);
	}
};

kindPoint_model.prototype.update = function(condition,data,option,callback){
	if(this.db){
		db_model.update(this.db,this.collection,condition,data,option,callback);
	}
};

kindPoint_model.prototype.insert = function(data,callback){
	if(this.db){
		db_model.insert(this.db,this.collection,data,callback);
	}
};

kindPoint_model.prototype.find = function(condition,option,callback){
	if(this.db){
		db_model.find(this.db,this.collection,condition,option,callback);
	}
};

kindPoint_model.prototype.update_kindPoint = function(kind_arr,callback){
	for(var i in kind_arr){
		for (var j in kind_arr[i]){
			kind_arr[i][j] = parseInt(kind_arr[i][j]);
		}
	}
	this.update({},{$set:{"kind_arr":kind_arr}},{upsert:true,multi:true},callback);
}

kindPoint_model.prototype.findAll_point = function(callback){
	this.find({},{},callback);
}
kindPoint_model.prototype.update_jobPoint = function(job_arr,callback){
	for(var i in job_arr){
		for (var j in job_arr[i]){
			job_arr[i][j] = parseInt(job_arr[i][j]);
		}
	}
	this.update({},{$set:{"job_arr":job_arr}},{upsert:true,multi:true},callback);
}

kindPoint_model.prototype.update_rankPoint = function(rank_arr,callback){
	for(var i in rank_arr){
		rank_arr[i] = parseInt(rank_arr[i]);
	}
	this.update({},{$set:{"rank_arr":rank_arr}},{upsert:true,multi:true},callback);
}

module.exports = kindPoint_model;