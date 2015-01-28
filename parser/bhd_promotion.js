var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");

var bhd = function(){
}


bhd.prototype.getAllPromotion = function($){
	if(!bhd_config.promotion.link || !bhd_config.promotion.image){
		console.log("check config bhd_config.promotion.link or bhd_config.promotion.image");
		return [];
	}
	var re = [];
	var containers = $(bhd_config.promotion.link);
	var images = $(bhd_config.promotion.image);
	for ( var i = 0; i < containers.length ; i++){
		var obj = {};
		obj.link = "http://bhdstar.vn" + containers.eq(i).attr("href");
		obj.image = "http://bhdstar.vn" + images.eq(i).attr("src");
		re.push(obj);
	}
	return re;
};

bhd.prototype.getPromotionInfo = function($){
	if(!bhd_config.promotion.title || !bhd_config.promotion.content){
		return {};
	}
	var re = {};
	re.title = $(bhd_config.promotion.title).text();
	re.title = textLib.clearBlankSpace(" " + re.title + " ");
	var content = $(bhd_config.promotion.content);
	content.children("div:first-child").remove();
	content.children("h1").remove("");
	re.content = content.html();
	return re;
};

module.exports = bhd;