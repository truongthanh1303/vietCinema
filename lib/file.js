var fs 	= require("fs"),
	path  = require("path");
var file = {
	writeFile : function(fileName,content){
		fs.writeFile(__dirname + "\\..\\log\\" + fileName , content ,{encoding:"utf-8"} , function(err){
			if(!err){
				console.log("File writed at : " + path.normalize(__dirname + "\\..\\log\\" +  fileName) );
			}
			else
			{
				console.log("error on write log file");
			}
		});
	},
	readFile : function(fileName,callback){
		console.log("Read file at : ",path.normalize(__dirname + "\\..\\log\\" +  fileName));
		fs.readFile(__dirname + "\\..\\log\\" +  fileName,{encoding:"utf-8"},function(err,data){
			if(err){
				callback(null);
			}
			else{
				callback(data);
			}
		});
	}
}

module.exports = file;