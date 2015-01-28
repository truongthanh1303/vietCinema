var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");

var platinum = function(){
}

platinum.prototype.getAllDepartment = function($){
	if(!platinum_config.department.container){
		return [];
	}
	var re = [];
	var containers = $(platinum_config.department.container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.name = containers.eq(i).text();
		obj.link = containers.eq(i).attr("href");
		re.push(obj);
	}
	return re;
};
platinum.prototype.getDepartmentInfo = function($){
	if(!platinum_config.department.name || !platinum_config.department.image ||!platinum_config.department.address || !platinum_config.department.phone || !platinum_config.department.intro || !platinum_config.department.open_time || !platinum_config.department.note){
		console.log("check config platinum_config.department.name or platinum_config.department.image or platinum_config.department.address or platinum_config.department.phone or platinum_config.department.intro or platinum_config.department.open_time or platinum_config.department.note")
		return {};
	}
	var re = {};
	re.image = "http://platinumcineplex.vn" + $(platinum_config.department.image).attr("src");
	re.name = $(platinum_config.department.name).text();
	re.address = $(platinum_config.department.address).text().split(":")[1];
	re.phone = $(platinum_config.department.phone).text().split(":")[1];
	re.intro = $(platinum_config.department.intro).text();
	re.open_time = $(platinum_config.department.open_time).text();
	re.note = $(platinum_config.department.note).text();
	return re;
};


module.exports = platinum;