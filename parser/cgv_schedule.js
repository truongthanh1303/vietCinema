var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");

var cgv = function(){
}

cgv.prototype.getAllScheduleDepartment = function($){
	if(!cgv_config.schedule.department_container || !cgv_config.schedule.department_name){
		return [];
	}
	var re = [];
	var containers = $(cgv_config.schedule.department_container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj ={};
		obj.name = containers.eq(i).find(cgv_config.schedule.department_name).text();
		obj.link = "http://m.cgv.vn" + containers.eq(i).find(cgv_config.schedule.department_name).attr("href");
		re.push(obj);
	}
	return re;
};

cgv.prototype.getAllScheduleMovie = function($){
	if(!cgv_config.schedule.movie_container || !cgv_config.schedule.movie_name){
		return [];
	}
	var re = [];
	var containers = $(cgv_config.schedule.movie_container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj ={};
		obj.name = containers.eq(i).find(cgv_config.schedule.movie_name).text();
		obj.link = "http://m.cgv.vn" + containers.eq(i).find(cgv_config.schedule.movie_name).attr("href");
		re.push(obj);
	}
	return re;
};

cgv.prototype.getAllScheduleTime = function($){
	if(!cgv_config.schedule.time_container || !cgv_config.schedule.time_date || !cgv_config.schedule.time_hour){
		return [];
	}
	var re = [];
	var containers = $(cgv_config.schedule.time_container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj ={};
		obj.date = textLib.clearBlankSpace(containers.eq(i).find(cgv_config.schedule.time_date).text());
		obj.date = textLib.editDateFormat(obj.date);
		var time_containers = containers.eq(i).find(cgv_config.schedule.time_hour);
		var time_re = [];
		for( var j = 0 ; j < time_containers.length ; j++){
			var time = time_containers.eq(j).text();
			if(time.indexOf("PM")!=-1){
				time = time.substring(0,time.length-2);
				var times = time.split(":");
				time = (parseInt(times[0]) + 10 ) + ":" + times[1];
			}
			else{
				time = time.substring(0,time.length-2);
			}
			time_re.push(time);
		}
		obj.time = time_re;
		if(obj.date!="NaN"){
			re.push(obj);
		}
	}
	return re;
};

module.exports = cgv;