var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");

var galaxy = function(){
}

galaxy.prototype.getMenuLink = function($){
	if(!galaxy_config.schedule.menu_link){
		return "";
	}
	var link = "https://www.galaxycine.vn" + $(galaxy_config.schedule.menu_link).attr("href");
	return link;
};

galaxy.prototype.getAllScheduleDepartment = function($){
	if(!galaxy_config.schedule.department){
		return [];
	}
	var re = [];
	var containers = $(galaxy_config.schedule.department);
	for( var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.name  = containers.eq(i).text();
		obj.val = containers.eq(i).attr("value");
		re.push(obj);
	}
	return re;
};

galaxy.prototype.getMovieTime = function(html){
	html = html.substring(html.indexOf('[{"pk"'),html.lastIndexOf('}]}]')+4);
	var re = [];
	var time_arr = JSON.parse(html);
		for(var i in time_arr){
			var hour_arr = [];	
			for(var j in time_arr[i].times){
				hour_arr.push(time_arr[i].times[j].name);
			}
			re[time_arr[i].name]= hour_arr;
		}
	return re;
};
module.exports = galaxy;