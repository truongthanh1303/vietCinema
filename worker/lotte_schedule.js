var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var schedule_model = require(config.MODEL_PATH+"schedule.js");
	
var _lotteScheduleParser = require(config.PARSER_PATH+ "lotte_schedule.js");

var lotte_worker = function(){
	this.http = new httpLib();
	this.schedule_model = new schedule_model();
	this.lotteParser = new _lotteScheduleParser();
	if(lotte_config.schedule_link){
		this.link = lotte_config.schedule_link;
	}
	else{
		console.log(colors.red("[Worker/lotte_schedule.js] link not found check lotte_config.schedule_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
	this.department_arr = [];
}

lotte_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/lotte_schedule.js] Link not found"));
		return;
	}
	console.log("[Worker/lotte_schedule.js] Start getting info from lotte cinema ^^!");
	this.http.get(this.link,this.http_option,6,(function(err,res,body){
		if(!err){
			this.http_option = this.setCookie(res,this.http_option);
			this.$ = cheerio.load(body);
			department_arr = this.lotteParser.getAllDepartment(this.$);
			this.getAllDepartmentInfo(0,department_arr,[],function(data){
				this.schedule_model.lotteRemove(function(err,result){
					this.schedule_model.lotteInsert(data,function(err,result){
						if(!err){
							console.log(colors.green("[Worker/lotte_schedule.js] inserted data to Database khoaluan, collection schedule" ));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.schedule);
						}
						else{
							console.log(colors.red("[Worker/lotte_schedule.js] error on insert data to Database khoaluan, collection schedule"));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.error);
						}
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}
		else{
			console.log(colors.red("[Worker/lotte_schedule.js] error on get",this.link));
		}
	}).bind(this));
	
}

lotte_worker.prototype.setCookie = function(res,option)
{
	option.headers["cookie"] = res.headers["set-cookie"][0].split(";")[0];
	return option;
}

lotte_worker.prototype.setParamDepartment  = function($,departmentValue){
	if(!lotte_config.param || !lotte_config.param_set || ! lotte_config.query_department)
	{
		console.log(colors.red("check config !lotte_config.param || !lotte_config.param_set || ! lotte_config.query_department"));
		return null;
	}
	var lotte_param = lotte_config.param;
	var lotte_param_set = lotte_config.param_set;
	var lotte_query_department = lotte_config.query_department;
	var lotte_post_data = {
	};
	for(var i = 0 ; i < lotte_param.length ; i++){
			lotte_post_data[lotte_param[i]] = $("#"+lotte_param[i]).length?$("#"+lotte_param[i]).val():"";
	}
	for(var i in lotte_param_set){
			lotte_post_data[i] = lotte_param_set[i];
	}
	lotte_post_data[lotte_query_department] = departmentValue;
	return lotte_post_data;
}

lotte_worker.prototype.setParamDate = function($,departmentValue,date){
	if(!lotte_config.date)
	{
		console.log(colors.red("check config lotte_config.date"));
		return null;
	}
	var lotte_query_date = lotte_config.query_date;
	var lotte_post_data = this.setParamDepartment($,departmentValue);
	lotte_post_data[lotte_query_date] = date;
	return lotte_post_data;
}

lotte_worker.prototype.getAllDepartmentInfo = function(index,department_arr,re,callback){
	console.log("[Worker/lotte_schedule.js] Getting info of lotte cinema " + department_arr[index].name + "...");
	var post_data = this.setParamDepartment(this.$,department_arr[index].val);
	if(!post_data){
		console.log(colors.red("[Worker/lotte_schedule.js] Can not set param for ",department_arr[index].name));
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
		getAllDepartmentInfo(index,department_arr,re,callback);
	}
	this.http.post(this.link,post_data,this.http_option,3,(function(err,res,body){
		if(!err){
			this.$ = cheerio.load(body);
			//re[this.department_arr[index].name]   this.lotteParser.getALlDate(this.$);
			var date_arr = this.lotteParser.getALlDate(this.$);
			this.getDateInfo(0,date_arr,department_arr[index],[],(function(data){
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
				this.getAllDepartmentInfo(index,department_arr,re,callback);
			}).bind(this));
		}
		else{
			console.log(colors.red("[Worker/lotte_schedule.js] Error on getting info for ",department_arr[index].name));
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
			this.getAllDepartmentInfo(index,department_arr,re,callback);
		}
	}).bind(this));
}

lotte_worker.prototype.getDateInfo = function(index,date_arr,department,re,callback){
	if(index == date_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	console.log("[Worker/lotte_schedule.js] Getting info of lotte cinema " + department.name+ " in date : " +date_arr[index] + "...");
	var post_data = this.setParamDate(this.$,department.val,date_arr[index]);
	if(!post_data){
		console.log(colors.red("[Worker/lotte_schedule.js] Can not set param for ",department_arr[index].name));
		index++;
		getDateInfo(index,date_arr,department,re,callback);
	}
	this.http.post(this.link,post_data,this.http_option,3,(function(err,res,body){
		if(!err){
			this.$ = cheerio.load(body);
			re[date_arr[index]] = this.lotteParser.getSchedule(this.$);
		}
		else{
			console.log(colors.red("[Worker/lotte_schedule.js] Error on getting info for "+department.name+ " in date : " +date_arr[index]));
		}
		index++;
		this.getDateInfo(index,date_arr,department,re,callback);
	}).bind(this));
}

module.exports = lotte_worker;