var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH+ "text.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");

var lotte = function(){
}

lotte.prototype.getAllPromotion = function($){
	if(!lotte_config.promotion.container){
		console.log("check config lotte_config.promotion.container");
		return [];
	}
	var re =[];
	var containers =  $(lotte_config.promotion.container);
	for(var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.link = "http://lottecinemavn.com/vi-vn" + containers.eq(i).attr("href").toLowerCase();
		obj.image = "http://lottecinemavn.com" + containers.eq(i).find("img").attr("src").toLowerCase();
		obj.link = obj.link.replace(/đ/g,"%C4%91");
		re.push(obj);
	}
	return re;
};

lotte.prototype.getNextLink = function($){
	if(!lotte_config.promotion.next_link){
		console.log("check config lotte_config.promotion.next_link");
		return '';
	}
	var link =  $(lotte_config.promotion.next_link);
	if(link.length){
		return "http://lottecinemavn.com" + link.attr("href");
	}
	else{
		return '';
	}
};

lotte.prototype.getPromotionInfo = function($){
	if(!lotte_config.promotion.content || !lotte_config.promotion.title){
		return {};
	}
	var re = {};
	re.content = $(lotte_config.promotion.content).text();
	re.title = $(lotte_config.promotion.title).text();
	re.title = textLib.clearBlankSpace(" " + re.title + " ");
	return re;
};

module.exports = lotte;