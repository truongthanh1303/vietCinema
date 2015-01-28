var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");

var cgv = function(){
}

cgv.prototype.getAllMovie = function($){
	if(!cgv_config.onScreen_movie.container || !cgv_config.onScreen_movie.image){
		console.log("check config cgv_config.onScreen_movie.container or cgv_config.onScreen_movie.image");
		return [];
	}
	var re =[];
	var containers =  $(cgv_config.onScreen_movie.container);
	var images =  $(cgv_config.onScreen_movie.image);
	for(var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.link = containers.eq(i).attr("href");
		obj.image = images.eq(i).attr("src");
		if(obj.image.indexOf("/")==0){
			obj.image = "http://cgv.vn" + obj.image;
		}
		re.push(obj);
	}
	return re;
};

cgv.prototype.getMovieInfo = function($){
	var re = {};
	if(cgv_config.onScreen_movie.name){
		re.name = $(cgv_config.onScreen_movie.name).text();
		re.name = textLib.clearBlankSpace(" "+re.name+" ");
	}
	if(cgv_config.onScreen_movie.start_time){
		re.start_time = $(cgv_config.onScreen_movie.start_time).text();
		re.end_time = "...";
		re.start_time = textLib.clearBlankSpace(" "+re.start_time+" ");
	}
	if(cgv_config.onScreen_movie.kind){
		re.kind = $(cgv_config.onScreen_movie.kind).text();
		re.kind = textLib.clearBlankSpace(" "+re.kind+" ");
		re.kind = re.kind.split(", ");
	}
	if(cgv_config.onScreen_movie.player){
		re.player = $(cgv_config.onScreen_movie.player).eq(0).text();
		re.player = textLib.clearBlankSpace(" "+re.player+" ");
		re.player = re.player.split(", ");
	}
	if(cgv_config.onScreen_movie.director){
		re.director = $(cgv_config.onScreen_movie.director).text();
		re.director = textLib.clearBlankSpace(" "+re.director+" ");
		re.director = re.director.split(", ");
	}
	if(cgv_config.onScreen_movie.length){
		re.length = $(cgv_config.onScreen_movie.length).eq(1).text();
		re.length = textLib.clearBlankSpace(" "+re.length+" ");
	}
	if(cgv_config.onScreen_movie.intro){
		re.intro = $(cgv_config.onScreen_movie.intro).text();
		re.intro = textLib.clearBlankSpace(" "+re.intro+" ");
	}
	if(cgv_config.onScreen_movie.trailer){
		re.trailer =  $(cgv_config.onScreen_movie.trailer).text();
		re.trailer =textLib.clearBlankSpace(" "+re.trailer+" ");
		re.trailer = "http:" + re.trailer;
	}
	if(cgv_config.onScreen_movie.age){
		if($(cgv_config.onScreen_movie.age).length){
			re.age = $(cgv_config.onScreen_movie.age).attr("class");
			re.age = textLib.getNumberFromText(re.age);
			re.age = parseInt(re.age);
		}
	}
	return re;
};
module.exports = cgv;