var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	galaxy_config = require(config.CONFIG_PATH + "galaxy.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var commingSoonMovie_model = require(config.MODEL_PATH+"commingSoonMovie.js");
	
var _galaxycommingSoonMovieParser = require(config.PARSER_PATH+ "galaxy_commingSoonMovie.js");

var galaxy_worker = function(){
	this.http = new httpLib();
	this.galaxyParser = new _galaxycommingSoonMovieParser();
	this.commingSoonMovie_model = new commingSoonMovie_model();
	if(galaxy_config.commingSoon_movie_link){
		this.link = galaxy_config.commingSoon_movie_link;
	}
	else{
		console.log(colors.red("[Worker/galaxy_commingSoonMovie.js] link not found check galaxy_config.commingSoon_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

galaxy_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/galaxy_commingSoonMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.commingSoonMovie_model.galaxyRemove(function(err,result){
			this.commingSoonMovie_model.galaxyInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/galaxy_commingSoonMovie.js] inserted data to Database khoaluan, collection commingSoonMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.commingSoonMovie);
				}
				else{
					console.log(colors.red("[Worker/galaxy_commingSoonMovie.js] error on insert data to Database khoaluan, collection commingSoonMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));	
	}.bind(this));
};

galaxy_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/galaxy_commingSoonMovie.js] Starting getting all comming soon movie of Galaxy Cinema...");
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
	console.log("[Worker/galaxy_commingSoonMovie.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.galaxyParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/galaxy_commingSoonMovie.js] Error on getting ",link));
		}
		index++;
		this.getMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
};

module.exports = galaxy_worker;