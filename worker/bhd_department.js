var cheerio = require("cheerio"),
	colors = require("colors");
var http = require("http");
var config 	= require("./../config/config.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var cinema_model = require(config.MODEL_PATH + "cinema.js");
	
var _bhdDepartmentParser = require(config.PARSER_PATH+ "bhd_department.js");

var bhd_worker = function(){
	this.http = new httpLib();
	this.bhdParser = new _bhdDepartmentParser();
	this.cinema_model = new cinema_model();
	if(bhd_config.department_link){
		this.link = bhd_config.department_link;
	}
	else{
		console.log(colors.red("[Worker/bhd_department.js]link not found check bhd_config.department_link"))
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

bhd_worker.prototype.start = function(option){
	this.http_option = option;
	if(!this.http_option){
		console.log(colors.red("[Worker/bhd_department.js] Can not set cookie"));
		return;
	}
	if(!this.link){
		console.log(colors.red("[Worker/bhd_department.js] Link not found"));
		return;
	}
	console.log("[Worker/bhd_department.js] Start getting all department of BHD cinema");
	this.getAllDepartment(function(data){
		this.cinema_model.bhdRemove(function(err,result){
			this.cinema_model.bhdInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/bhd_department.js] inserted data to Database khoaluan, collection cinema"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.department);
				}
				else{
					console.log(colors.red("[Worker/bhd_department.js] error on insert data to Database khoaluan, collection cinema"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

bhd_worker.prototype.getAllDepartment = function(callback){
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);		
			var department_arr = this.bhdParser.getAllDepartment($);
			callback(department_arr);
			return;
		}
		callback(null);
	}.bind(this));
};

bhd_worker.prototype.setCookie = function(option,callback){
	http.get(this.link,function(res){
		var cookie = res.headers['set-cookie'][0].split(";")[0];
		option.headers["cookie"] = cookie;
		callback(option);
		return;
	}).on("error",function(err){
		callback(null);
		return;
	});
};


module.exports = bhd_worker;