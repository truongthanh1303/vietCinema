var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH+ "text.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");

var lotte = function(){
}

lotte.prototype.getAllMovie = function($){
	if(!lotte_config.onScreen_movie.container || !lotte_config.onScreen_movie.link || !lotte_config.onScreen_movie.image){
		console.log("check config lotte_config.onScreen_movie.container or lotte_config.onScreen_movie.link or lotte_config.onScreen_movie.image");
		return [];
	}
	var re =[];
	var containers =  $(lotte_config.onScreen_movie.container);
	var images =  $(lotte_config.onScreen_movie.image);
	for(var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.link = "http://lottecinemavn.com/vi-vn" + containers.eq(i).find(lotte_config.onScreen_movie.link).attr("href").toLowerCase();
		obj.link = obj.link.replace(/đ/g,"%C4%91");
		obj.image = "http://lottecinemavn.com" + images.eq(i).attr("src");
		re.push(obj);
	}
	return re;
};

lotte.prototype.getMovieInfo = function($){
	var re = {};
	if(lotte_config.onScreen_movie.name){
		re.name = $(lotte_config.onScreen_movie.name).text();
		re.name = textLib.clearBlankSpace(" "+re.name+" ");
	}
	if(lotte_config.onScreen_movie.intro){
		re.intro = $(lotte_config.onScreen_movie.intro).text();
		re.intro = textLib.clearBlankSpace(" "+re.intro+" ");
	}
	var container =  $(lotte_config.onScreen_movie.info_container);
	if(lotte_config.onScreen_movie.start_time){
		re.start_time = container.find(lotte_config.onScreen_movie.start_time).text();
		re.start_time = textLib.clearBlankSpace(" "+re.start_time+" ");
		var date = re.start_time.split(" đến ");
		re.start_time = date[0].replace("Từ ",'');
		re.end_time = date[1];
	}
	if(lotte_config.onScreen_movie.kind){
		re.kind = container.find(lotte_config.onScreen_movie.kind).text();
		re.kind = textLib.clearBlankSpace(" "+re.kind+" ").split(", ");
	}
	if(lotte_config.onScreen_movie.player){
		re.player = container.find(lotte_config.onScreen_movie.player).text();
		re.player = textLib.clearBlankSpace(" "+re.player+" ").split(", ");
	}
	if(lotte_config.onScreen_movie.director){
		re.director = container.find(lotte_config.onScreen_movie.director).text();
		re.director = textLib.clearBlankSpace(" "+re.director+" ").split(", ");
	}
	if(lotte_config.onScreen_movie.length){
		re.length = container.find(lotte_config.onScreen_movie.length).text();
		re.length = textLib.clearBlankSpace(" "+re.length+" ");
	}
	if(lotte_config.onScreen_movie.version){
		re.version = container.find(lotte_config.onScreen_movie.version).text();
		re.version = textLib.clearBlankSpace(" "+re.version+" ");
	}
	if(lotte_config.onScreen_movie.company){
		re.company = container.find(lotte_config.onScreen_movie.company).text();
		re.company = textLib.clearBlankSpace(" "+re.company+" ");
	}
	if(lotte_config.onScreen_movie.note){
		re.note = container.find(lotte_config.onScreen_movie.note).text();
		re.note = textLib.clearBlankSpace(" Chiếu tại : "+re.note+" ");
	}
	if(lotte_config.onScreen_movie.trailer){
		re.trailer = "https:" + $(lotte_config.onScreen_movie.trailer).attr("src");
	}
	return re;
};

module.exports = lotte;