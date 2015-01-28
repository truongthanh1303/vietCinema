var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var schedule_model = require(config.MODEL_PATH+"schedule.js");

var _galaxyScheduleParser = require(config.PARSER_PATH+ "galaxy_schedule.js");

var galaxy_worker = function(){
	this.http = new httpLib();
	this.schedule_model = new schedule_model();
	this.galaxyParser = new _galaxyScheduleParser();
	if(galaxy_config.schedule_link){
		this.link = galaxy_config.schedule_link;
	}
	else{
		console.log(colors.red("[Worker/galaxy_schedule.js] link not found check galaxy_config.schedule_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

galaxy_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/galaxy_schedule.js] Link not found"));
		return;
	}
	this.getAllDepartment(function(data){
		this.schedule_model.galaxyRemove(function(err,result){
			this.schedule_model.galaxyInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/galaxy_schedule.js] inserted data to Database khoaluan, collection schedule" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.schedule);
				}
				else{
					console.log(colors.red("[Worker/galaxy_schedule.js] error on insert data to Database khoaluan, collection schedule"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

galaxy_worker.prototype.getAllDepartment = function(callback){
	console.log("[Worker/galaxy_department.js] Start getting schedule of Galaxy Cinema ");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			this.http_option = this.setCookie(this.http_option,res);
			var menu_link = this.galaxyParser.getMenuLink($);
			this.http.get(menu_link,this.http_option,6,function(err,res,body){
				if(!err){
					var $ = cheerio.load(body);
					var departments = this.galaxyParser.getAllScheduleDepartment($);
					this.getAllMovie(0,departments,[],function(data){
						callback(data);
					});
				}
				else
				{
					callback(null);
				}
			}.bind(this));
		}
		else{
			callback(null);
		}
	}.bind(this));
};

galaxy_worker.prototype.getAllMovie = function(index,department_arr,re,callback){
	var department_name = department_arr[index].name;
	console.log("[Worker/galaxy_schedule.js] Getting info of department ",department_name);
	var data = this.setDepartmentParam(department_arr[index].val);
	if(!data){
		console.log(colors.red("[Worker/galaxy_department.js] Can not set param for ",department_name));
		index++;
		if(index == department_arr.length||!galaxy_config.schedule.post_link){
			if(re!=[]){
				callback(re);
			}
			else{
				callback(null);
			}
			return;
		}
		this.getAllMovie(index,department_arr,re,callback);
		return;
	}
	this.http.post(galaxy_config.schedule.post_link,data,this.http_option,3,function(err,res,body){
		if(!err){
			var jsonStr = body.substring(body.indexOf('[{"pk"'),body.lastIndexOf('"}]')+3);
			var movie_arr = null;
			if(body.indexOf('[{"pk"')!=-1){
				movie_arr = JSON.parse(jsonStr);
				this.getAllMovieInfo(department_arr[index].val,0,movie_arr,[],function(data){
					re[department_arr[index].name] = data;
					index++;
					if(index == department_arr.length||!galaxy_config.schedule.post_link){
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
				index++;
				if(index == department_arr.length||!galaxy_config.schedule.post_link){
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
		}
		else{
			console.log(colors.red("[Worker/galaxy_department.js] Error on getting ",department_name));
			index++;
			if(index == department_arr.length||!galaxy_config.schedule.post_link){
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

galaxy_worker.prototype.getAllMovieInfo = function(department_param,index,movie_arr,re,callback){
	if(index == movie_arr.length || !galaxy_config.schedule.post_link){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	console.log("[Worker/galaxy_schedule.js] Getting info of movie ",movie_arr[index].name);
	var data = this.setMovieParam(department_param , movie_arr[index].pk);
	if(!data){
		console.log(colors.red("[Worker/galaxy_department.js] Can not set param for ",movie_arr[index].name));
		index++;
		this.getAllMovieInfo(department_param,index,movie_arr,re,callback);
		return;
	}
	this.http.post(galaxy_config.schedule.post_link,data,this.http_option,3,function(err,res,body){
		if(!err){
			re[movie_arr[index].name] = this.galaxyParser.getMovieTime(body);
		}
		else{
			console.log(colors.red("[Worker/galaxy_department.js] Error on getting ",movie_arr[index].name));
		}
		index++;
		this.getAllMovieInfo(department_param,index,movie_arr,re,callback);
	}.bind(this));
};

galaxy_worker.prototype.setCookie = function(option,res){
	var cookie = res.headers["set-cookie"];
	cookie = cookie[0].split(";")[0];
	option.headers['cookie'] = cookie;
	return option;
};

galaxy_worker.prototype.setDepartmentParam = function(department_param){
	if(!galaxy_config.schedule.department_param_set||!galaxy_config.schedule.department_param){
		console.log(colors.red("[Worker/galaxy_schedule.js] link not found check !galaxy_config.schedule.department_param_set||!galaxy_config.schedule.department_param"));
		return null;
	}
	var param = {};
	for( var i in galaxy_config.schedule.department_param_set){
		param[i] = galaxy_config.schedule.department_param_set[i];
	}
	param[galaxy_config.schedule.department_param] = department_param;
	return param;
};

galaxy_worker.prototype.setMovieParam = function(department_param,movie_param){
	if(!galaxy_config.schedule.movie_param_set||!galaxy_config.schedule.department_param ||!galaxy_config.schedule.movie_param){
		console.log(colors.red("[Worker/galaxy_schedule.js] link not found check !galaxy_config.schedule.movie_param_set||!galaxy_config.schedule.department_param ||!galaxy_config.schedule.movie_param"));
		return null;
	}
	var param = {};
	for( var i in galaxy_config.schedule.movie_param_set){
		param[i] = galaxy_config.schedule.movie_param_set[i];
	}
	param[galaxy_config.schedule.department_param] = department_param;
	param[galaxy_config.schedule.movie_param] = movie_param;
	return param;
};

module.exports = galaxy_worker;