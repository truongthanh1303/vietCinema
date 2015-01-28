var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	platinum_config = require(config.CONFIG_PATH + "platinum.js");

var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var commingSoonMovie_model = require(config.MODEL_PATH+"commingSoonMovie.js");

var _platinumcommingSoonMovieParser = require(config.PARSER_PATH+ "platinum_commingSoonMovie.js");

var platinum_worker = function(){
	this.http = new httpLib();
	this.platinumParser = new _platinumcommingSoonMovieParser();
	this.commingSoonMovie_model = new commingSoonMovie_model();
	if(platinum_config.commingSoon_movie_link){
		this.link = platinum_config.commingSoon_movie_link;
	}
	else{
		console.log(colors.red("[Worker/platinum_commingSoonMovie.js] link not found check platinum_config.commingSoon_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

platinum_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/platinum_commingSoonMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.commingSoonMovie_model.platinumRemove(function(err,result){
			this.commingSoonMovie_model.platinumInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/platinum_commingSoonMovie.js] inserted data to Database khoaluan, collection commingSoonMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.commingSoonMovie);
				}
				else{
					console.log(colors.red("[Worker/platinum_commingSoonMovie.js] error on insert data to Database khoaluan, collection commingSoonMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

platinum_worker.prototype.getAllMovie = function(callback){
	console.log("Worker/platinum_commingSoonMovie.js] Starting getting all commingSoon_movie of platinum Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.platinumParser.getAllMovie($);// console.log(movie_arr);
			this.getMovieInfo(0, movie_arr, [], function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

platinum_worker.prototype.getMovieInfo = function(index ,movie_arr, re, callback){
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
	console.log("Worker/platinum_commingSoonMovie.js] go to...",link);
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
		this.getMovieInfo(index, movie_arr, re, callback);
	}.bind(this));
};

module.exports = platinum_worker;