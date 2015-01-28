var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");

var cgv = function(){
}

cgv.prototype.getAllDepartment = function($){
	if(!cgv_config.department.list_container || !cgv_config.department.list_name || !cgv_config.department.list_link || !cgv_config.department.image){
		return [];
	}
	var re = [];
	var containers = $(cgv_config.department.list_container);
	var images = $(cgv_config.department.image);
	for( var i = 0 ; i < containers.length ; i++){
		var obj ={};
		obj.name = containers.eq(i).find(cgv_config.department.list_name).text();
		obj.name = (obj.name.indexOf("\r\n")!= -1) ? obj.name.replace("\r\n"," - ") : obj.name.replace("\n"," - ");
		obj.name = textLib.clearBlankSpace(" " + obj.name);
		obj.link = "http://m.cgv.vn" + containers.eq(i).find(cgv_config.department.list_link).attr("href");
		obj.image = images.eq(i).attr("src");
		if(obj.image.indexOf("/")==0){
			obj.image = "http://cgv.vn" + obj.image;
		}
		re.push(obj);
	}
	return re;
};

cgv.prototype.getDepartmentInfo = function($){
	if(!cgv_config.department.phone || !cgv_config.department.fax || !cgv_config.department.address){
		return {};
	}
	var re = {};
	//re.name = $(cgv_config.department.name).text();
	re.phone = $(cgv_config.department.phone).text().split(":")[1];
	re.fax = $(cgv_config.department.fax).text().split(":")[1];
	re.address = $(cgv_config.department.address).text();
	return re;
};

module.exports = cgv;