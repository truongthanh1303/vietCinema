var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var schedule_model = require(config.MODEL_PATH+"schedule.js");
	
var _platinumScheduleParser = require(config.PARSER_PATH+ "platinum_schedule.js");

var platinum_worker = function(){
	this.http = new httpLib();
	this.schedule_model = new schedule_model();
	this.platinumParser = new _platinumScheduleParser();
	this.link = platinum_config.schedule_link;
	if(platinum_config.schedule_link){
		this.link = platinum_config.schedule_link;
	}
	else{
		console.log(colors.red("[Worker/platinum_schedule.js] link not found check platinum_config.schedule_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

platinum_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/platinum_schedule.js] Link not found"));
		return;
	}
	console.log("[Worker/platinum_schedule.js] Gettting all info of Platinum cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			console.log("Parsing data...");
			var $ = cheerio.load(body);
			this.platinumParser.getAllInfo($,function(data){
				this.schedule_model.platinumRemove(function(err,result){
					this.schedule_model.platinumInsert(data,function(err,result){
						if(!err){
							console.log(colors.green("[Worker/platinum_schedule.js] inserted data to Database khoaluan, collection schedule" ));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.schedule);
						}
						else{
							console.log(colors.red("[Worker/platinum_schedule.js] error on insert data to Database khoaluan, collection schedule"));
							setTimeout(function(){
								this.start();
							}.bind(this),config.timeout.error);
						}
					}.bind(this));
				}.bind(this));	
			}.bind(this));
		}
	}.bind(this));
};


module.exports = platinum_worker;