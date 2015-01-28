// JavaScript Document
var request = require("request"),
	cheerio = require("cheerio");
var config 	= require("./config/config.js"),
	account   = require("./config/account.js").account,
	db_config = require(config.CONFIG_PATH + "db.js");
var fileLib  = require(config.LIB_PATH+ "file.js"),
	textLib = require(config.LIB_PATH + "text.js"),
	httpLib = require(config.LIB_PATH+"http.js"),
	db_model = require(config.MODEL_PATH+"db.js");
db_model.open(function(db){

	var _lotte_schedule 		= require(config.WORKER_PATH+ "lotte_schedule.js");
	var _lotte_department 		= require(config.WORKER_PATH+ "lotte_department.js");
	var _lotte_onScreenMovie 	= require(config.WORKER_PATH+ "lotte_onScreenMovie.js");
	var _lotte_commingSoonMovie = require(config.WORKER_PATH+ "lotte_commingSoonMovie.js");
	var _lotte_promotion 		= require(config.WORKER_PATH+ "lotte_promotion.js");

	var _cgv_schedule = require(config.WORKER_PATH+ "cgv_schedule.js");
	var _cgv_department = require(config.WORKER_PATH+ "cgv_department.js");
	var _cgv_onScreenMovie = require(config.WORKER_PATH+ "cgv_onScreenMovie.js");
	var _cgv_commingSoonMovie = require(config.WORKER_PATH+ "cgv_commingSoonMovie.js");
	var _cgv_promotion = require(config.WORKER_PATH+ "cgv_promotion.js");

	var _galaxy_schedule = require(config.WORKER_PATH+ "galaxy_schedule.js");
	var _galaxy_department = require(config.WORKER_PATH+ "galaxy_department.js");
	var _galaxy_onScreenMovie = require(config.WORKER_PATH+ "galaxy_onScreenMovie.js");
	var _galaxy_commingSoonMovie = require(config.WORKER_PATH+ "galaxy_commingSoonMovie.js");
	var _galaxy_promotion = require(config.WORKER_PATH+ "galaxy_promotion.js");

	var _platinum_schedule = require(config.WORKER_PATH+ "platinum_schedule.js");
	var _platinum_department = require(config.WORKER_PATH+ "platinum_department.js");
	var _platinum_onScreenMovie = require(config.WORKER_PATH+ "platinum_onScreenMovie.js");
	var _platinum_commingSoonMovie = require(config.WORKER_PATH+ "platinum_commingSoonMovie.js");
	var _platinum_promotion = require(config.WORKER_PATH+"platinum_promotion.js");

	var _bhd_schedule = require(config.WORKER_PATH+ "bhd_schedule.js");
	var _bhd_department = require(config.WORKER_PATH+ "bhd_department.js");
	var _bhd_onScreenMovie = require(config.WORKER_PATH+ "bhd_onScreenMovie.js");
	var _bhd_commingSoonMovie = require(config.WORKER_PATH+ "bhd_commingSoonMovie.js");
	var _bhd_promotion = require(config.WORKER_PATH+ "bhd_promotion.js");


	var lotte_schedule = new _lotte_schedule();
	var lotte_department = new _lotte_department();
	var lotte_onScreenMovie = new _lotte_onScreenMovie();
	var lotte_commingSoonMovie = new _lotte_commingSoonMovie();
	var lotte_promotion = new _lotte_promotion();
	var cgv_schedule = new _cgv_schedule();
	var cgv_department = new _cgv_department();
	var cgv_onScreenMovie = new _cgv_onScreenMovie();
	var cgv_commingSoonMovie = new _cgv_commingSoonMovie();
	var cgv_promotion = new _cgv_promotion();
	var galaxy_schedule = new _galaxy_schedule();
	var galaxy_department = new _galaxy_department();
	var galaxy_onScreenMovie = new _galaxy_onScreenMovie();
	var galaxy_commingSoonMovie = new _galaxy_commingSoonMovie();
	var galaxy_promotion = new _galaxy_promotion();
	var platinum_schedule = new _platinum_schedule();
	var platinum_department = new _platinum_department();
	var platinum_onScreenMovie = new _platinum_onScreenMovie();
	var platinum_commingSoonMovie = new _platinum_commingSoonMovie();
	var platinum_promotion = new _platinum_promotion();
	var bhd_onScreenMovie = new _bhd_onScreenMovie();
	var bhd_commingSoonMovie = new _bhd_commingSoonMovie();
	var bhd_promotion = new _bhd_promotion();
	var bhd_schedule = new _bhd_schedule();
	var bhd_department = new _bhd_department();

	lotte_schedule.start();
	lotte_department.start();
	lotte_onScreenMovie.start();
	lotte_commingSoonMovie.start();
	lotte_promotion.start();
	cgv_schedule.start();
	cgv_department.start();
	cgv_onScreenMovie.start();
	cgv_commingSoonMovie.start();
	cgv_promotion.start();
	galaxy_schedule.start();
	galaxy_department.start();
	galaxy_onScreenMovie.start();
	galaxy_commingSoonMovie.start();
	galaxy_promotion.start();
	platinum_schedule.start();
	platinum_department.start();
	platinum_onScreenMovie.start();
	platinum_commingSoonMovie.start();
	platinum_promotion.start();

	bhd_onScreenMovie.setCookie(bhd_onScreenMovie.http_option,function(option){
		bhd_onScreenMovie.start(option);
		bhd_commingSoonMovie.start(option);
		bhd_promotion.start(option);
		bhd_schedule.start(option);
		bhd_department.start(option);
	});
});



/*------------------------------------------------------------------*/
/*                            LOTTE CINEMA                          */
/*------------------------------------------------------------------*/

/*------------------------------------------------------------------*/
/*                            CGV CINEMA                            */
/*------------------------------------------------------------------*/