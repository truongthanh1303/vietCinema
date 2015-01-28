var cheerio = require("cheerio"),
	colors = require("colors");
var http = require("http");
var config 	= require("./../config/config.js"),
	bhd_config = require(config.CONFIG_PATH + "bhd.js");

var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js");

var onScreenMovie_model = require(config.MODEL_PATH+"onScreenMovie.js");

var _bhdonScreenMovieParser = require(config.PARSER_PATH+ "bhd_onScreenMovie.js");

var bhd_worker = function(){
	this.http = new httpLib();
	this.bhdParser = new _bhdonScreenMovieParser();
	this.onScreenMovie_model = new onScreenMovie_model();
	if(bhd_config.onScreen_movie_link){
		this.link = bhd_config.onScreen_movie_link;
	}
	else{
		console.log(colors.red("[Worker/bhd_onScreenMovie.js] link not found check bhd_config.onScreen_movie_link"));
		this.link = "";
	}
	this.http_option = config.cloneHttpOption();
};

bhd_worker.prototype.start = function(option){
	this.http_option = option;
	if(!this.http_option){
		console.log(colors.red("[Worker/bhd_onScreenMovie.js] Can not set cookie"));
		return;
	}
	if(!this.link){
		console.log(colors.red("[Worker/bhd_onScreenMovie.js] Link not found"));
		return;
	}
	this.getAllMovie(function(data){
		this.onScreenMovie_model.bhdRemove(function(err,result){
			this.onScreenMovie_model.bhdInsert(data,function(err,result){
				if(!err){
					console.log(colors.green("[Worker/bhd_onScreenMovie.js] inserted data to Database khoaluan, collection onScreenMovie" ));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.onScreenMovie);
				}
				else{
					console.log(colors.red("[Worker/bhd_onScreenMovie.js] error on insert data to Database khoaluan, collection onScreenMovie"));
					setTimeout(function(){
						this.start();
					}.bind(this),config.timeout.error);
				}
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

bhd_worker.prototype.getAllMovie = function(callback){
	console.log("[Worker/bhd_onScreenMovie.js] Starting getting all movie of BHD Cinema...");
	this.http.get(this.link,this.http_option,6,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var movie_arr = this.bhdParser.getAllMovie($);
			this.getMovieInfo(0,movie_arr,[],function(data){
				callback(data);
			});
		}
		else{
			callback(null);
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
	console.log("[Worker/bhd_onScreenMovie.js] go to...",link);
	this.http.get(link,this.http_option,3,function(err,res,body){
		if(!err){
			var $ = cheerio.load(body);
			var info = this.bhdParser.getMovieInfo($);
			info.image = movie_arr[index].image;
			re.push(info);
		}
		else{
			console.log(colors.red("[Worker/bhd_onScreenMovie.js] Error on getting ",link));
		}
		index++;
		this.getMovieInfo(index,movie_arr,re,callback);
	}.bind(this));
};

bhd_worker.prototype.setCookie = function(option,callback){
	http.get(this.link,function(res){
		if(!res.headers || !res.headers['set-cookie'] || !res.headers['set-cookie'][0]){
			callback(null);
			return;
		}
		var cookie = res.headers['set-cookie'][0].split(";")[0];
		option.headers["cookie"] = cookie;
		callback(option);
		return;
	}).on("error",function(err){
		callback(null);
		return;
	});
};
module.exports = bhd_worker;