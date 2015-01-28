var colors = require("colors");
var config = require("./../config/config.js"),
	_dbConfig = require(config.CONFIG_PATH + "db.js");
var db_model  = require(config.MODEL_PATH + "db.js");
var user_model = function(){
	db_model.open(function(db){
		this.db = db;
	}.bind(this));
	this.collection = "user";
}

user_model.prototype.remove = function(condition,callback){
	if(this.db){	
		db_model.remove(this.db,this.collection,condition,callback);
	}
};

user_model.prototype.update = function(condition,data,option,callback){
	if(this.db){
		db_model.update(this.db,this.collection,condition,data,option,callback);
	}
};

user_model.prototype.insert = function(data,callback){
	if(this.db){
		db_model.insert(this.db,this.collection,data,callback);
	}
};

user_model.prototype.find = function(condition,option,callback){
	if(this.db){
		db_model.find(this.db,this.collection,condition,option,callback);
	}
};

user_model.prototype.updateUser = function(user,callback){
	if(user.password.length){
		this.update({username:user.username},{$set:{password:user.password,email:user.email,gender:user.gender,"birthday-year":user["birthday-year"],"favorite-company":user["favorite-company"],"favorite-player":user["favorite-player"],"favorite-director":user["favorite-director"],"favorite-cinema":user["favorite-cinema"],"favorite-kind":user["favorite-kind"],job:user.job}},{w:1},callback);
	}
	else{
		this.update({username:user.username},{$set:{email:user.email,gender:user.gender,"birthday-year":user["birthday-year"],"favorite-company":user["favorite-company"],"favorite-player":user["favorite-player"],"favorite-director":user["favorite-director"],"favorite-cinema":user["favorite-cinema"],"favorite-kind":user["favorite-kind"],job:user.job}},{w:1},callback);
	}
}

user_model.prototype.insertUser = function(data,callback){
	this.insert(data,callback);
}

user_model.prototype.findUser = function(username,password,callback){
	this.find({username:username,password:password},{},callback);
}

user_model.prototype.findUsername = function(Username,callback){
	this.find({username:Username},{},callback);
}
user_model.prototype.findEmail = function(email,callback){
	this.find({email:email},{},callback);
}
module.exports = user_model;