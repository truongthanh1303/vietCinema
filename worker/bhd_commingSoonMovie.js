
var cheerio = require("cheerio"),
	colors = require("colors");
var http = require("http");
var config 	= require("./../config/config.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");

var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var commingSoonMovie_model = require(config.MODEL_PATH+"commingSoonMovie.js");

var _bhdcommingSoonMovieParser = require(config.PARSER_PATH+ "bhd_commingSoonMovie.js");

var bhd_worker = function(){
	this.http = new httpLib();
	this.bhdParser = new _bhdcommingSoonMovieParser();
	this.commingSoonMovie_model = new commingSoonMovie_model();
	if(bhd_config.commingSoon_movie_link){
		this.link = bhd_config.commingSoon_movie_link;
	}
	else{
		console.log(colors.red("[Worker/bhd_commingSoonMovie.js] link not found check bhd_config.commingSoon_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

bhd_worker.prototype.start = function(option){
	this.http_option = option;
	if(!this.http_option){
		console.log(colors.red("[Worker/bhd_commingSoonMovie.js] BHD - Comming Soon Movie Can not set cookie"));
		return;
	}
	if(!this.link){
		console.log(colors.red("[Worker/bhd_commingSoonMovie.js] BHD - Comming Soon Movie Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.commingSoonMovie_model.bhdRemove(function(err,result){
			this.commingSoonMovie_model.bhdInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/bhd_commingSoonMovie.js] inserted data to Database khoaluan, collection commingSoonMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.commingSoonMovie);
				}
				else{
					console.log(colors.red("[Worker/bhd_commingSoonMovie.js] error on insert data to Database khoaluan, collection commingSoonMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

bhd_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/bhd_commingSoonMovie.js] Starting getting all comming soon movie of BHD Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.bhdParser.getAllMovie($);
			this.getMovieInfo(0,movie_arr,[],function(data){
				callback(data);
				return;
			});
		}
		else{
			callback(null);
			return;
		}
	}.bind(this));
};

bhd_worker.prototype.getMovieInfo = function(index,movie_arr,re,callback){
	if(index == movie_arr.length){
		if(re!=[]){
			callback(re);
		}
		else{
			callback(null);
		}
		return;
	}
	var link = bhd_config.replace_link + movie_arr[index].id;
	console.log("[Worker/bhd_commingSoonMovie.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.bhdParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/bhd_commingSoonMovie.js] Error on getting ",link));
		}
		index++;
		this.getMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
};

bhd_worker.prototype.setCookie = function(option,callback){
	
};
module.exports = bhd_worker;