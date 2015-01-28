var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var onScreenMovie_model = require(config.MODEL_PATH + "onScreenMovie.js");

var _cgvScheduleParser = require(config.PARSER_PATH+ "cgv_onScreenMovie.js");

var cgv_worker = function(){
	this.http = new httpLib();
	this.cgvParser = new _cgvScheduleParser();
	this.onScreenMovie_model = new onScreenMovie_model();
	if(cgv_config.onScreen_movie_link){
		this.link = cgv_config.onScreen_movie_link;
	}
	else{
		console.log(colors.red("[Worker/cgv_onScreenMovie.js] link not found check cgv_config.onScreen_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

cgv_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/cgv_onScreenMovie.js] Link not found"));;
		return;
	}
	this.getAllMovie(function(data){
		this.onScreenMovie_model.cgvRemove(function(err,result){
			this.onScreenMovie_model.cgvInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/cgv_onScreenMovie.js] inserted data to Database khoaluan, collection onScreenMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.onScreenMovie);
				}
				else{
					console.log(colors.red("[Worker/cgv_onScreenMovie.js] error on insert data to Database khoaluan, collection onScreenMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

cgv_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/cgv_onScreenMovie.js]  Start getting all movie of CGV Cinema");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.cgvParser.getAllMovie($);
			this.getAllMovieInfo(0,movie_arr,[],function(data){
				callback(data);
				return;
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

cgv_worker.prototype.getAllMovieInfo = function(index,movie_arr,re,callback){
	if(index == movie_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	var link = movie_arr[index].link;
	console.log("[Worker/cgv_onScreenMovie.js] Getting movie info at ",link);
	this.http.get(link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.cgvParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/cgv_onScreenMovie.js] Error on getting ",link));
		}
		index++;
		this.getAllMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
}

module.exports = cgv_worker;