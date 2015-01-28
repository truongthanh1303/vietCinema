var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var schedule_model = require(config.MODEL_PATH+"schedule.js");
	
var _cgvScheduleParser = require(config.PARSER_PATH+ "cgv_schedule.js");

var cgv_worker = function(){
	this.http = new httpLib();
	this.schedule_model = new schedule_model();
	this.cgvParser = new _cgvScheduleParser();
	this.link = cgv_config.schedule_link;
	if(cgv_config.schedule_link){
		this.link = cgv_config.schedule_link;
	}
	else{
		console.log(colors.red("[Worker/cgv_schedule.js] link not found check cgv_config.schedule_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

cgv_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/cgv_schedule.js] Link not found"));
		return;
	}
	this.getAllDepartment(function(data){
		if(data){
			this.schedule_model.cgvRemove(function(err,result){
				this.schedule_model.cgvInsert(data,function(err,result){
					if(!err){
						console.log(colors.green("[Worker/cgv_schedule.js] inserted data to Database khoaluan, collection schedule"));
						setTimeout(function(){
							this.start();
						}.bind(this),config.timeout.schedule);
					}
					else{
						console.log(colors.red("[Worker/cgv_schedule.js] error on insert data to Database khoaluan, collection schedule"));
						setTimeout(function(){
							this.start();
						}.bind(this),config.timeout.error);
					}
				}.bind(this));
			}.bind(this));
		}
		else{
			console.log(colors.red("[Worker/cgv_schedule.js] error on get ",this.link));
		}
	}.bind(this));
};

cgv_worker.prototype.getAllDepartment = function(callback){
	console.log("[Worker/cgv_schedule.js] Starting getting schedule of CGV Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			this.department_arr = this.cgvParser.getAllScheduleDepartment($);
			this.getAllMovie(0,this.department_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
}

cgv_worker.prototype.getAllMovie = function(index,department_arr,re,callback){
	var link = department_arr[index].link;
	console.log("[Worker/cgv_schedule.js] Getting info of CGV cinema ", department_arr[index].name);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.cgvParser.getAllScheduleMovie($);	
			this.getAllTime(0,movie_arr,[],function(result){
				re[department_arr[index].name] = result;
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
			console.log(colors.red("[Worker/cgv_schedule.js] Error on getting ",link));
		}
	}.bind(this));
}

cgv_worker.prototype.getAllTime = function(index,movie_arr,re,callback){
	if(index == movie_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	var link = movie_arr[index].link;
	console.log("[Worker/cgv_schedule.js] Getting info of movie ", movie_arr[index].name);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var time_arr = this.cgvParser.getAllScheduleTime($);
			re[movie_arr[index].name] = time_arr;
		}
		else{
			console.log(colors.red("[Worker/cgv_schedule.js] Error on getting ",link));
		}
		index++;
		this.getAllTime(index,movie_arr,re,callback);
	}.bind(this));
}

module.exports = cgv_worker;