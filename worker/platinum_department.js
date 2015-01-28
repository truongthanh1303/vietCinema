var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var cinema_model = require(config.MODEL_PATH+"cinema.js");
	
var _platinumDepartmentParser = require(config.PARSER_PATH+ "platinum_department.js");

var platinum_worker = function(){
	this.http = new httpLib();
	this.platinumParser = new _platinumDepartmentParser();
	this.cinema_model = new cinema_model;
	if(platinum_config.department_link){
		this.link = platinum_config.department_link;
	}
	else{
		console.log(colors.red("[Worker/platinum_department.js] link not found check platinum_config.department_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

platinum_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/platinum_department.js] Link not found"));
		return;
	}
	console.log("[Worker/platinum_department.js] Gettting all department of Platinum cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var department_arr = this.platinumParser.getAllDepartment($);
			this.getAllDepartmentInfo(0,department_arr,[],function(data){
				this.cinema_model.platinumRemove(function(err,res){
					this.cinema_model.platinumInsert(data,function(err,result){
						if(!err){
							console.log(colors.green("[Worker/platinum_department.js] Inserted data to Database khoaluan , Collection cinema"));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.department);
						}
						else{
							console.log(colors.red("[Worker/platinum_department.js] Error on inserting data"));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.error);
						}
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}
		/*else{
			setTimeout(function(){
				this.start();
			}.bind(this),config.timeout.error);
		}*/
	}.bind(this));
};

platinum_worker.prototype.getAllDepartmentInfo = function(index,department_arr,re,callback){
	if(index == department_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	var link = department_arr[index].link;
	console.log("[Worker/platinum_department.js] Getting info of ",department_arr[index].name);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.platinumParser.getDepartmentInfo($);
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/lotte_commingSoonMovie.js] Error on getting ",link));
		}
		index++;
		this.getAllDepartmentInfo(index,department_arr,re,callback);
	}.bind(this));
	
}
module.exports = platinum_worker;