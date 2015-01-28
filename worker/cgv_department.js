var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var cinema_model = require(config.MODEL_PATH + "cinema.js");
	
var _cgvScheduleParser = require(config.PARSER_PATH+ "cgv_department.js");

var cgv_worker = function(){
	this.http = new httpLib();
	this.cgvParser = new _cgvScheduleParser();
	this.link = cgv_config.department_link;
	this.cinema_model = new cinema_model();
	if(cgv_config.department_link){
		this.link = cgv_config.department_link;
	}
	else{
		console.log(colors.red("[Worker/cgv_department.js] link not found check cgv_config.department_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

cgv_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/cgv_department.js] Link not found"));
		return;
	}
	this.getAllDepartment(function(data){
		this.cinema_model.cgvRemove(function(err,result){
			this.cinema_model.cgvInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/cgv_department.js] inserted data to Database khoaluan, collection cinema" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.department);
				}
				else{
					console.log(colors.red("[Worker/cgv_department.js] error on insert data to Database khoaluan, collection cinema"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

cgv_worker.prototype.getAllDepartment = function(callback){
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			this.department_arr = this.cgvParser.getAllDepartment($);
			this.getDepartmentInfo(0,this.department_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
}

cgv_worker.prototype.getDepartmentInfo = function(index,department_arr,re,callback){
	if(index == department_arr.length){
		callback(re);
		return;
	}
	var link = department_arr[index].link;
	console.log("[Worker/cgv_department.js] Getting info of CGV cinema department", department_arr[index].name);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.cgvParser.getDepartmentInfo($);
			info.name = department_arr[index].name;
			info.image = department_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/cgv_department.js] Error on getting ",link));
		}
		index++;	
		this.getDepartmentInfo(index,department_arr,re,callback);
	}.bind(this));
}

module.exports = cgv_worker;