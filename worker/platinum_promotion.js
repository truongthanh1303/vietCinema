var cheerio = require("cheerio"),
	colors = require("colors");
var config 	= require("./../config/config.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");

var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var promotion_model = require(config.MODEL_PATH + "promotion.js");

var _platinumPromotionParser = require(config.PARSER_PATH+ "platinum_promotion.js");

var platinum_worker = function(){
	this.http = new httpLib();
	this.platinumParser = new _platinumPromotionParser();
	this.promotion_model = new promotion_model();
	if(platinum_config.promotion_link){
		this.link = platinum_config.promotion_link;
	}
	else{
		console.log(colors.red("[Worker/platinum_promotion.js] link not found check platinum_config.promotion_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

platinum_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/platinum_promotion.js] Link not found"));
		return;
	}
	this.getAllPromotion(function(data){
		this.promotion_model.platinumRemove(function(err,result){
			this.promotion_model.platinumInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/platinum_promotion.js] inserted data to Database khoaluan, collection promotion" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.promotion);
				}
				else{
					console.log(colors.red("[Worker/platinum_promotion.js] error on insert data to Database khoaluan, collection promotion"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

platinum_worker.prototype.getAllPromotion = function(callback){
	console.log("[Worker/platinum_promotion.js] Starting getting all promotion of Platinum Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.platinumParser.getAllPromotion($);
			this.getPromotionInfo(0,movie_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

platinum_worker.prototype.getPromotionInfo = function(index,movie_arr,re,callback){
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
	console.log("[Worker/platinum_promotion.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.platinumParser.getPromotionInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/lotte_commingSoonMovie.js] Error on getting ",link));
		}
		index++;
		this.getPromotionInfo(index,movie_arr,re,callback);
	}.bind(this));
};

module.exports = platinum_worker;