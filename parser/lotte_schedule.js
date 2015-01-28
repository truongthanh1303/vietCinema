var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");

var lotte = function(){
}

lotte.prototype.getAllDepartment = function($){
	if(!lotte_config.department){
		return [];
	}
	var re = [];
	var department_info = {};
	var lotte_departments = $(lotte_config.department);
	for(var i = 0 ; i < lotte_departments.length ; i++){
		if(lotte_departments.eq(i).val()!= -1){
			var department_info = {};
			department_info.name = lotte_departments.eq(i).text();
			department_info.val = lotte_departments.eq(i).val();
			re.push(department_info);
		}
	}
	return re;
}

lotte.prototype.getALlDate  = function($){
	if(!lotte_config.date){
		return [];
	}
	var re = [];
	var lotte_dates = $(lotte_config.date);
	for(var i = 0 ; i < lotte_dates.length ; i++){
		if(lotte_dates.eq(i).val()!= -1){
			re.push(lotte_dates.eq(i).val());
		}
	}
	return re;
}

lotte.prototype.getSchedule  = function($){
	if(!lotte_config.schedule || !lotte_config.schedule.container || !lotte_config.schedule.title || !lotte_config.schedule.times){
		return {};
	}
	var re ={};
	var container = $(lotte_config.schedule.container);
	for(var i = 0 ; i < container.length ; i++){
		var title = this.getScheduleTitle(container.eq(i));
		var times = this.getScheduleTimes(container.eq(i));
		re[title] = times;
	}
	return re;
}

lotte.prototype.getScheduleTitle = function(container){
	if(!lotte_config.schedule.title){
		console.log("check config lotte_config.schedule.title");
		return "";
	}
	var title = container.find(lotte_config.schedule.title).eq(0).text();
	title = textLib.clearBlankSpace(" " + title + " ");
	return title;
}

lotte.prototype.getScheduleTimes = function(container){
	if(!lotte_config.schedule.times){
		console.log("check config lotte_config.schedule.times");
		return [];
	}
	var re = [];
	var times = container.find(lotte_config.schedule.times);
	for(var i = 0 ; i < times.length ; i++){
		re.push(times.eq(i).text());
	}
	return re;
}

module.exports = lotte;