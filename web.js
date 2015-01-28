var express =  require("express"),
	session = require("express-session");
	app =  express(),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	path = require("path"),
	routers =  require("./router/routers.js"),
	ajax_routers = require("./router/ajax.js"),
	post_routers = require("./router/post.js");
var config = require("./config/config.js");

var db_model = require(config.MODEL_PATH + "db.js"),
	_cinema_model = require(config.MODEL_PATH + "cinema.js"),
	_onScreenMovie_model = require(config.MODEL_PATH + "onScreenMovie.js"),
	_commingSoonMovie_model = require(config.MODEL_PATH + "commingSoonMovie.js"),
	_schedule_model = require(config.MODEL_PATH + "schedule.js"),
	_promotion_model = require(config.MODEL_PATH + "promotion.js"),
	_point_model = require(config.MODEL_PATH + "point.js"),
	_user_model = require(config.MODEL_PATH + "user.js");

cinema_model 			= null,
onScreenMovie_model 	= null,
commingSoonMovie_model 	= null,
schedule_model 			= null,
promotion_model 		= null;
point_model 			= null;

app.set("view engine","jade");
app.set("views",path.join(__dirname , "/view/layout"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('hoadaica',{maxAge:3600000}));
app.use(session({resave:true, saveUninitialized: true,secret:'hoadaica',cookie:{maxAge:3600000}}));
app.use("/img",express.static(__dirname + "/public/img"));
app.use("/js",express.static(__dirname + "/public/library"));
app.use("/font",express.static(__dirname + "/public/font"));
app.use("/css",express.static(__dirname + "/view/css"));
app.use("/",express.static(__dirname + "/public"));

/*------------CONFIG ROUTER----------------------*/

app.use(function(req, res, next) {
    req.cinema_model 			= cinema_model;
    req.onScreenMovie_model 	= onScreenMovie_model;
    req.commingSoonMovie_model 	= commingSoonMovie_model;
    req.schedule_model 			= schedule_model;
    req.promotion_model 		= promotion_model;
    req.user_model 				= user_model;
    req.point_model 			= point_model;
    req.company_arr= company_arr;
    next();
});

app.use("/",routers);
app.use("/", ajax_routers);
app.use("/", post_routers);

app.use(function(req, res, next) {
    res.status(404).send("NOT FOUND");
	res.end();
});

app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).send("SOMETHING WRONG HAPPEND");
  	res.end();
});
var company_arr = null;
db_model.open(function(err,db){
	cinema_model = new _cinema_model(),
	onScreenMovie_model = new _onScreenMovie_model(),
	commingSoonMovie_model = new _commingSoonMovie_model(),
	schedule_model = new _schedule_model(),
	promotion_model = new _promotion_model();
	user_model = new _user_model();
	point_model = new _point_model();
	cinema_model.distinct("company",{},function(err,data){
		 	company_arr = data;
		 	var server = app.listen(config.web_port,function(){
			console.log("Start Web Server On Port",server.address().port);
		});
	});
});

