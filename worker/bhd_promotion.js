var cheerio = require("cheerio"),
	colors = require("colors");
var http = require("http");
var config 	= require("./../config/config.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var promotion_model = require(config.MODEL_PATH + "promotion.js");
	
var _bhdPromotionParser = require(config.PARSER_PATH+ "bhd_promotion.js");

var bhd_worker = function(){
	this.http = new httpLib();
	this.bhdParser = new _bhdPromotionParser();
	this.promotion_model = new promotion_model();
	if(bhd_config.promotion_link){
		this.link = bhd_config.promotion_link;
	}
	else{
		console.log(colors.red("[Worker/bhd_promotion.js] link not found check bhd_config.promotion_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

bhd_worker.prototype.start = function(option){
	this.http_option = option;
	if(!this.http_option){
		console.log(colors.red("[Worker/bhd_promotion.js] Can not set cookie"));
		return;
	}
	if(!this.link){
		console.log(colors.red("[Worker/bhd_promotion.js] Link not found"));
		return;
	}
	this.getAllPromotion(function(data){
		this.promotion_model.bhdRemove(function(err,result){
			this.promotion_model.bhdInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/bhd_promotion.js] inserted data to Database khoaluan, collection promotion"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.promotion);
				}
				else{
					console.log(colors.red("[Worker/bhd_promotion.js] error on insert data to Database khoaluan, collection promotion"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));	
	}.bind(this));
};

bhd_worker.prototype.getAllPromotion = function(callback){
	console.log("[Worker/bhd_promotion.js] Starting getting all movie of BHD Cinema...");
	this.http.get(this.link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var promotion_arr = this.bhdParser.getAllPromotion($);
			this.getPromotionInfo(0,promotion_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

bhd_worker.prototype.getPromotionInfo = function(index,promotion_arr,re,callback){
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
	console.log("[Worker/bhd_promotion.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.bhdParser.getPromotionInfo($);
			info.image = promotion_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/bhd_promotion.js] Error on getting ",link));
		}
		index++;
		this.getPromotionInfo(index,promotion_arr,re,callback);
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