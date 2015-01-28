var config = require("./../config/config.js"),
	cheerio = require("cheerio"),
	fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib  = require(config.LIB_PATH+ "text.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");

var platinum = function(){
}

platinum.prototype.getAllDepartment = function($){
	if(!platinum_config.schedule.department_container || !platinum_config.schedule.department_name || !platinum_config.schedule.department_id){
		return [];
	}
	var re = [];
	var containers = $(platinum_config.schedule.department_container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.name = containers.eq(i).find(platinum_config.schedule.department_name).text();
		obj.val = containers.eq(i).data(platinum_config.schedule.department_id);
		re.push(obj);
	}
	return re;
};

platinum.prototype.getAllMovie = function($){
	if(!platinum_config.schedule.movie_container || !platinum_config.schedule.movie_name || !platinum_config.schedule.movie_id){
		return [];
	}
	var re = [];
	var containers = $(platinum_config.schedule.movie_container);
	for( var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.name = containers.eq(i).find(platinum_config.schedule.movie_name).text();
		obj.val = containers.eq(i).data(platinum_config.schedule.movie_id);
		re.push(obj);
	}
	return re;
};

platinum.prototype.getAllDate = function($){
	if(!platinum_config.schedule.date_contaier){
		return [];
	}
	var re = [];
	var containers = $(platinum_config.schedule.date_contaier);
	for( var i = 0 ; i < containers.length ; i++){
		var obj = {};
		obj.name = containers.eq(i).find(platinum_config.schedule.date_contaier).text();
		obj.val = containers.eq(i).data(platinum_config.schedule.date_id);
		re.push(obj);
	}
	return re;
};

platinum.prototype.getAllInfo = function($,callback){
	if(!platinum_config.schedule.time_container){
		return [];
	}
	var re = [];
	var department_arr = this.getAllDepartment($);
	var movie_arr = this.getAllMovie($);
	for( var i = 0 ; i < department_arr.length ; i++){
		re[department_arr[i].name]=[];
		for( var j = 0 ; j < movie_arr.length ; j++){
			re[department_arr[i].name][movie_arr[j].name]=[];
			var time_container = $(platinum_config.schedule.time_container(department_arr[i].val,movie_arr[j].val));
			for( var k = 0 ; k < time_container.length ; k++){
				var date = time_container.eq(k).parent().prev().text();
				if(!re[department_arr[i].name][movie_arr[j].name][date]){
					re[department_arr[i].name][movie_arr[j].name][date] = [];
				}
				re[department_arr[i].name][movie_arr[j].name][date].push(time_container.eq(k).text());
			}
			if(time_container.length==0){
				delete re[department_arr[i].name][movie_arr[j].name];
			}
		}
	}
	callback(re);
	return;
};


module.exports = platinum;