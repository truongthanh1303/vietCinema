var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");

var galaxy = function(){
}


galaxy.prototype.getAllDepartment = function($){
	if(!galaxy_config.department.container){
		return [];
	}
	var re = [];
	var containers = $(galaxy_config.department.container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.name  = containers.eq(i).text();
		obj.val = containers.eq(i).attr("value");
		re.push(obj);
	}
	return re;
};

galaxy.prototype.getDepartmentInfo = function(html){
	html = html.substring(html.indexOf('({"')+1,html.lastIndexOf('"})')+2);
	var re = {};
	var info = JSON.parse(html);
	re.name = info.name;
	re.address = info.address;
	re.phone = info.tel.split(":")[1];
	re.image = "https://www.galaxycine.vn" + info.media;
	return re;
};



module.exports = galaxy;