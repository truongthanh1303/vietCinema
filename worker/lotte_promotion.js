var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");

var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var promotion_model = require(config.MODEL_PATH + "promotion.js");

var _lottepromotionParser = require(config.PARSER_PATH+ "lotte_promotion.js");

var lotte_worker = function(){
	this.http = new httpLib();
	this.lotteParser = new _lottepromotionParser();
	this.promotion_model = new promotion_model();
	if(lotte_config.promotion_link){
		this.link = lotte_config.promotion_link;
	}
	else{
		console.log(colors.red("[Worker/lotte_promotion.js] link not found check lotte_config.promotion_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
}

lotte_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/lotte_promotion.js] Link not found"));
		return;
	}
	console.log("[Worker/lotte_promotion.js] Start getting all promotion of Lotte Cinema");
	this.getAllPromotion(this.link,[],function(data){
		this.promotion_model.lotteRemove(function(err,result){
			this.promotion_model.lotteInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/lotte_promotion.js] inserted data to Database khoaluan, collection promotion" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.promotion);
				}
				else{
					console.log(colors.red("[Worker/lotte_promotion.js] error on insert data to Database khoaluan, collection promotion"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
}

lotte_worker.prototype.getAllPromotion = function(link,re,callback){
	console.log("[Worker/lotte_promotion.js] go to page ",link);
	this.http.get(link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			link = this.lotteParser.getNextLink($);
			var promotion_arr = this.lotteParser.getAllPromotion($);
			this.getPromotionInfo(0,promotion_arr,[],function(data){
				for(var i in data){
					re.push(data[i]);
				}
				if(!link){
					callback(re);
					return;
				}
				else{
					this.getAllPromotion(link,re,callback);
				}
			}.bind(this));
		}
		else{
			if(re!=[]){
				callback(re);
				return;
			}
			callback(null);
		}
	}.bind(this));
};

lotte_worker.prototype.getPromotionInfo = function(index,promotion_arr,re,callback){
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
	console.log("[Worker/lotte_promotion.js] Getting promotion info at ",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.lotteParser.getPromotionInfo($);
			info.image = promotion_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/lotte_commingSoonMovie.js] Error on getting ",link));
		}
		index++;
		this.getPromotionInfo(index,promotion_arr,re,callback);
	}.bind(this));
}

module.exports = lotte_worker;