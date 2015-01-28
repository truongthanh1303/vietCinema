var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");

var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var promotion_model = require(config.MODEL_PATH + "promotion.js");

var _cgvPromotionParser = require(config.PARSER_PATH+ "cgv_promotion.js");

var cgv_worker = function(){
	this.http = new httpLib();
	this.cgvParser = new _cgvPromotionParser();
	this.promotion_model = new promotion_model();
	if(cgv_config.promotion_link){
		this.link = cgv_config.promotion_link;
	}
	else{
		console.log(colors.red("[Worker/cgv_promotion.js] link not found check cgv_config.promotion_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

cgv_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/cgv_promotion.js] Link not found"));
		return;
	}
	this.getAllPromotion(function(data){
		this.promotion_model.cgvRemove(function(err,result){
			this.promotion_model.cgvInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/cgv_promotion.js] inserted data to Database khoaluan, collection promotion"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.promotion);
				}
				else{
					console.log(colors.red("[Worker/cgv_promotion.js] error on insert data to Database khoaluan, collection promotion"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

cgv_worker.prototype.getAllPromotion = function(callback){
	console.log("[Worker/cgv_promotion.js] Starting getting all promotion of cgv Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var promotion_arr = this.cgvParser.getAllPromotion($);
			this.getPromotionInfo(0,promotion_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

cgv_worker.prototype.getPromotionInfo = function(index,promotion_arr,re,callback){
	if(index == promotion_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	var link = promotion_arr[index].link;
	console.log("[Worker/cgv_promotion.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.cgvParser.getPromotionInfo($);
			info.image  = promotion_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/cgv_promotion.js] Error on getting ",link));
		}
		index++;
		this.getPromotionInfo(index,promotion_arr,re,callback);
	}.bind(this));
};

module.exports = cgv_worker;