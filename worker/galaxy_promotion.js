var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var promotion_model = require(config.MODEL_PATH + "promotion.js");
	
var _galaxypromotionParser = require(config.PARSER_PATH+ "galaxy_promotion.js");

var galaxy_worker = function(){
	this.http = new httpLib();
	this.galaxyParser = new _galaxypromotionParser();
	this.promotion_model = new promotion_model();
	if(galaxy_config.promotion && galaxy_config.promotion.post_link){
		this.link = galaxy_config.promotion.post_link;
	}
	else{
		console.log(colors.red("[Worker/galaxy_promotion.js] link not found check galaxy_config.promotion.post_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
}

galaxy_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/galaxy_promotion.js] Link not found"));
		return;
	}	
	this.getAllPromotion(function(data){
		this.promotion_model.galaxyRemove(function(err,result){
			this.promotion_model.galaxyInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/galaxy_promotion.js] inserted data to Database khoaluan, collection promotion" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.promotion);
				}
				else{
					console.log(colors.red("[Worker/galaxy_promotion.js] error on insert data to Database khoaluan, collection promotion"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));	
	}.bind(this));
}

galaxy_worker.prototype.getAllPromotion = function(callback){
	console.log("[Worker/galaxy_promotion.js] Getting all promotion of Galaxy Cinema");
	var data = this.setPageParam('*');
	if(!data){
		console.log(colors.red("[Worker/galaxy_promotion.js] Can not set param"));
		callback(null);
		return;
	}
	var re = [];
	this.http.post(this.link,data,this.http_option,3,function(err,res,body){
		if(!err){
			var promotion_arr = this.galaxyParser.getAllPromotion(body);
			this.getPromotionInfo(0,promotion_arr,[],function(data,isContinue){
				for(var i in data){
					re.push(data[i]);
				}
				callback(re);
				return;
			}.bind(this));
		}
		else{
			callback(null);
		}
	}.bind(this));		
};

galaxy_worker.prototype.getPromotionInfo = function(index,promotion_arr,re,callback){
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
	console.log("[Worker/galaxy_promotion.js] Getting promotion info at ",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.galaxyParser.getPromotionInfo($);
			info.image = promotion_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/galaxy_promotion.js] Error on getting ",link));
		}
		index++;
		this.getPromotionInfo(index,promotion_arr,re,callback);
	}.bind(this));
}

galaxy_worker.prototype.setPageParam = function(page){
	if(!galaxy_config.promotion.param_set || !galaxy_config.promotion.page_param){
		return null;
	}
	var data = {};
	for( var i in galaxy_config.promotion.param_set){
		data[i] = galaxy_config.promotion.param_set[i];
	}
	data[galaxy_config.promotion.page_param] = page;
	return data;
};
module.exports = galaxy_worker;