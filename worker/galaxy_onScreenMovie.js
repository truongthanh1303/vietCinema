var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var onScreenMovie_model = require(config.MODEL_PATH+"onScreenMovie.js");

var _galaxyonScreenMovieParser = require(config.PARSER_PATH+ "galaxy_onScreenMovie.js");

var galaxy_worker = function(){
	this.http = new httpLib();
	this.onScreenMovie_model = new onScreenMovie_model();
	this.galaxyParser = new _galaxyonScreenMovieParser();
	if(galaxy_config.onScreen_movie_link){
		this.link = galaxy_config.onScreen_movie_link;
	}
	else{
		console.log(colors.red("[Worker/galaxy_onSCreenMovie.js] link not found check galaxy_config.onScreen_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

galaxy_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/galaxy_onSCreenMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.onScreenMovie_model.galaxyRemove(function(err,result){
			this.onScreenMovie_model.galaxyInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/galaxy_onSCreenMovie.js] inserted data to Database khoaluan, collection onScreenMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.onScreenMovie);
				}
				else{
					console.log(colors.red("[Worker/galaxy_onSCreenMovie.js] error on insert data to Database khoaluan, collection onScreenMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

galaxy_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/galaxy_onSCreenMovie.js] Starting getting all movie of Galaxy Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.galaxyParser.getAllMovie($);
			this.getMovieInfo(0,movie_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
		}
	}.bind(this));
};

galaxy_worker.prototype.getMovieInfo = function(index,movie_arr,re,callback){
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
	console.log("[Worker/galaxy_onSCreenMovie.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.galaxyParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/galaxy_onSCreenMovie.js] Error on getting ",link));
		}
		index++;
		this.getMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
};

module.exports = galaxy_worker;