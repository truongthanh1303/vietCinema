var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");

var cgv = function(){
}

cgv.prototype.getAllPromotion = function($){
	if(!cgv_config.promotion_movie.container || !cgv_config.promotion_movie.image){
		console.log("check config cgv_config.promotion_movie.container or cgv_config.promotion_movie.image");
		return [];
	}
	var re = [];
	var containers = $(cgv_config.promotion_movie.container);
	var images = $(cgv_config.promotion_movie.image);
	for ( var i = 0; i < containers.length ; i++){
		var obj = {};
		obj.link = "http://m.cgv.vn" + containers.eq(i).attr("href");
		obj.image = images.eq(i).attr("src");
		if(obj.image.indexOf("/")==0){
			obj.image = "http://cgv.vn" + obj.image;
		}
		re.push(obj);
	}
	return re;
};

cgv.prototype.getPromotionInfo = function($){
	var re = {};
	/*var container = null;
	if(cgv_config.promotion_movie.info_container){
		container = $(cgv_config.promotion_movie.info_container).text();
	}*/
	if(cgv_config.promotion_movie.title){
		re.title = $(cgv_config.promotion_movie.title).text();
		re.title = textLib.clearBlankSpace(" "+re.title+" ");
	}
	if(cgv_config.promotion_movie.content){
		re.content = $(cgv_config.promotion_movie.content).text();
		re.content = textLib.clearBlankSpace(" "+re.content+" ");
	}
	return re;
};

module.exports = cgv;