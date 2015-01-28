var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var _lotteDepartmentParser = require(config.PARSER_PATH+ "lotte_department.js");

var _cinema_model = require(config.MODEL_PATH+"cinema.js");

var lotte_worker = function(){
	this.http = new httpLib();
	this.cinema_model = new _cinema_model();
	this.lotteParser = new _lotteDepartmentParser();
	this.link = lotte_config.department_link;
	if(lotte_config.department_link){
		this.link = lotte_config.department_link;
	}
	else{
		console.log(colors.red("[Worker/lotte_department.js] link not found check lotte_config.department_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
	this.department_arr = [];
}

lotte_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/lotte_department.js] Link not found"));
		return;
	}
	console.log("[Worker/lotte_department.js] Start getting all lotte cinema department ^^!");
	this.http.get(this.link,this.http_option,6,(function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var departments = this.lotteParser.getAllDepartment($);
			this.getAllDepartmentInfo(0,departments,[],function(data){
				this.cinema_model.lotteRemove(function(err,result){
					this.cinema_model.lotteInsert(data,function(err,result){
						if(!err){
							console.log(colors.green("[Worker/lotte_department.js] Inserted data to Database khoaluan , Collection cinema"));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.department);
						}
						else{
							console.log(colors.red("[Worker/lotte_department.js] Error on inserting data"));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.error);
						}
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}
	}).bind(this));
	
}

lotte_worker.prototype.getAllDepartmentInfo = function(index,department_arr,re,callback){
	if(index == department_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	var link = department_arr[index];
	console.log("[Worker/lotte_department.js] go to link : ",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.lotteParser.getInfo($);
			re.push(info);
		}
		else{
			console.log("[Worker/lotte_department.js] Error on getting ",link);
		}
		index++;
		this.getAllDepartmentInfo(index,department_arr,re,callback);
	}.bind(this));
}
module.exports = lotte_worker;