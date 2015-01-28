// JavaScript Document
var path = require("path");
var months = [];
months["January"] = 1;
months["February"] = 2;
months["March"] = 3;
months["April"] = 4;
months["May"] = 5;
months["June"] = 6;
months["July"] = 7;
months["August"] = 8;
months["September"] = 9;
months["October"] = 10;
months["November"] = 11;
months["December"] = 12;
var config = {
	/*-----------------------------------------------------------*/
	/*                   PATH DEFINE							 */
	/*-----------------------------------------------------------*/
	LIB_PATH : path.join(__dirname, '../lib/'),// __dirname + "\\..\\lib\\",
	LOG_PATH : path.join(__dirname, '../log/'),// __dirname + "\\..\\log\\",
	PARSER_PATH : path.join(__dirname, '../parser/'),//__dirname + "\\..\\parser\\",
	CONFIG_PATH : path.join(__dirname, '/'),// __dirname + "\\",
	WORKER_PATH : path.join(__dirname, '../worker/'),// __dirname + "\\..\\worker\\",
	MODEL_PATH  : path.join(__dirname, '../model/'),//__dirname + "\\..\\model\\",
	/*-----------------------------------------------------------*/
	http_option : {
	encoding:"utf-8",
	timeout:2*60*1000,
	headers:{
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:31.0) Gecko/20100101 Firefox/31.0"
		}
	},
	cloneHttpOption : function(){
		var new_option = {};
		for(var i in this.http_option){
			if(this.http_option[i].length!=0 && typeof this.http_option[i]=="object"){
				new_option[i] = {};
				for(var j in this.http_option[i])
				{
					new_option[i][j] = this.http_option[i][j];
				}
			}
			else{
				new_option[i] = this.http_option[i];
			}
		}
		return new_option;
	},
	/*-----------------------------------------------------------*/
	/*--------------------------- TIME OUT --------------------------------*/
	timeout:{
		promotion : 1000*60*60*24,
		schedule : 1000*60*60*2,
		onScreenMovie : 1000*60*60*24,
		commingSoonMovie : 1000*60*60*24,
		department : 1000*60*60*24*10,
		error:1000*2*60,
	},
	/*-----------------------------------------------------------*/
	/*                   PORT							 */
	/*-----------------------------------------------------------*/
	web_port : 13392,
}

module.exports = config;