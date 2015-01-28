var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");

var bhd = function(){
}


bhd.prototype.getAllMovie = function($){
	if(!bhd_config.commingSoon_movie.container || !bhd_config.commingSoon_movie.image){
		console.log("check config bhd_config.commingSoon_movie.container or bhd_config.commingSoon_movie.image");
		return [];
	}
	var re = [];
	var containers = $(bhd_config.commingSoon_movie.container);
	var images = $(bhd_config.commingSoon_movie.image);
	for ( var i = 0; i < containers.length ; i++){
		var obj = {};
		var link = containers.eq(i).attr("href");
		if(link.indexOf("=")!=-1){
			obj.id = link.split("=")[1];
		}
		else{
			obj.id = link.substring(link.lastIndexOf("-")+1,link.length);
		}
		obj.image = "http://bhdstar.vn" + images.eq(i).attr("src");
		re.push(obj);
	}
	return re;
};

bhd.prototype.getMovieInfo = function($){
	var re = {};
	var container = null;
	if(bhd_config.commingSoon_movie.info_container){
		container = $(bhd_config.commingSoon_movie.info_container);
		if(container.find("div.row").length>8){
			container.find("div.row:nth-of-type(3)").remove();
		}
	}
	if(bhd_config.commingSoon_movie.intro){
		re.intro = $(bhd_config.commingSoon_movie.intro).text(); 
		re.intro = textLib.clearBlankSpace(" "+re.intro+" ");
	}
	if(bhd_config.commingSoon_movie.name){
		re.name = $(bhd_config.commingSoon_movie.name).text(); 
		re.name = textLib.clearBlankSpace(" "+re.name+" ");
	}
	if(bhd_config.commingSoon_movie.trailer){
		re.trailer = "https:" +$(bhd_config.commingSoon_movie.trailer).attr("src"); 
	}
	if(bhd_config.commingSoon_movie.start_time){
		re.start_time = container.find(bhd_config.commingSoon_movie.start_time).text();
		re.start_time = textLib.clearBlankSpace(" "+re.start_time+" ");
		re.end_time = "...";
	}
	if(bhd_config.commingSoon_movie.kind){
		re.kind = container.find(bhd_config.commingSoon_movie.kind).text(); 
		re.kind = textLib.clearBlankSpace(" "+re.kind+" ").split(", ");
	}
	if(bhd_config.commingSoon_movie.player){
		re.player = container.find(bhd_config.commingSoon_movie.player).text(); 
		re.player = textLib.clearBlankSpace(" "+re.player+" ").split(", ");
	}
	if(bhd_config.commingSoon_movie.director){
		re.director = container.find(bhd_config.commingSoon_movie.director).text(); 
		re.director = textLib.clearBlankSpace(" "+re.director+" ").split(", ");
	}
	if(bhd_config.commingSoon_movie.length){
		re.length = container.find(bhd_config.commingSoon_movie.length).text(); 
		re.length = textLib.clearBlankSpace(" "+re.length+" ");
	}
	if(bhd_config.commingSoon_movie.version){
		re.version = container.find(bhd_config.commingSoon_movie.version).text(); 
		re.version = textLib.clearBlankSpace(" "+re.version+" ");
	}
	if(bhd_config.commingSoon_movie.format){
		//re.format = container.find(bhd_config.commingSoon_movie.format).text(); 
		//re.format = textLib.clearBlankSpace(" "+re.format+" ");
	}
	if(bhd_config.commingSoon_movie.vote){
		re.note = container.find(bhd_config.commingSoon_movie.vote).text(); 
		re.note = textLib.clearBlankSpace(" Vote : "+re.note+" ");
	}
	
	return re;
};

module.exports = bhd;