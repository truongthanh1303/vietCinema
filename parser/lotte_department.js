var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH+ "text.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");

var lotte = function(){
}

lotte.prototype.getInfo = function($){
	if(!lotte_config.department_parser.intro || !lotte_config.department_parser.name || !lotte_config.department_parser.image){
		return {};
	}
	var re = {}
	re.image = "http://lottecinemavn.com" + $(lotte_config.department_parser.image).attr("src");
	var department_intro = $(lotte_config.department_parser.intro);
	var department_name = $(lotte_config.department_parser.name);
	var intro = department_intro.eq(0).text();
	if(intro.indexOf("Địa chỉ")!=-1){
		re.address = intro.substring(intro.indexOf("Địa chỉ"),intro.length);
	}
	else{
		re.address = textLib.clearBlankSpace(" " + intro + " ");
	}
	if(intro.indexOf("Điện thoại")!=-1){
		re.phone = intro.substring(intro.indexOf("Điện thoại"),intro.length);
	}
	else{
		re.phone = intro.substring(intro.indexOf("ĐT"),intro.length);
	}
	if(intro.indexOf("Fax")!=-1){
		re.fax = intro.substring(intro.indexOf("Fax"),intro.length);
	}
	else{
		re.fax = "";
	}
	re.address = re.address.substring(0,re.address.indexOf("\r\n"));
	if(!re.address.length){
		if(intro.indexOf("Điện thoại")!=-1){
			re.address = intro.substring(0,intro.indexOf("Điện thoại"));
		}
		else if(intro.indexOf("ĐT")!=-1){
			re.address = intro.substring(0,intro.indexOf("ĐT"));
		}
		else{
			re.address = intro.split(":")[0];
		}
		re.address = textLib.clearBlankSpace(" " + re.address + " ");
	}
	if(re.fax.split("\r\n")[1]){
		re.note = re.fax.split("\r\n")[1];
		re.fax = re.fax.split("\r\n")[0];
		re.fax = re.fax.split(":")[1];
	}
	else{
		re.note ="";
	}
	if(!re.fax){
		re.note = re.phone.split("\r\n")[1];
	}
	re.phone = re.phone.substring(0,re.phone.indexOf("\r\n"));
	if(re.address.split(":")[1]){
		re.address = re.address.split(":")[1];
	}
	re.phone = re.phone.split(":")[1];
	re.name = textLib.clearBlankSpace(" " + department_name.eq(0).text()+ " ");
	return re;
}

lotte.prototype.getAllDepartment = function($){
	if(!lotte_config.department_parser.container || !lotte_config.department_parser.name){
		return [];
	}
	var re = [];
	var containers = $(lotte_config.department_parser.container);
	for(var i = 0 ; i < containers.length ; i++){
		var departments = containers.eq(i).find(lotte_config.department_parser.link);
		for(var j = 0 ; j < departments.length ; j++){
			var link = "http://lottecinemavn.com/vi-vn" + departments.eq(j).attr("href");
			re.push(link);
		}
	}	
	return re;
}

module.exports = lotte;