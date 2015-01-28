var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var cinema_model = require(config.MODEL_PATH+"cinema.js"); 

var _galaxyDepartmentParser = require(config.PARSER_PATH+ "galaxy_department.js");

var galaxy_worker = function(){
	this.http = new httpLib();
	this.galaxyParser = new _galaxyDepartmentParser();
	this.cinema_model = new cinema_model();
	if(galaxy_config.department_link){
		this.link = galaxy_config.department_link;
	}
	else{
		console.log(colors.red("[Worker/galaxy_department.js] link not found check galaxy_config.department_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

galaxy_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/galaxy_department.js] Link not found"));
		return;
	}
	this.getAllDepartment(function(data){
		this.cinema_model.galaxyRemove(function(err,result){
			this.cinema_model.galaxyInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/galaxy_department.js] Inserted data to Database khoaluan , Collection cinema"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.department);
				}
				else{
					console.log(colors.red("[Worker/galaxy_department.js] Error on inserting data"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

galaxy_worker.prototype.getAllDepartment = function(callback){
	console.log("[Worker/galaxy_department.js] Start getting all department of Galaxy Cinema ");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);		
			var department_arr = this.galaxyParser.getAllDepartment($);
			this.getAllDepartmentInfo(0,department_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

galaxy_worker.prototype.getAllDepartmentInfo = function(index,department_arr,re,callback){
	if(index == department_arr.length || !galaxy_config.department_link){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	var link = galaxy_config.department.post_link ;
	console.log("[Worker/galaxy_department.js] Getting info of department : ",department_arr[index].name);
	var data = this.setDepartmentParam(department_arr[index].val);
	if(!data){
		console.log(colors.red("[Worker/galaxy_department.js] Can not set param for ",link));
		index++;
		this.getAllDepartmentInfo(index,department_arr,re,callback);
		return;
	}
	this.http.post(link,data,this.http_option,3,function(err,res,body){
		if(!err){
			var info =  this.galaxyParser.getDepartmentInfo(body);
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/galaxy_department.js] Error on getting ",link));
		}
		index++;
		this.getAllDepartmentInfo(index,department_arr,re,callback);
	}.bind(this));
};

galaxy_worker.prototype.setDepartmentParam = function(department_param){
	if(!galaxy_config.department.param_set||!galaxy_config.department.param){
		return null;
	}
	var param = {};
	for( var i in galaxy_config.department.param_set){
		param[i] = galaxy_config.department.param_set[i];
	}
	param[galaxy_config.department.param] = department_param;
	return param;
};

module.exports = galaxy_worker;