var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");

var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var onScreenMovie_model = require(config.MODEL_PATH+"onScreenMovie.js");

var _platinumonScreenMovieParser = require(config.PARSER_PATH+ "platinum_onScreenMovie.js");

var platinum_worker = function(){
	this.http = new httpLib();
	this.onScreenMovie_model = new onScreenMovie_model();
	this.platinumParser = new _platinumonScreenMovieParser();
	if(platinum_config.onScreen_movie_link){
		this.link = platinum_config.onScreen_movie_link;
	}
	else{
		console.log(colors.red("[Worker/platinum_onSCreenMovie.js] link not found check platinum_config.onScreen_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

platinum_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/platinum_onSCreenMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.onScreenMovie_model.platinumRemove(function(err,result){
			this.onScreenMovie_model.platinumInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/platinum_onSCreenMovie.js] inserted data to Database khoaluan, collection onScreenMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.onScreenMovie);
				}
				else{
					console.log(colors.red("[Worker/platinum_onSCreenMovie.js] error on insert data to Database khoaluan, collection onScreenMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

platinum_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/platinum_onSCreenMovie.js] Starting getting all onScreen_movie of platinum Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.platinumParser.getAllMovie($);
			this.getMovieInfo(0,movie_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

platinum_worker.prototype.getMovieInfo = function(index,movie_arr,re,callback){
	if(index == movie_arr.length){
		callback(re);
		return;
	}
	var link = movie_arr[index].link;
	console.log("[Worker/platinum_onSCreenMovie.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.platinumParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/lotte_commingSoonMovie.js] Error on getting ",link));
		}
		index++;
		this.getMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
};

module.exports = platinum_worker;