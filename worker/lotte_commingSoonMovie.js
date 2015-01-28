var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	lotte_config = require(config.CONFIG_PATH + "lotte.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var commingSoonMovie_model = require(config.MODEL_PATH+"commingSoonMovie.js");
	
var _lotteCommingSoonMovieParser = require(config.PARSER_PATH+ "lotte_commingSoonMovie.js");

var lotte_worker = function(){
	this.http = new httpLib();
	this.lotteParser = new _lotteCommingSoonMovieParser();
	this.commingSoonMovie_model = new commingSoonMovie_model();
	if(lotte_config.commingSoon_movie_link){
		this.link = lotte_config.commingSoon_movie_link;
	}
	else{
		console.log(colors.red("[Worker/lotte_commingSoonMovie.js] link not found check lotte_config.commingSoon_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
	this.department_arr = [];
}

lotte_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/lotte_commingSoonMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.commingSoonMovie_model.lotteRemove(function(err,result){
			this.commingSoonMovie_model.lotteInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/lotte_commingSoonMovie.js] inserted data to Database khoaluan, collection commingSoonMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.commingSoonMovie);
				}
				else{
					console.log(colors.red("[Worker/lotte_commingSoonMovie.js] error on insert data to Database khoaluan, collection commingSoonMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));	
	}.bind(this));
}

lotte_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/lotte_commingSoonMovie.js] Start getting all comming soon movie of Lotte Cinema");
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
	console.log("[Worker/lotte_commingSoonMovie.js] Getting movie info at ",link);
	this.http.get(link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.lotteParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/lotte_commingSoonMovie.js] Error on getting ",movie_arr[index].name));
		}
		index++;
		this.getAllMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
}

module.exports = lotte_worker;