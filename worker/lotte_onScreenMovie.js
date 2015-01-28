var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var onScreenMovie_model = require(config.MODEL_PATH + "onScreenMovie.js");
	
var _lotteOnScreenMovieParser = require(config.PARSER_PATH+ "lotte_onScreenMovie.js");

var lotte_worker = function(){
	this.http = new httpLib();
	this.lotteParser = new _lotteOnScreenMovieParser();
	this.onScreenMovie_model = new onScreenMovie_model();
	if(lotte_config.onScreen_movie_link){
		this.link = lotte_config.onScreen_movie_link;
	}
	else{
		console.log(colors.red("[Worker/lotte_onScreenMovie.js] link not found check lotte_config.onScreen_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
	this.department_arr = [];
}

lotte_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/lotte_onScreenMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.onScreenMovie_model.lotteRemove(function(err,result){
			this.onScreenMovie_model.lotteInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/lotte_onScreenMovie.js] inserted data to Database khoaluan, collection onScreenMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.onScreenMovie);
				}
				else{
					console.log(colors.red("[Worker/lotte_onScreenMovie.js] error on insert data to Database khoaluan, collection onScreenMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
}

lotte_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/lotte_onScreenMovie.js] Start getting all movie of Lotte Cinema");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.lotteParser.getAllMovie($);
			this.getAllMovieInfo(0,movie_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));		
};

lotte_worker.prototype.getAllMovieInfo = function(index,movie_arr,re,callback){
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
	console.log("[Worker/lotte_onScreenMovie.js] Getting movie info at ",link);
	this.http.get(link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.lotteParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/lotte_onScreenMovie.js] Error on getting ",link));
		}
		index++;
		this.getAllMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
}

module.exports = lotte_worker;