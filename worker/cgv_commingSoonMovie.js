var cheerio = require("cheerio"),
	colors = require("colors");

var config 	= require("./../config/config.js"),
	cgv_config = require(config.CONFIG_PATH + "cgv.js");
	
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");
	
var commingSoonMovie_model = require(config.MODEL_PATH+"commingSoonMovie.js");

var _cgvcommingSoonMovieParser = require(config.PARSER_PATH+ "cgv_commingSoonMovie.js");

var cgv_worker = function(){
	this.http = new httpLib();
	this.cgvParser = new _cgvcommingSoonMovieParser();
	this.commingSoonMovie_model = new commingSoonMovie_model();
	if(cgv_config.commingSoon_movie_link){
		this.link = cgv_config.commingSoon_movie_link;
	}
	else{
		console.log(colors.red("[Worker/cgv_commingSoonMovie.js] link not found check cgv_config.commingSoon_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

cgv_worker.prototype.start = function(){
	if(!this.link){
		console.log(colors.red("[Worker/cgv_commingSoonMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.commingSoonMovie_model.cgvRemove(function(err,result){
			this.commingSoonMovie_model.cgvInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/cgv_commingSoonMovie.js] inserted data to Database khoaluan, collection commingSoonMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.commingSoonMovie);
				}
				else{
					console.log(colors.red("[Worker/cgv_commingSoonMovie.js] error on insert data to Database khoaluan, collection commingSoonMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

cgv_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/cgv_commingSoonMovie.js] Start getting all comming soon movie of CGV Cinema");
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
	console.log("[Worker/cgv_commingSoonMovie.js] Getting movie info at ",link);
	this.http.get(link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.cgvParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/cgv_commingSoonMovie.js] Error on getting ",link));
		}
		index++;
		this.getAllMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
}

module.exports = cgv_worker;