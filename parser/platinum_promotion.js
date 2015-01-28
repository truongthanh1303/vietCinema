var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");

var platinum = function(){
}

platinum.prototype.getAllPromotion = function($){
	if(!platinum_config.promotion.container || !platinum_config.promotion.image){
		console.log("check config platinum_config.promotion.container");
		return [];
	}
	var re = [];
	var containers = $(platinum_config.promotion.container);
	var images = $(platinum_config.promotion.image);
	for ( var i = 0; i < containers.length ; i++){
		var obj = {};
		obj.link = containers.eq(i).attr("href");
		obj.image = "http://platinumcineplex.vn" + images.eq(i).attr("src");
		re.push(obj);
	}
	return re;
};

platinum.prototype.getPromotionInfo = function($){
	var re = {};
	/*var container = null;
	if(platinum_config.promotion.info_container){
		container = $(platinum_config.promotion.info_container).text();
	}*/
	if(platinum_config.promotion.title){
		re.title = $(platinum_config.promotion.title).text();
		re.title = textLib.clearBlankSpace(" "+re.title+" ");
	}
	if(platinum_config.promotion.content){
		re.content = $(platinum_config.promotion.content).text();
		re.content = textLib.clearBlankSpace(" "+re.content+" ");
	}
	return re;
};

module.exports = platinum;