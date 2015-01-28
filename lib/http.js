var request = require("request"),
	config = require("./../config/config.js");

var http = function(){
};

http.prototype.get = function(link,option,try_times,callback){
	var _this = this;
	request(link,option,function(err,res,body){
		if(err){
			try_times--;
			if(try_times>0){		
				console.log("retry get: " + link);
				_this.get(link,option,try_times,callback);
			}
			else
			{
				callback(true);
				return;
			}
		}
		else
		{
			callback(err,res,body);
			return;
		}
	});
};

http.prototype.post = (function(link,data,option,try_times,callback){
	var _this = this;
	request.post(link,option,function(err,res,body){
		if(err){
			try_times--;
			if(try_times>0){
				console.log("retry post: " + link);
				_this.post(link,data,option,try_times,callback);
			}
			else
			{
				callback(true);
				return;
			}
		}
		else
		{
			callback(err,res,body);
			return;
		}
	}).form(data);
});

module.exports = http;