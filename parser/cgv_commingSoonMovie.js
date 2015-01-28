var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");

var cgv = function(){
}

cgv.prototype.getAllMovie = function($){
	if(!cgv_config.commingSoon_movie.container || !cgv_config.commingSoon_movie.image){
		console.log("check config cgv_config.commingSoon_movie.container or cgv_config.commingSoon_movie.image");
		return [];
	}
	var re =[];
	var containers =  $(cgv_config.commingSoon_movie.container);
	var images =  $(cgv_config.commingSoon_movie.image);
	for(var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.link = containers.eq(i).attr("href");
		obj.image = images.eq(i).attr("src");
		re.push(obj);
	}
	return re;
};

cgv.prototype.getMovieInfo = function($){
	var re = {};
	if(cgv_config.commingSoon_movie.name){
		re.name = $(cgv_config.commingSoon_movie.name).text();
		//re.name = textLib.clearBlankSpace(" "+re.name+" ");
	}
	if(cgv_config.commingSoon_movie.start_time){
		re.start_time = $(cgv_config.commingSoon_movie.start_time).text();
		re.start_time = textLib.clearBlankSpace(" "+re.start_time+" ");
	}
	if(cgv_config.commingSoon_movie.kind){
		re.kind = $(cgv_config.commingSoon_movie.kind).text();
		re.kind = textLib.clearBlankSpace(" "+re.kind+" ");
		re.kind = re.kind.split(", ");
	}
	if(cgv_config.commingSoon_movie.player){
		re.player = $(cgv_config.commingSoon_movie.player).eq(0).text();
		re.player = textLib.clearBlankSpace(" "+re.player+" ");
		re.player = re.player.split(", ");
	}
	if(cgv_config.commingSoon_movie.director){
		re.director = $(cgv_config.commingSoon_movie.director).text();
		re.director = textLib.clearBlankSpace(" "+re.director+" ");
		re.director = re.director.split(", ");
	}
	if(cgv_config.commingSoon_movie.length){
		re.length = $(cgv_config.commingSoon_movie.length).eq(1).text();
		re.length = textLib.clearBlankSpace(" "+re.length+" ");
	}
	if(cgv_config.commingSoon_movie.intro){
		re.intro = $(cgv_config.commingSoon_movie.intro).text();
		re.intro = textLib.clearBlankSpace(" "+re.intro+" ");
	}
	if(cgv_config.commingSoon_movie.trailer){
		re.trailer = $(cgv_config.commingSoon_movie.trailer).text();
		re.trailer = textLib.clearBlankSpace(" " + re.trailer + " ");
		re.trailer = "http:" + re.trailer;
	}
	return re;
};
module.exports = cgv;