var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");

var platinum = function(){
}

platinum.prototype.getAllMovie = function($){
	if(!platinum_config.commingSoon_movie.container || !platinum_config.commingSoon_movie.image){
		console.log("check config platinum_config.commingSoon_movie.container or platinum_config.commingSoon_movie.image");
		return [];
	}
	var re = [];
	var containers = $(platinum_config.commingSoon_movie.container);
	var images = $(platinum_config.commingSoon_movie.image);
	for ( var i = 0; i < containers.length ; i++){
		var obj = {};
		obj.link = "http://platinumcineplex.vn" + containers.eq(i).attr("href");
		obj.image = "http://platinumcineplex.vn" + images.eq(i).attr("src");
		re.push(obj);
	}
	return re;
};

platinum.prototype.getMovieInfo = function($){
	var re = {};
	var container = null;
	if(platinum_config.commingSoon_movie.info_container){
		container = $(platinum_config.commingSoon_movie.info_container);
	}
	if(platinum_config.commingSoon_movie.name){
		re.name = container.find(platinum_config.commingSoon_movie.name).text();
		re.name = textLib.clearBlankSpace(" "+re.name+" ");
	}
	if(platinum_config.commingSoon_movie.start_time){
		re.start_time = container.find(platinum_config.commingSoon_movie.start_time).text();
		re.start_time = textLib.clearBlankSpace(" "+re.start_time+" ");
		re.start_time = re.start_time.split(": ")[1];
		re.end_time = "...";
	}
	if(platinum_config.commingSoon_movie.length){
		re.length = container.find(platinum_config.commingSoon_movie.length).text();
		re.length = textLib.clearBlankSpace(" "+re.length+" ");
		re.length = re.length.split(": ")[1];
	}
	if(platinum_config.commingSoon_movie.director){
		re.director = container.find(platinum_config.commingSoon_movie.director).text();
		re.director = textLib.clearBlankSpace(" "+re.director+" ");
		if(re.director.split(": ")[1]){
			re.director = re.director.split(": ")[1].split(", ");
		}
	}
	if(platinum_config.commingSoon_movie.player){
		re.player = container.find(platinum_config.commingSoon_movie.player).text();
		re.player = textLib.clearBlankSpace(" "+re.player+" ");
		if(re.player.split(": ")[1]){
			re.player = re.player.split(": ")[1].split(", ");
		}
	}
	if(platinum_config.commingSoon_movie.version){
		re.version = container.find(platinum_config.commingSoon_movie.version).text();
		re.version = textLib.clearBlankSpace(" "+re.version+" ");
		re.version = re.version.split(": ")[1];
	}
	if(platinum_config.commingSoon_movie.country){
		re.country = container.find(platinum_config.commingSoon_movie.country).text();
		re.country = textLib.clearBlankSpace(" "+re.country+" ");
		re.country = re.country.split(": ")[1];
	}
	if(platinum_config.commingSoon_movie.kind){
		re.kind = container.find(platinum_config.commingSoon_movie.kind).text();
		re.kind = textLib.clearBlankSpace(" "+re.kind+" ");
		if(re.kind.split(": ")[1]){
			re.kind = re.kind.split(": ")[1].split(", ");
		}
	}
	if(platinum_config.commingSoon_movie.intro){
		re.intro = container.find(platinum_config.commingSoon_movie.intro).text();
		re.intro = textLib.clearBlankSpace(" "+re.intro+" ");
	}
	if(platinum_config.commingSoon_movie.trailer){
		re.trailer = $(platinum_config.commingSoon_movie.trailer).attr("src");
	}
	return re;
};

module.exports = platinum;