var cheerio = require("cheerio"),
	colors = require("colors");
var http = require("http");
var request = require("request");

var config 	= require("./../config/config.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var schedule_model = require(config.MODEL_PATH+"schedule.js");

var bhd_worker = function(){
	this.http = new httpLib();
	this.schedule_model = new schedule_model();
	if(bhd_config.schedule_link){
		this.link = bhd_config.schedule_link;
	}
	else{
		console.log(colors.red("[Worker/bhd_schedule.js] link not found check bhd_config.schedule_link"))
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

bhd_worker.prototype.start = function(option){
	this.http_option = option;
	if(!this.http_option){
		console.log(colors.red("[Worker/bhd_schedule.js] Can not set cookie"));
		return;
	}
	if(!this.link){
		console.log(colors.red("[Worker/bhd_schedule.js] Link not found"));
		return;
	}
	this.getAllDepartment(function(data){
		this.schedule_model.bhdRemove(function(err,result){
			this.schedule_model.bhdInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/bhd_schedule.js] inserted data to Database khoaluan, collection schedule" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.schedule);
				}
				else{
					console.log(colors.red("[Worker/bhd_schedule.js] error on insert data to Database khoaluan, collection schedule"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

bhd_worker.prototype.getAllDepartment = function(callback){
	console.log("[Worker/bhd_schedule.js] Getting all department of BHD cineplex...");
	var link = this.link + this.setDepartmentParam();
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			body = body.substring(body.indexOf("["), body.length);
			var department_obj = JSON.parse(body);
			var re = [];
			for(var i in department_obj){
				var obj = {};
				obj.name = textLib.clearBlankSpace(" " + department_obj[i].title + " ");
				obj.val = department_obj[i].id;
				re.push(obj);
			}
			this.getAllMovie(0,re,[],function(data){
				callback(data);
				return;
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

bhd_worker.prototype.getAllMovie = function(index,department_arr,re,callback){
	console.log("[Worker/bhd_schedule.js]  Getting all movie of BHD cineplex",department_arr[index].name);
	var link = this.link + this.setMovieParam(department_arr[index].val);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			body = body.substring(body.indexOf("["), body.length);
			var movie_obj = JSON.parse(body);
			var movie_arr = [];
			for(var i in movie_obj){
				var obj = {};
				obj.name = movie_obj[i].title;
				obj.val = movie_obj[i].id;
				movie_arr.push(obj);
			}	
			this.getAllDate(0,movie_arr,department_arr[index],[],function(data){
				re[department_arr[index].name] = data;
				index++;
				if(index == department_arr.length){
					if(re!=[]){
						callback(re);
					}
					else{
						callback(null);
					}
					return;
				}
				this.getAllMovie(index,department_arr,re,callback);
			}.bind(this));
		}
		else{
			console.log(colors.red("[Worker/bhd_schedule.js] Error on getting ",link));
			index++;
			if(index == department_arr.length){
				if(re!=[]){
					callback(re);
				}
				else{
					callback(null);
				}
				return;
			}
			this.getAllMovie(index,department_arr,re,callback);
		}
	}.bind(this));
};

bhd_worker.prototype.getAllDate = function(index,movie_arr,department,re,callback){
	console.log("[Worker/bhd_schedule.js] Getting all date of movie",movie_arr[index].name);
	var link = this.link + this.setDateParam(department.val,movie_arr[index].val);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			body = body.substring(body.indexOf("["), body.length);
			var date_obj = JSON.parse(body);
			var date_arr = [];
			for(var i in date_obj){
				var obj = {};
				obj.name = date_obj[i].title;
				obj.val = date_obj[i].id;
				date_arr.push(obj);
			}
			this.getAllTime(0,date_arr,department,movie_arr[index],[],function(data){
				re[movie_arr[index].name] = data;
				index++;
				if(index == movie_arr.length){
					if(re!=[]){
						callback(re);
					}
					else{
						callback(null);
					}
					return;
				}
				this.getAllDate(index,movie_arr,department,re,callback);
			}.bind(this));
		}
		else{
			console.log(colors.red("[Worker/bhd_schedule.js] Error on getting ",link));
			index++;
			if(index == movie_arr.length){
				if(re!=[]){
					callback(re);
				}
				else{
					callback(null);
				}
				return;
			}
			this.getAllDate(index,movie_arr,department,re,callback);
		}
	}.bind(this));
};

bhd_worker.prototype.getAllTime = function(index,date_arr,department,movie,re,callback){
	if(index == date_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	console.log("[Worker/bhd_schedule.js] Getting all time of movie",movie.name," date ",date_arr[index].name);
	var link = this.link + this.setTimeParam(department.val,movie.val,date_arr[index].val);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			body = body.substring(body.indexOf("["), body.length);
			var time_obj = JSON.parse(body);
			var time_arr = [];
			for(var i in time_obj){
				time_arr.push(time_obj[i].extra.starttime);
			}
			re[date_arr[index].name] = time_arr;
		}
		else{
			console.log(colors.red("[Worker/bhd_schedule.js] Error on getting ",link));
		}
		index++;
		this.getAllTime(index,date_arr,department,movie,re,callback);
	}.bind(this));
};


bhd_worker.prototype.setCookie = function(option,callback){
	var link = this.link + this.setDepartmentParam();
	http.get(link,function(res){
		var cookie = res.headers['set-cookie'][0].split(";")[0];
		option.headers["cookie"] = cookie;
		callback(option);
		return;
	}).on("error",function(err){
		callback(null);
		return;
	});
};

bhd_worker.prototype.setParam = function(){
	if(!bhd_config.schedule.param_set){
		return "";
	}
	var query = "?";
	for(var i in bhd_config.schedule.param_set){
		query = query + i + "=" + bhd_config.schedule.param_set[i]+"&";
	}
	query = query.substring(0,query.length-1);
	return query;
};

bhd_worker.prototype.setDepartmentParam = function(){
	if(!bhd_config.schedule.department_param_set){
		return "";
	}
	var query = this.setParam();
	for(var i in bhd_config.schedule.department_param_set){
		query =  query + "&" + i + "=" + bhd_config.schedule.department_param_set[i]+"&";
	}
	query = query.substring(0,query.length-1);
	return query;
}

bhd_worker.prototype.setMovieParam = function(departmentId){
	if(!bhd_config.schedule.movie_param_set||!bhd_config.schedule.movie_param){
		return "";
	}
	var query = this.setParam();
	for(var i in bhd_config.schedule.movie_param_set){
		query =  query + "&" + i + "=" + bhd_config.schedule.movie_param_set[i]+"&";
	}
	query = query + bhd_config.schedule.movie_param + "=" + departmentId;
	return query;
}

bhd_worker.prototype.setDateParam = function(departmentId,movieId){
	if(!bhd_config.schedule.date_param_set||!bhd_config.schedule.date_param){
		return "";
	}
	var query = this.setMovieParam(departmentId);
	for(var i in bhd_config.schedule.date_param_set){
		query =  query + "&" + i + "=" + bhd_config.schedule.date_param_set[i]+"&";
	}
	query = query + bhd_config.schedule.date_param + "=" + movieId;
	return query;
}

bhd_worker.prototype.setTimeParam = function(departmentId,movieId,dateId){
	if(!bhd_config.schedule.time_param_set||!bhd_config.schedule.time_param){
		return "";
	}
	var query = this.setDateParam(departmentId,movieId);
	for(var i in bhd_config.schedule.time_param_set){
		query =  query + "&" + i + "=" + bhd_config.schedule.time_param_set[i]+"&";
	}
	query = query + bhd_config.schedule.time_param + "=" + dateId;
	return query;
}

module.exports = bhd_worker;