var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");

var galaxy = function(){
}

galaxy.prototype.getAllMovie = function($){
	if(!galaxy_config.commingSoon_movie.container || !galaxy_config.commingSoon_movie.image){
		console.log("check config galaxy_config.commingSoon_movie.container or galaxy_config.commingSoon_movie.image");
		return [];
	}
	var re = [];
	var containers = $(galaxy_config.commingSoon_movie.container);
	var images = $(galaxy_config.commingSoon_movie.image);
	for ( var i = 0; i < containers.length ; i++){
		var obj = {};
		obj.link = "https://www.galaxycine.vn" + containers.eq(i).attr("href");
		obj.image = "https://www.galaxycine.vn" + images.eq(i).attr("src");
		re.push(obj);
	}
	return re;
};

galaxy.prototype.getMovieInfo = function($){
	var re = {};
	var container = null;
	if(galaxy_config.commingSoon_movie.info_container){
		container = $(galaxy_config.commingSoon_movie.info_container);
	}
	if(galaxy_config.commingSoon_movie.intro){
		re.intro = $(galaxy_config.commingSoon_movie.intro).text(); 
		re.intro = textLib.clearBlankSpace(" "+re.intro+" ");
	}
	if(galaxy_config.commingSoon_movie.name){
		re.name = container.find(galaxy_config.commingSoon_movie.name).text(); 
		re.name = textLib.clearBlankSpace(" "+re.name+" ");
	}
	if(galaxy_config.commingSoon_movie.version){
		re.version = container.find(galaxy_config.commingSoon_movie.version).text();
	}
	if(galaxy_config.commingSoon_movie.trailer){
		re.trailer = $(galaxy_config.commingSoon_movie.trailer).attr("value"); 
	}
	if(galaxy_config.commingSoon_movie.start_time){
		re.start_time = container.find(galaxy_config.commingSoon_movie.start_time).text();
		re.start_time = textLib.clearBlankSpace(" "+re.start_time+" ");
		re.start_time = re.start_time.split(":")[1];
		re.start_time = re.start_time.replace(/\./g,"/");
		var date = re.start_time.split(" đến ");
		re.start_time = date[0].replace("Từ ",'');
		re.end_time = date[1];
	}
	if(galaxy_config.commingSoon_movie.kind){
		re.kind = container.find(galaxy_config.commingSoon_movie.kind).text(); 
		re.kind = textLib.clearBlankSpace(" "+re.kind+" ");
		re.kind = re.kind.split(":")[1];
		re.kind = re.kind.split(", ");
	}
	if(galaxy_config.commingSoon_movie.player){
		re.player = container.find(galaxy_config.commingSoon_movie.player).text(); 
		re.player = textLib.clearBlankSpace(" "+re.player+" ");
		re.player = re.player.split(":")[1];
		re.player = re.player.split(", ");
	}
	if(galaxy_config.commingSoon_movie.director){
		re.director = container.find(galaxy_config.commingSoon_movie.director).text(); 
		re.director = textLib.clearBlankSpace(" "+re.director+" ");
		re.director = re.director.split(":")[1].split(", ");
	}
	if(galaxy_config.commingSoon_movie.note){
		re.note = container.find(galaxy_config.commingSoon_movie.note).text(); 
		re.note = textLib.clearBlankSpace(" "+re.note+" ");
		re.note = re.note.split(":")[1];
	}
	return re;
};

module.exports = galaxy;