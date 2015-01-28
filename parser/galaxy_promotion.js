var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH+ "text.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");

var galaxy = function(){
}

galaxy.prototype.getAllPromotion = function(html){
	if(!galaxy_config.promotion.container || !galaxy_config.promotion.image ||!galaxy_config.promotion.link || !galaxy_config.promotion.expired){
		console.log("check config galaxy_config.promotion.container or galaxy_config.promotion.link or galaxy_config.promotion.expired or galaxy_config.promotion.image");
		return [];
	}
	
	html = html.substring(html.indexOf("'reload'")+12,html.lastIndexOf("catch(e)")-14);
	html = html.replace(/(\\n)/g,'');
	html = html.replace(/(\\)/g,'');
	html = html.replace(/(\")/g,"'");
	var $ = cheerio.load("<div id ='root'>" + html + "</div>");
	var re =[];
	var containers =  $(galaxy_config.promotion.container);
	var images =  $(galaxy_config.promotion.image);
	for(var i = 0 ; i < containers.length ; i++){
		var link_ele = containers.eq(i).children(galaxy_config.promotion.link);
		var expired_ele = containers.eq(i).children(galaxy_config.promotion.expired);
		if(link_ele.length)
		{
			if(!expired_ele.length){
				var obj = {};
				obj.link = "https://www.galaxycine.vn" + link_ele.attr("href");
				obj.image = "https://www.galaxycine.vn" + images.eq(i).attr("src");
				re.push(obj);
			}
		}
	}
	return re;
};

galaxy.prototype.getPromotionInfo = function($){
	if(!galaxy_config.promotion.content || !galaxy_config.promotion.title){
		return {};
	}
	var re = {};
	re.content = $(galaxy_config.promotion.content).html();
	re.title = $(galaxy_config.promotion.title).text();
	re.title = textLib.clearBlankSpace(" " + re.title + " ");
	return re;
};

module.exports = galaxy;