var colors = require("colors");
var config = require("./../config/config.js"),
	_dbLib = require(config.LIB_PATH + "db.js"),
	_dbConfig = require(config.CONFIG_PATH + "db.js");
var db_model  = require(config.MODEL_PATH + "db.js");
var schedule_model = function(){
	db_model.open(function(db){
		this.db = db;
	}.bind(this));
	this.collection = "schedule";
}

schedule_model.prototype.aggregate = function(match, group, callback){
	if(this.db){
		db_model.aggregate(this.db, this.collection, match, group, callback);
	}
}

schedule_model.prototype.remove = function(condition,callback){
	if(this.db){
		db_model.remove(this.db,this.collection,condition,callback);
	}
};

schedule_model.prototype.update = function(condition,data,option,callback){
	if(this.db){
		db_model.update(this.db,this.collection,condition,data,option,callback);
	}
};

schedule_model.prototype.insert = function(data,callback){
	if(this.db){
		db_model.insert(this.db,this.collection,data,callback);
	}
};

schedule_model.prototype.find = function(condition,option,callback){
	if(this.db){
		db_model.find(this.db,this.collection,condition,option,callback);
	}
};

schedule_model.prototype.distinct = function(key,query,option,callback){
	if(this.db){
		db_model.distinct(this.db,this.collection,key,query,option,callback);
	}
};


schedule_model.prototype.findAllSchedule = function(callback){
	if(this.db){
		this.find({},{sort:['cinema','asc',"movie",'asc',"date",'asc','company','asc']},callback);
	}
};


schedule_model.prototype.lotteRemove = function(callback){
	this.remove({company:"lotte"},callback);
}

schedule_model.prototype.cgvRemove = function(callback){
	this.remove({company:"cgv"},callback);
}

schedule_model.prototype.platinumRemove = function(callback){
	this.remove({company:"platinum"},callback);
}

schedule_model.prototype.bhdRemove = function(callback){
	this.remove({company:"bhd"},callback);
}

schedule_model.prototype.galaxyRemove = function(callback){
	this.remove({company:"galaxy"},callback);
}

schedule_model.prototype.lotteInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	var re = [];
	for(var department in data){
		for( var date in data[department]){
			for( var movie in data[department][date]){
				var obj = {};
				obj.company = "lotte";
				obj.cinema = department;
				obj.movie = movie;
				var dateArr=   date.split("-");
				obj.date = dateArr[2] + "/"+dateArr[1] + "/"+dateArr[0];
				obj.time = data[department][date][movie];
				re.push(obj);
			}
		}
	}
	this.insert(re,callback);
};

schedule_model.prototype.cgvInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	var re = [];
	for(var department in data){
		for( var movie in data[department]){
			for( var index in data[department][movie]){
				var obj = {};
				obj.company = "cgv";
				obj.cinema = department;
				obj.movie = movie;
				obj.date = data[department][movie][index].date;
				obj.time = data[department][movie][index].time;
				re.push(obj);
			}
		}
	}
	this.insert(re,callback);
};

schedule_model.prototype.galaxyInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	var re = [];
	for(var department in data){
		for( var movie in data[department]){
			for( var date in data[department][movie]){
				var obj = {};
				obj.company = "galaxy";
				obj.cinema = department;
				obj.movie = movie;
				obj.date = date.split(", ")[1].replace(/\-/g,"/");
				obj.time = data[department][movie][date]
				re.push(obj);
			}
		}
	}
	this.insert(re,callback);
};

schedule_model.prototype.platinumInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	var currentYear = (new Date()).getFullYear();
	var re = [];
	for(var department in data){
		for( var movie in data[department]){
			for( var date in data[department][movie]){
				var obj = {};
				obj.company = "platinum";
				obj.cinema = department;
				obj.movie = movie;
				obj.date = date.split(" - ")[0] + "/" + currentYear;
				obj.time = data[department][movie][date];
				re.push(obj);
			}
		}
	}
	this.insert(re,callback);
};

schedule_model.prototype.bhdInsert = function(data,callback){
	if(!data){
		callback(true);
		return;
	}
	var re = [];
	for(var department in data){
		for( var movie in data[department]){
			for( var date in data[department][movie]){
				var obj = {};
				obj.company = "bhd";
				obj.cinema = department;
				obj.movie = movie;
				obj.date = date;
				obj.time = data[department][movie][date];
				re.push(obj);
			}
		}
	}
	this.insert(re,callback);
};

module.exports = schedule_model;