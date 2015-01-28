var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");

var bhd = function(){
}


bhd.prototype.getAllDepartment = function($){
	if(!bhd_config.department.container){
		return [];
	}
	var re = [];
	var containers = $(bhd_config.department.container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj = this.getDepartmentInfo(containers.eq(i));
		if(bhd_config.department.image){
			obj.image = "http://bhdstar.vn" + $(bhd_config.department.image).attr("src");
		}
		re.push(obj);
	}
	return re;
};

bhd.prototype.getDepartmentInfo = function(container){
	var re = {};
	if(bhd_config.department.name){
		re.name = container.find(bhd_config.department.name).text();
		re.name = textLib.clearBlankSpace(" "+re.name+" ");
	}
	if(bhd_config.department.address){
		re.address = container.find(bhd_config.department.address).text();
		re.address = textLib.clearBlankSpace(" "+re.address+" ");
	}
	if(bhd_config.department.phone){
		re.phone = container.find(bhd_config.department.phone).text();
		re.phone = textLib.clearBlankSpace(" "+re.phone+" ");
	}
	if(bhd_config.department.email){
		re.email = container.find(bhd_config.department.email).text();
		re.email = textLib.clearBlankSpace(" "+re.email+" ");
	}
	if(bhd_config.department.note){
		re.note = container.find(bhd_config.department.note).text();
		re.note = textLib.clearBlankSpace(" "+re.note+" ");
	}
	if(bhd_config.department.open_time){
		re.open_time = container.find(bhd_config.department.open_time).text();
		re.open_time = textLib.clearBlankSpace(" "+re.open_time+" ");
	}
	return re;
};



module.exports = bhd;