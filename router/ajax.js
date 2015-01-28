var express = require("express"),
	routers = express.Router();
var ObjectId = require('mongodb').ObjectID;
var config = require("./../config/config.js");
var materialMap = require('./routers').materialMap;
var textLib = require(config.LIB_PATH + "text.js");
var _geo = require(config.LIB_PATH + "geolocation.js");
var geo = new _geo();
var _rank = require(config.LIB_PATH + "rank.js");
var rank = new _rank();
var point = require(config.LIB_PATH + "point.js");

routers.get("/",function(req,res){
	res.render("main_layout");
	res.end();

});

routers.get("/rank",function(req,res){
	var query = req.query;
	var longitude = req.query.longitude;
	var latitude = req.query.latitude;
	var schedule_arr_temp = [];
	var cgv_schedule_arr 			= [];
	var bhd_schedule_arr			= [];
	var lotte_schedule_arr 			= [];
	var galaxy_schedule_arr 		= [];
	var platinum_schedule_arr 		= [];
	var cgv_movie_arr 		= [];
	var bhd_movie_arr 		= [];
	var lotte_movie_arr 	= [];
	var galaxy_movie_arr 	= [];
	var platinum_movie_arr 	= [];
	var cgv_commingSoonMovie_arr 		= [];
	var bhd_commingSoonMovie_arr 		= [];
	var lotte_commingSoonMovie_arr 		= [];
	var galaxy_commingSoonMovie_arr 	= [];
	var platinum_commingSoonMovie_arr 	= [];
	var user = null;
	var cinema_user = req.query['cinema_user']?req.query['cinema_user']:[];
	var kind_user = req.query['kind_user']?req.query['kind_user']:[];
	var jobs_user = req.query['jobs_user']?req.query['jobs_user']:[];
	var age_user = req.query['age_user']?req.query['age_user']:0;
	var cineplex_user = req.query['cineplex_user']?req.query['cineplex_user']:0;
	var name_user = req.query['name_user'];
	var	radius_enable = req.query['radius_enable']==="true";
	var radius_user = req.query['radius_user'];
	var director_user = req.query['director_user']?req.query['director_user'].split(","):[];
	var player_user = req.query['player_user']?req.query['player_user'].split(","):[];
	var cinema_enable = req.query['cinema_enable']==="true";
	var kind_enable = req.query['kind_enable']==="true";
	var	location_enable = req.query['location_enable']==="true";
	var jobs_enable = req.query['jobs_enable']==="true";
	var age_enable = req.query['age_enable']==="true";
	var name_enable = req.query['name_enable']==="true";
	var director_enable = req.query['director_enable']==="true";
	var player_enable = req.query['player_enable']==="true";
	/*--------------------------*/
	var query_str = req.query['find-query'];
	query_str = textLib.convertUtf8ToNonUtf8(query_str);
	query_str = textLib.clearBlankSpace(" " + query_str + " ");
	query_str = query_str.toLowerCase();
	var query_arr = query_str.split(" ");
	/*--------------------------*/
	if(!req.session.user && !req.signedCookies.user){
		res.send({error:2});
		res.end();
		return;
	}
	else{
		if(req.session.user){
			user = req.session.user;
		}
		else {
			user = req.signedCookies.user;
		}
	}
	req.point_model.findAll_point(function(err,point_arr){
		if(err){
			res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/"});
			res.end();
			return;
		}
		var kind_point = point_arr[0]['kind_arr']?point_arr[0]['kind_arr']:[];
		var job_point = point_arr[0]['job_arr']?point_arr[0]['job_arr']:[];
		var rank_point = point_arr[0]['rank_arr']?point_arr[0]['rank_arr']:[];

		console.log("Process and sort data...");
		if(err){
			res.send({err:1});
			res.end();
			return;
		}
		
		req.schedule_model.findAllSchedule(function(err,schedule_arr){
			if(err){
				res.render("error",{message:"Error getting data from database"});
				res.end();
				return;
			}
			req.onScreenMovie_model.findAllMovie(function(err,movie_arr){
				if(err){
					res.render("error",{message:"Error getting data from database"});
					res.end();
					return;
				}
				req.commingSoonMovie_model.findAllCommingsoonMovie(function(err,commingSoonMovie_arr){
						if(err){
						res.render("error",{message:"Error getting data from database"});
						res.end();
						return;
					}
					rank.getScheduleByCompany(schedule_arr,cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr);
					rank.getOnScreenMovieByCompany(movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr);
					rank.getCommingSoonMovieByCompany(commingSoonMovie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr);
					rank.getInfoForScheduleArr(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr,movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr);
					cgv_schedule_arr = rank.optimizeScheduleArr(cgv_schedule_arr);
					bhd_schedule_arr = rank.optimizeScheduleArr(bhd_schedule_arr);
					lotte_schedule_arr = rank.optimizeScheduleArr(lotte_schedule_arr);
					galaxy_schedule_arr = rank.optimizeScheduleArr(galaxy_schedule_arr);
					platinum_schedule_arr = rank.optimizeScheduleArr(platinum_schedule_arr);
					schedule_arr_temp = rank.pushIntoOne(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr);	
					var temp = null;
					var suggest = false;
					if(query_str!=''){
						var kind_arr_v2 = point.getPointArr2(kind_point,query_arr);
						temp = rank.rankQuery(rank_point,query_arr,schedule_arr_temp,kind_arr_v2);
						if(temp.length){
							temp = rank.advanceRank(rank_point,kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,cineplex_user,age_user,job_point,jobs_user,temp);
						}
						else{
							temp = rank.advanceRankV2(rank_point,kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,cineplex_user,age_user,job_point,jobs_user,schedule_arr_temp);
							suggest = true;
						}
						if(!temp.length){
							temp =	rank.advanceRankV2(rank_point,true,true,true,true,true,true,user['favorite-kind'],kind_point,user['favorite-director'],user['favorite-player'],user['favorite-cinema'],cineplex_user,user['birthday-year'],job_point,user['job'],schedule_arr_temp);
							suggest = true;
						}
					}
					else{
						temp = rank.advanceRankV2(rank_point,kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,cineplex_user,age_user,job_point,jobs_user,schedule_arr_temp);
						if(!temp.length){
							temp =	rank.advanceRankV2(rank_point,true,true,true,true,true,true,user['favorite-kind'],kind_point,user['favorite-director'],user['favorite-player'],user['favorite-cinema'],user['favorite-company'],user['birthday-year'],job_point,user['job'],schedule_arr_temp);
							suggest = true;
						}
					}	
					if(location_enable && longitude!=-1 && latitude!=-1){
						console.log("Caculate Distance...");
						req.cinema_model.findAllDepartment(function(err,department_arr){
							if(err){
								res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/"});
								res.end();
								return;
							}
							//console.log(department_arr.length);
							//department_arr = rank.optimizeDepartmentArr(temp,department_arr);
							//console.log(department_arr.length);
							geo.distance(latitude,longitude,0,geo.step,department_arr,[],function(err,distance_arr){
								distance_arr = rank.createDistanceArr(rank_point,distance_arr);
								temp = rank.rankDistance(temp,distance_arr);
								if(radius_enable && radius_user > 1){
									temp = rank.removeDistance(temp,radius_user);
								}
								temp = rank.pointHeapSort(temp);
								temp = rank.rankSamePointArr(temp);
								res.send({suggest:suggest,schedule_arr:temp});
								res.end();
							});
						});
					}
					else{
						temp = rank.pointHeapSort(temp);
						temp = rank.rankSamePointArr(temp);
						res.send({suggest:suggest,schedule_arr:temp});
						res.end();
					}	
				});
			});
		});
	});
	// req.cinema_model.findAllDepartment(function(err,department_arr){
	// 	if(err){
	// 		res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/"});
	// 		res.end();
	// 		return;
	// 	}
	// 	req.point_model.findAll_point(function(err,point_arr){
	// 		if(err){
	// 			res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/"});
	// 			res.end();
	// 			return;
	// 		}
	// 		var kind_point = point_arr[0]['kind_arr']?point_arr[0]['kind_arr']:[];
	// 		var job_point = point_arr[0]['job_arr']?point_arr[0]['job_arr']:[];
	// 		if(location_enable && longitude!=-1 && latitude!=-1){
	// 			console.log("Caculate Distance...");
	// 			geo.distance(latitude,longitude,0,geo.step,department_arr,[],function(err,distance_arr){
	// 				console.log("Process and sort data...");
	// 				if(err){
	// 					res.send({err:1});
	// 					res.end();
	// 					return;
	// 				}
	// 				distance_arr = rank.createDistanceArr(distance_arr);
	// 				req.schedule_model.findAllSchedule(function(err,schedule_arr){
	// 					if(err){
	// 						res.render("error",{message:"Error getting data from database"});
	// 						res.end();
	// 						return;
	// 					}
	// 					req.onScreenMovie_model.findAllMovie(function(err,movie_arr){
	// 						if(err){
	// 							res.render("error",{message:"Error getting data from database"});
	// 							res.end();
	// 							return;
	// 						}
	// 						req.commingSoonMovie_model.findAllCommingsoonMovie(function(err,commingSoonMovie_arr){
	// 								if(err){
	// 								res.render("error",{message:"Error getting data from database"});
	// 								res.end();
	// 								return;
	// 							}
	// 							rank.getScheduleByCompany(schedule_arr,cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr);
	// 							rank.getOnScreenMovieByCompany(movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr);
	// 							rank.getCommingSoonMovieByCompany(commingSoonMovie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr);
	// 							rank.getInfoForScheduleArr(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr,movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr);
	// 							cgv_schedule_arr = rank.optimizeScheduleArr(cgv_schedule_arr);
	// 							bhd_schedule_arr = rank.optimizeScheduleArr(bhd_schedule_arr);
	// 							lotte_schedule_arr = rank.optimizeScheduleArr(lotte_schedule_arr);
	// 							galaxy_schedule_arr = rank.optimizeScheduleArr(galaxy_schedule_arr);
	// 							platinum_schedule_arr = rank.optimizeScheduleArr(platinum_schedule_arr);
	// 							schedule_arr_temp = rank.pushIntoOne(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr);
	// 							schedule_arr_temp = rank.rankDistance(schedule_arr_temp,distance_arr);
	// 							var temp = null;
	// 							if(query_str!=''){
	// 								var kind_arr_v2 = point.getPointArr2(kind_point,query_arr);
	// 								temp = rank.rankQuery(query_arr,schedule_arr_temp,kind_arr_v2);
	// 							}
	// 							if(temp && temp.length){
	// 								temp = rank.advanceRank(kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,user['favorite-company'],age_user,job_point,jobs_user,temp);
	// 								temp = rank.pointHeapSort(temp);
	// 								res.send({schedule_arr:temp});
	// 								res.end();
	// 								return;
	// 							}
	// 							temp =	rank.advanceRankV2(kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,user['favorite-company'],age_user,job_point,jobs_user,schedule_arr_temp);
	// 							if(temp.length){
	// 								temp = rank.pointHeapSort(temp);
	// 								if(query_str!=''){
	// 									res.send({suggest:true,schedule_arr:temp});
	// 								}
	// 								else{
	// 									res.send({schedule_arr:temp});
	// 								}
	// 								res.end();
	// 								return;
	// 							}
	// 							schedule_arr_temp =	rank.advanceRankV2(true,true,true,true,true,true,user['favorite-kind'],kind_point,user['favorite-director'],user['favorite-player'],user['favorite-cinema'],user['favorite-company'],user['birthday-year'],job_point,user['job'],schedule_arr_temp);
	// 							schedule_arr_temp = rank.pointHeapSort(schedule_arr_temp);
	// 							res.send({suggest:true,schedule_arr:schedule_arr_temp});
	// 							res.end();
	// 						});
	// 					});
	// 				});
	// 			});
	// 		}
	// 		else{
	// 			console.log("Process and sort data...");
	// 			req.schedule_model.findAllSchedule(function(err,schedule_arr){
	// 				if(err){
	// 					res.render("error",{message:"Error getting data from database"});
	// 					res.end();
	// 					return;
	// 				}
	// 				req.onScreenMovie_model.findAllMovie(function(err,movie_arr){
	// 					if(err){
	// 						res.render("error",{message:"Error getting data from database"});
	// 						res.end();
	// 						return;
	// 					}
	// 					req.commingSoonMovie_model.findAllCommingsoonMovie(function(err,commingSoonMovie_arr){
	// 						if(err){
	// 							res.render("error",{message:"Error getting data from database"});
	// 							res.end();
	// 							return;
	// 						}
	// 						rank.getScheduleByCompany(schedule_arr,cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr);
	// 						rank.getOnScreenMovieByCompany(movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr);
	// 						rank.getCommingSoonMovieByCompany(commingSoonMovie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr);
	// 						rank.getInfoForScheduleArr(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr,movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr);
	// 						cgv_schedule_arr = rank.optimizeScheduleArr(cgv_schedule_arr);
	// 						bhd_schedule_arr = rank.optimizeScheduleArr(bhd_schedule_arr);
	// 						lotte_schedule_arr = rank.optimizeScheduleArr(lotte_schedule_arr);
	// 						galaxy_schedule_arr = rank.optimizeScheduleArr(galaxy_schedule_arr);
	// 						platinum_schedule_arr = rank.optimizeScheduleArr(platinum_schedule_arr);
	// 						schedule_arr_temp = rank.pushIntoOne(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr);
	// 						var temp = null;
	// 						if(query_str!=''){
	// 							var kind_arr_v2 = point.getPointArr2(kind_point,query_arr);
	// 							temp = rank.rankQuery(query_arr,schedule_arr_temp,kind_arr_v2);
	// 						}
	// 						if(temp && temp.length){
	// 							temp = rank.advanceRank(kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,user['favorite-company'],age_user,job_point,jobs_user,temp);
	// 							temp = rank.pointHeapSort(temp);
	// 							res.send({schedule_arr:temp});
	// 							res.end();
	// 							return;
	// 						}

	// 						temp =	rank.advanceRankV2(kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,user['favorite-company'],age_user,job_point,jobs_user,schedule_arr_temp);
	// 						if(temp.length){
	// 							temp = rank.pointHeapSort(temp);
	// 							if(query_str!=''){
	// 								res.send({suggest:true,schedule_arr:temp});
	// 							}
	// 							else{
	// 								res.send({schedule_arr:temp});
	// 							}
	// 							res.end();
	// 							return;
	// 						}
	// 						schedule_arr_temp =	rank.advanceRankV2(true,true,true,true,true,true,user['favorite-kind'],kind_point,user['favorite-director'],user['favorite-player'],user['favorite-cinema'],user['favorite-company'],user['birthday-year'],job_point,user['job'],schedule_arr_temp);
	// 						// if(kind_enable){
	// 						// 	schedule_arr_temp =	rank.rankKind(schedule_arr_temp,kind_user,kind_point);
	// 						// }
	// 						// if(director_enable){
	// 						// 	schedule_arr_temp = rank.rankDirectorPlayer(schedule_arr_temp,director_user,'director');
	// 						// }
	// 						// if(player_enable){
	// 						// 	schedule_arr_temp = rank.rankDirectorPlayer(schedule_arr_temp, player_user,'player');
	// 						// }
	// 						// if(cinema_enable){
	// 						// 	schedule_arr_temp = rank.rankCineplex(schedule_arr_temp, cinema_user);
	// 						// 	schedule_arr_temp = rank.rankCineCompany(schedule_arr_temp, user['favorite-company']);
	// 						// }
	// 						// if(age_enable){
	// 						// 	schedule_arr_temp = rank.rankAge(age_user,schedule_arr_temp);
	// 						// }
	// 						// if(jobs_enable){
	// 						// 	schedule_arr_temp = rank.rankJob(kind_point,job_point,jobs_user,schedule_arr_temp);
	// 						// }
	// 						schedule_arr_temp = rank.pointHeapSort(schedule_arr_temp);
	// 						res.send({suggest:true,schedule_arr:schedule_arr_temp});
	// 						res.end();
	// 					});
	// 				});
	// 			});
	// 		}
	// 	});
	// });
});

routers.get("/ajax_check_username",function(req,res){
	var username = req.query.username.toLowerCase();
	req.user_model.findUsername(username,function(err,data){
		if(!data.length){
			res.send({success:"Username này có thể sử dụng"});
		}
		else{
			res.send({error:"Username đã tồn tại"});
		}
		res.end();
	});
});

routers.get("/ajax_check_email",function(req,res){
	var email = req.query.email;
	req.user_model.findEmail(email,function(err,data){
		if(!data.length){
			res.send({success:"Email này có thể sử dụng"});
		}
		else{
			res.send({error:"Email đã tồn tại"});
		}
		res.end();
	});
});

routers.get("/ajax_get_login_form",function(req,res){
	var link = "/suggestions";
	var admin_link = "/admin";
	var edit_link ="/edit-user-info";
	if(req.session.user){
		var username = req.session.user.username;
		//res.send("<style type='text/css'>#login-form{text-align: center;position: fixed;top: 200px;right: -240px;-moz-transition: right 0.5s;-webkit-transition: right 0.5s; -ms-transition: right 0.5s;transition: right 0.5s; z-index:1000; }#login-form > table{width:255px;}#login-form > table > tbody > tr > td:nth-child(2){width:235px;height: 130px;background: #374551;}#login-form a{color:#A9F5F2;}#login-form:hover{right: 0px;}#login-form table span{display: block;font-weight: bold;font-size: 15px;border-radius: 8px 0 0 8px;background: #374551;width: 10px;padding: 3px 5px 3px 5px;}#login-form table{text-align: center;color: white;border-spacing: 0;}#login-form td{padding: 0px;}#login-form table table td{padding: 10px 5px 10px 5px;}#login-form table table{background: #374551;}#login-form button{background: none;border:1px solid white;border-radius: 5px;color: white;padding: 3px 7px 3px 7px;}#login-form button:hover{cursor: pointer;}</style><div id='login-form'><table><tr><td><span>L<br/>o<br/>g<br/>i<br/>n</span></td><td><p>Welcome " + username + "</p><a href='" + link + "'><p>Check new movie today!</p></a><p><button type='button' id='login-logout'>Logout</button></p></td></tr></table></div>");
		var response = "<div class='icon col-md-2 col-lg-2'><span class='glyphicon glyphicon-log-in'></span></div><div id='login-form' class='col-md-10 col-lg-10'><h3>Welcome " + username + "</h3><div class='input-group'><br/><a href='" + link + "'><p>Check new movie today!</p></a>";
		response+= "<a href='" + edit_link + "'><p>Edit Your Profile!</p></a>";
		if(req.session.user.role && req.session.user.role=="admin"){
			response+= "<a href='" + admin_link + "'><p>Admin Panel!</p></a>";
		}
		response+="</div><div class='clearfix'></div><br/><div class='col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3'><button id='login-logout' class='btn btn-info' type='button'>Đăng Xuất</button></div></div>";
		nav_add_obj = "<li><a href='"+link+"'>GỢI Ý PHIM</a></li>";
		res.send({success: response, nav_add_obj: nav_add_obj});
		//res.send(response);
		res.end();
	}
	else if(req.signedCookies.user){
		var username = req.signedCookies.user.username;
		req.session.user = req.signedCookies.user;
		//res.send("<style type='text/css'>#login-form{text-align: center;position: fixed;top: 200px;right: -240px;-moz-transition: right 0.5s;-webkit-transition: right 0.5s; -ms-transition: right 0.5s;transition: right 0.5s; z-index:1000; }#login-form > table{width:255px;}#login-form > table > tbody > tr > td:nth-child(2){width:235px;height: 130px;background: #374551;}#login-form a{color:#A9F5F2;}#login-form:hover{right: 0px;}#login-form table span{display: block;font-weight: bold;font-size: 15px;border-radius: 8px 0 0 8px;background: #374551;width: 10px;padding: 3px 5px 3px 5px;}#login-form table{text-align: center;color: white;border-spacing: 0;}#login-form td{padding: 0px;}#login-form table table td{padding: 10px 5px 10px 5px;}#login-form table table{background: #374551;}#login-form button{background: none;border:1px solid white;border-radius: 5px;color: white;padding: 3px 7px 3px 7px;}#login-form button:hover{cursor: pointer;}</style><div id='login-form'><table><tr><td><span>L<br/>o<br/>g<br/>i<br/>n</span></td><td><p>Welcome " + username + "</p><a href='" + link + "'><p>Check new movie today!</p></a><p><button type='button' id='login-logout'>Logout</button></p></td></tr></table></div>");
		var response = "<div class='icon col-md-2 col-lg-2'><span class='glyphicon glyphicon-log-in'></span></div><div id='login-form' class='col-md-10 col-lg-10'><h3>Welcome " + username + "</h3><div class='input-group'><br/><a href='" + link + "'><p>Check new movie today!</p></a>";
		response+= "<a href='" + edit_link + "'><p>Edit Your Profile!</p></a>";
		if(req.session.user.role && req.session.user.role=="admin"){
			response+= "<a href='" + admin_link + "'><p>Admin Panel!</p></a>";
		}
		response+="</div><div class='clearfix'></div><br/><div class='col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3'><button id='login-logout' class='btn btn-info' type='button'>Đăng Xuất</button></div></div>";
		nav_add_obj = "<li><a href='"+link+"'>GỢI Ý PHIM</a></li>";
		res.send({success: response, nav_add_obj: nav_add_obj});
		//res.send(response);
		res.end();
	}
	else{
		//res.send("<style type='text/css'>#login-form > table > tbody > tr > td:nth-child(2){width:235px;height: 130px;background: #374551;}#login-form a{color:#A9F5F2;} #login-form > table{width:255px;} #login-form:hover{right: 0px;}#login-form{z-index:1000;position: fixed;top: 200px;right: -240px;-moz-transition: right 0.5s;-webkit-transition: right 0.5s;-ms-transition: right 0.5s;transition: right 0.5s;;text-align: center;}#login-form table span{display: block;font-weight: bold;font-size: 15px;border-radius: 8px 0 0 8px;background: #374551;width: 10px;padding: 3px 5px 3px 5px;}#login-form table{text-align: center;color: white;border-spacing: 0;}#login-form td{padding: 0px;}#login-form table table td{padding: 10px 5px 10px 5px;}#login-form table table{background: #374551;}#login-form button{background: none;border:1px solid white;border-radius: 5px;color: white;padding: 3px 7px 3px 7px;}#login-form button:hover{cursor: pointer;}</style><div id='login-form'><table><tr><td><span>L<br/>o<br/>g<br/>i<br/>n</span></td><td><table><tr><td>Username :</td><td><input id='login-username' type='text'></td></tr><tr><td>Password : </td><td ><input id='login-password' type='password'></td></tr><tr><td colspan='2'><button id='login-btn' type='button'>Login</button></td></tr></table></td></tr></table></div>");
		var obj_data = {};
		obj_data.success = "<div class='icon col-md-2 col-lg-2'><span class='glyphicon glyphicon-log-out'></span></div><div id='login-form' class='col-md-10 col-lg-10'><h3>ĐĂNG NHẬP</h3><div class='input-group'><span class='input-group-addon glyphicon glyphicon-user'></span><input id='login-username' class='form-control' type='text' placeholder='Username'/></div><div class='clearfix'></div><br/><div class='input-group'><span class='input-group-addon glyphicon glyphicon-lock'></span><input id='login-password' class='form-control' type='password' placeholder='Password'/></div><div class='clearfix'></div><br/><div class='col-md-8.col-lg-8.col-md-offset-2.col-lg-offset-2'><a href='/registers'>Bạn chưa có tài khoản? Đăng ký tại đây!</a></div><br/><div class='col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3'><button id='login-btn' class='btn btn-info' type='button'>Đăng Nhập</button></div></div>";
		res.send(obj_data);
		res.end();
	}
});


routers.get("/menu_ajax",function(req,res){
	res.render("main_layout", {company_arr: req.company_arr});
	res.end();
});

routers.post("/selectCineplex", function(req, res){
	var dataReceived = req.body._id,
		company = req.body.company;
	console.log(dataReceived);
	req.cinema_model.find({'_id': new ObjectId(dataReceived)},{},function(err, data){
		var AjaxData = {map: materialMap.place[data[0].company][data[0].name], key: materialMap.key, _data: data};
		res.send(AjaxData);
		res.end();
		console.log(AjaxData);
	});
});
routers.post("/get_cineplex", function(req, res){
	var data = req.body._data;
	//console.log(data);
	req.cinema_model.find({"company":data},{}, function(err, cineplex_arr_data){
		console.log(cineplex_arr_data[0].name);
		res.send(cineplex_arr_data);
		res.end();
	});
});
routers.post("/get_list_film", function(req, res){
	var company = req.body.company;
	var typeOfFilm = req.body.typeFilm;
	/*if(typeOfFilm == 'onScreenMovie'){
		if(company == "galaxy" || company == "platinum"){*/
			req[typeOfFilm+'_model'].find({"company":company},{}, function(err, data){
				if(err) console.log(err);
				//console.log(data);
				var _html = "";
				var intro = "";

				for(var i in data){
					if(typeof data[i]['intro'] == "undefined" || data[i]['intro'] == null){
						intro = "Have not intro yet...";
					}else{
						intro = data[i].intro.substr(0, 100)+"...";
					}console.log(intro);
					_html += "<div class='col-sm-3 col-md-3 col-lg-3'>"+
							 "<div class='thumbnail'><img src='"+data[i].image+"'></div>"+
							 "<div class='movieTitle'><h3><a href='/detailMovie/"+typeOfFilm+"/"+data[i].company+"/"+data[i]["_id"]+"' target='_blank'>"+data[i].name.substr(0, textLib.countSpace(data[i].name)).toUpperCase()+"</a></h3></div>"+
							 "<div class='small-info'><span>"+intro+"</span></div>"
							 +"</div>";
					if(parseInt((parseInt(i)+1)%4) == 0){
						_html += "<div class='clearfix'></div><hr>";
					}
				}
				res.send(_html);
				res.end();
			});
		/*}else{///////////////////////////////////////////////////////////////////////
			var cgv_schedule_arr 			= [];
			var bhd_schedule_arr			= [];
			var lotte_schedule_arr 			= [];
			var galaxy_schedule_arr 		= [];
			var platinum_schedule_arr 		= [];
			var cgv_movie_arr 		= [];
			var bhd_movie_arr 		= [];
			var lotte_movie_arr 	= [];
			var galaxy_movie_arr 	= [];
			var platinum_movie_arr 	= [];
			req.schedule_model.findAllSchedule(function(err,schedule_arr){
				if(err){
					res.render("error",{message:"Error getting data from database"});
					res.end();
					return;
				}
				req.onScreenMovie_model.findAllMovie(function(err,movie_arr){
					if(err){
						res.render("error",{message:"Error getting data from database"});
						res.end();
						return;
					}
					rank.getScheduleByCompany(schedule_arr,cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr);
					rank.getOnScreenMovieByCompany(movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr);
					rank.getInfoForScheduleArr(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr,movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr);
					cgv_schedule_arr = rank.optimizeScheduleArr(cgv_schedule_arr);
					bhd_schedule_arr = rank.optimizeScheduleArr(bhd_schedule_arr);
					lotte_schedule_arr = rank.optimizeScheduleArr(lotte_schedule_arr);
					galaxy_schedule_arr = rank.optimizeScheduleArr(galaxy_schedule_arr);
					platinum_schedule_arr = rank.optimizeScheduleArr(platinum_schedule_arr);

					if(company == 'cgv'){
						var _html = "";
						var intro = "";

						for(var i in cgv_schedule_arr){
							intro = cgv_schedule_arr[i]['intro'];
							if(typeof intro != 'undefined' && intro.length > 100){
								intro = intro.substr(0, 100)+"...";
							}
							//console.log(intro.substr(0, 100)+"...");
							_html += "<div class='col-sm-3 col-md-3 col-lg-3'>"+
									 "<div class='thumbnail'><img src='"+cgv_schedule_arr[i].image+"'></div>"+
									 "<div class='movieTitle'><h3><a href='/detailMovie/"+typeOfFilm+"/"+cgv_schedule_arr[i].company+"/"+cgv_schedule_arr[i]["_id"]+"'>"+cgv_schedule_arr[i].movie.substr(0, textLib.countSpace(cgv_schedule_arr[i].movie)).toUpperCase()+"</a></h3></div>"+
									 "<div class='small-info'><span>"+intro+"</span></div>"
									 +"</div>";
							if(parseInt((parseInt(i)+1)%4) == 0){
								_html += "<div class='clearfix'></div><hr>";
							}
						}
						res.send(_html);
						res.end();
					}
					if(company == 'bhd'){
						var _html = "";
						var intro = "";

						for(var i in bhd_schedule_arr){
							intro = bhd_schedule_arr[i]['intro'];
							if(typeof intro != 'undefined' && intro.length > 100){
								intro = intro.substr(0, 100)+"...";
							}
							//console.log(intro.substr(0, 100)+"...");
							_html += "<div class='col-sm-3 col-md-3 col-lg-3'>"+
									 "<div class='thumbnail'><img src='"+bhd_schedule_arr[i].image+"'></div>"+
									 "<div class='movieTitle'><h3><a href='/detailMovie/"+typeOfFilm+"/"+bhd_schedule_arr[i].company+"/"+bhd_schedule_arr[i]["_id"]+"'>"+bhd_schedule_arr[i].movie.substr(0, textLib.countSpace(bhd_schedule_arr[i].movie)).toUpperCase()+"</a></h3></div>"+
									 "<div class='small-info'><span>"+intro+"</span></div>"
									 +"</div>";
							if(parseInt((parseInt(i)+1)%4) == 0){
								_html += "<div class='clearfix'></div><hr>";
							}
						}
						res.send(_html);
						res.end();
					}
					if(company == 'lotte'){
						var _html = "";
						var intro = "";

						for(var i in lotte_schedule_arr){
							intro = lotte_schedule_arr[i]['intro'];
							if(typeof intro != 'undefined' && intro.length > 100){
								intro = intro.substr(0, 100)+"...";
							}
							//console.log(intro.substr(0, 100)+"...");
							_html += "<div class='col-sm-3 col-md-3 col-lg-3'>"+
									 "<div class='thumbnail'><img src='"+lotte_schedule_arr[i].image+"'></div>"+
									 "<div class='movieTitle'><h3><a href='/detailMovie/"+typeOfFilm+"/"+lotte_schedule_arr[i].company+"/"+lotte_schedule_arr[i]["_id"]+"'>"+lotte_schedule_arr[i].movie.substr(0, textLib.countSpace(lotte_schedule_arr[i].movie)).toUpperCase()+"</a></h3></div>"+
									 "<div class='small-info'><span>"+intro+"</span></div>"
									 +"</div>";
							if(parseInt((parseInt(i)+1)%4) == 0){
								_html += "<div class='clearfix'></div><hr>";
							}
						}
						res.send(_html);
						res.end();
					}
				});
			});
		}///////////////////////////////////////////////////////////////////
	}else{
		req[typeOfFilm+'_model'].find({"company":company},{}, function(err, data){
				if(err) console.log(err);
				//console.log(data);
				var _html = "";
				var intro = "";

				for(var i in data){
					if(company == "lotte"){
						intro = "Have not intro yet...";
					}else{
						intro = data[i].intro.substr(0, 100)+"...";
					}
					_html += "<div class='col-sm-3 col-md-3 col-lg-3'>"+
							 "<div class='thumbnail'><img src='"+data[i].image+"'></div>"+
							 "<div class='movieTitle'><h3><a href='/detailMovie/"+typeOfFilm+"/"+data[i].company+"/"+data[i]["_id"]+"'>"+data[i].name.substr(0, textLib.countSpace(data[i].name)).toUpperCase()+"</a></h3></div>"+
							 "<div class='small-info'><span>"+intro+"</span></div>"
							 +"</div>";
					if(parseInt((parseInt(i)+1)%4) == 0){
						_html += "<div class='clearfix'></div><hr>";
					}
				}
				res.send(_html);
				res.end();
		});
	}*/
});
routers.post('/get_list_promotion', function(req, res){
	var company = req.body.company;
	var action = req.body.action;
	if(company == 'all' && action == 'editdata'){
		req.promotion_model.findAllPromotion(function(err, promotion_data){
			res.send(promotion_data).end();
		});
	}
	if(company != 'all'){
		req.promotion_model.find({"company":company},{}, function(err, promotion_data_arr){
			if(err) console.log(err);
			if(action == 'loaddata'){
				for(var i in promotion_data_arr){
					promotion_data_arr[i].title = promotion_data_arr[i].title.substr(0, textLib.countSpace(promotion_data_arr[i].title)).toUpperCase();
				}
			}
			res.send(promotion_data_arr);
			res.end();
		});
	}
});
routers.post('/get_movies', function(req, res){
	var company = req.body.company,
		collection = req.body.collection;
	if(collection == 'onScreenMovie'){
		if(company == 'all'){
			req[collection+'_model'].findAllMovie(function(err, data){
				if(err){
					console.log(err);
					return;
				}
				res.send(data).end();
			});
		}else{
			req[collection+'_model'].find({company: company},{},function(err, data){
				if(err){
					console.log(err);
					return;
				}
				res.send(data).end();
			});
		}
	}
	if(collection == 'commingSoonMovie'){
		if(company == 'all'){
			req[collection+'_model'].findAllCommingsoonMovie(function(err, data){
				if(err){
					console.log(err);
					return;
				}
				res.send(data).end();
			});
		}else{
			req[collection+'_model'].find({company: company},{},function(err, data){
			if(err){
				console.log(err);
				return;
			}
			res.send(data).end();
		});
		}
	}
});
routers.post('/del_data_items', function(req, res){
	var collection = req.body.collection;
	var temp = req.body.arrId.split(",");
	for(var i in temp){
		temp[i] = new ObjectId(temp[i]);
	}
	console.log(temp);
	req[collection+'_model'].remove({_id:{$in:temp}}, function(err){
		if(err){
			console.log(err);
			return;
		}
		if(collection == 'promotion'){
			req[collection+'_model'].findAllPromotion(function(err, data){
				res.send(data).end();
			});
		}
		if(collection == 'onScreenMovie'){
			req[collection+'_model'].findAllMovie(function(err, data){
				res.send(data).end();
			});
		}
		if(collection == 'commingSoonMovie'){
			req[collection+'_model'].findAllCommingsoonMovie(function(err, data){
				res.send(data).end();
			});
		}
	});
});
routers.post('/update_data_item', function(req, res){
	var collection = req.body.collection; console.log(collection);
	if(collection == 'promotion'){ console.log(new ObjectId(req.body.id));
		req[collection+'_model'].update({_id: new ObjectId(req.body.id)},{content: req.body.content, title: req.body.title, image: req.body.image, company: req.body.company},{}, function(err, data){
			console.log(data);
			if(data == 1){
				res.send("Update successfull!").end();
			}else{
				res.send("Something error: status ",data).end();
			}
		});
	}
	if(collection == 'onScreenMovie'){
		req[collection+'_model'].update({_id: new ObjectId(req.body._id)},{intro: req.body._content, name: req.body._title, trailer: req.body._trailer, start_time: req.body._start_time, end_time: req.body._end_time, kind: req.body._kind.split(','), player: req.body._player.split(','), length: req.body._length, director: req.body._director.split(','), version: req.body._version, note: req.body._note, image: req.body._image, company: req.body._company},{upsert:true}, function(err, data){
			console.log(data);
			if(data == 1){
				res.send("Update successfull!").end();
			}else{
				res.send("Something error: status ",data).end();
			}
		});
	}
	if(collection == 'commingSoonMovie'){
		req[collection+'_model'].update({_id: new ObjectId(req.body._id)},{intro: req.body._content, name: req.body._title, trailer: req.body._trailer, length: req.body._length, start_time: req.body._start_time, kind: req.body._kind.split(','), player: req.body._player.split(','), director: req.body._director.split(','), image: req.body._image, company: req.body._company},{upsert:true}, function(err, data){
			console.log(data);
			if(data == 1){
				res.send("Update successfull!").end();
			}else{
				res.send("Something error: status ",data).end();
			}
		});
	}
});
routers.post('/insert_data_item', function(req, res){
	var collection = req.body.collection; console.log(collection);
	if(collection == 'promotion'){
		//console.log(req.body.content);
		req[collection+'_model'].insert({content: req.body.content, title: req.body.title, image: req.body.image, company: req.body.company}, function(err, data){
			console.log(data);
			if(err){
				res.send("Something error: status ",err).end();
			}else{
				req[collection+'_model'].findAllPromotion(function(err_promotion, data_promotion){
					if(err_promotion){
						console.log(err_promotion);
						return;
					}
					res.send(data_promotion).end();
				});
			}
		});
	}
	if(collection == 'onScreenMovie'){
		req[collection+'_model'].insert({intro: req.body._content, name: req.body._title, trailer: req.body._trailer, start_time: req.body._start_time, end_time: req.body._end_time, kind: req.body._kind.split(','), player: req.body._player.split(','),director:req.body._director.split(','), length: req.body._length, version: req.body._version, note: req.body._note, image: req.body._image, company: req.body._company, }, function(err, data){
			console.log(req.body._content);
			if(err){
				res.send("Something error: status ",err).end(); console.log("error insert: ",err);
			}else{
				req[collection+'_model'].findAllMovie(function(err_promotion, data_promotion){
					if(err_promotion){
						console.log(err_promotion);
						return;
					}
					res.send(data_promotion).end();console.log(data_promotion);
				});
			}
		});
	}
	if(collection == 'commingSoonMovie'){
		req[collection+'_model'].insert({intro: req.body._content, name: req.body._title, trailer: req.body._trailer, start_time: req.body._start_time, end_time: req.body._end_time, kind: req.body._kind.split(','), player: req.body._player.split(','),director:req.body._director.split(','), length: req.body._length, version: req.body._version, note: req.body._note, image: req.body._image, company: req.body._company, }, function(err, data){
			console.log(req.body._content);
			if(err){
				res.send("Something error: status ",err).end(); console.log("error insert: ",err);
			}else{
				req[collection+'_model'].findAllCommingsoonMovie(function(err_promotion, data_promotion){
					if(err_promotion){
						console.log(err_promotion);
						return;
					}
					res.send(data_promotion).end();console.log(data_promotion);
				});
			}
		});
	}
});

routers.get("/ajax_getAddress",function(req,res){
	var longitude = req.query.longitude;
	var latitude = req.query.latitude;
	geo.addressFromCoord(latitude,longitude,function(err,address){
		if(err){
			res.send({"error":1});
		}
		else{
			res.send({address:address});
		}
		res.end();
	});
});

routers.get("/ajax_getCoord",function(req,res){
	var address = req.query.address;
	geo.coordFromAddress(address,function(err,coord){
		if(err){
			res.send({"error":1});
		}
		else{
			res.send({coord:coord});
		}
		res.end();
	});
});

routers.get("/ajax_kind_edit",function(req,res){
	var data = req.query["kind_arr"];
	if(!data){
		res.send({err:"Không có dữ liệu!!!"});
		res.end();
		return;
	}
	var kind_arr = {};
	for(var i in data){
		if(isNaN(i)){
			var obj = {};
			for(var j in data[i]){
				if(isNaN(j)){
					if(!isNaN(data[i][j])){
						obj[j]= data[i][j];
					}
				}
			}
			if(Object.keys(obj).length != 0){
				kind_arr[i] = obj;
			}
		}
	}
	if(Object.keys(kind_arr).length == 0){
		res.send({err:"Không có dữ liệu!!!"});
		res.end();
		return;
	}
	req.point_model.update_kindPoint(kind_arr,function(err,data){
		if(err){
			res.send({err:"Lỗi!!!"});
			res.end();
			return;
		}
		res.send({success:"Sửa dữ liệu thành công"});
		res.end();
	});
});

routers.get("/ajax_age_edit",function(req,res){
	var user = req.session.user;
	if(!user && !req.signedCookies.user){
		res.render("error",{message:"Vui Lòng Đăng Nhập",redirect:"/"});
		res.end();
		return;
	}
	else if(req.signedCookies.user||user){
		var username='';
		if(!req.signedCookies.user){
			res.cookie("user",user,{signed:true});
		}
		else{
			if(!user){
				req.session.user = req.signedCookies.user;
				user = req.session.user;
			}
		}
		if(!user.role || user.role!="admin"){
			res.send({err:"Bạn Không Có Quyền Truy Cập Trang"});
			res.end();
			return;
		};
	}
	var data = req.query["age_arr"];
	if(!data){
		res.send({err:"Không có dữ liệu!!!"});
		res.end();
		return;
	}
	var age_arr = {};
	for(var i in data){
		if(isNaN(i)){
			var obj = {};
			for(var j in data[i]){
				if(isNaN(j)){
					if(!isNaN(data[i][j])){
						obj[j]= data[i][j];
					}
				}
			}
			if(Object.keys(obj).length != 0){
				age_arr[i] = obj;
			}
		}
	}
	if(Object.keys(age_arr).length == 0){
		res.send({err:"Không có dữ liệu!!!"});
		res.end();
		return;
	}
	req.point_model.update_agePoint(age_arr,function(err,data){
		if(err){
			res.send({err:"Lỗi!!!"});
			res.end();
			return;
		}
		res.send({success:"Sửa dữ liệu thành công"});
		res.end();
	});
});

routers.get("/ajax_job_edit",function(req,res){
	var user = req.session.user;
	if(!user && !req.signedCookies.user){
		res.render("error",{message:"Vui Lòng Đăng Nhập",redirect:"/"});
		res.end();
		return;
	}
	else if(req.signedCookies.user||user){
		var username='';
		if(!req.signedCookies.user){
			res.cookie("user",user,{signed:true});
		}
		else{
			if(!user){
				req.session.user = req.signedCookies.user;
				user = req.session.user;
			}
		}
		if(!user.role || user.role!="admin"){
			res.send({err:"Bạn Không Có Quyền Truy Cập Trang"});
			res.end();
			return;
		};
	}
	var data = req.query["job_arr"];
	if(!data){
		res.send({err:"Không có dữ liệu!!!"});
		res.end();
		return;
	}
	var job_arr = {};
	for(var i in data){
		if(isNaN(i)){
			var obj = {};
			for(var j in data[i]){
				if(isNaN(j)){
					if(!isNaN(data[i][j])){
						obj[j]= data[i][j];
					}
				}
			}
			if(Object.keys(obj).length != 0){
				job_arr[i] = obj;
			}
		}
	}
	if(Object.keys(job_arr).length == 0){
		res.send({err:"Không có dữ liệu!!!"});
		res.end();
		return;
	}
	req.point_model.update_jobPoint(job_arr,function(err,data){
		if(err){
			res.send({err:"Lỗi!!!"});
			res.end();
			return;
		}
		res.send({success:"Sửa dữ liệu thành công"});
		res.end();
	});
});

routers.get("/ajax_rank_edit",function(req,res){
	var user = req.session.user;
	if(!user && !req.signedCookies.user){
		res.render("error",{message:"Vui Lòng Đăng Nhập",redirect:"/"});
		res.end();
		return;
	}
	else if(req.signedCookies.user||user){
		var username='';
		if(!req.signedCookies.user){
			res.cookie("user",user,{signed:true});
		}
		else{
			if(!user){
				req.session.user = req.signedCookies.user;
				user = req.session.user;
			}
		}
		if(!user.role || user.role!="admin"){
			res.send({err:"Bạn Không Có Quyền Truy Cập Trang"});
			res.end();
			return;
		};
	}
	var data = req.query["rank_arr"];
	if(!data){
		res.send({err:"Không có dữ liệu!!!"});
		res.end();
		return;
	}
	req.point_model.update_rankPoint(data,function(err,data){
		if(err){
			res.send({err:"Lỗi!!!"});
			res.end();
			return;
		}
		res.send({success:"Sửa dữ liệu thành công"});
		res.end();
	});
});


routers.get("/logout",function(req,res){
	req.session.user = null;
	res.clearCookie("user");
	res.send({success:"<div class='icon'><span class='glyphicon glyphicon-log-out'></span></div><div id='login-form' class='col-md-3 col-lg-3'><h3>ĐĂNG NHẬP</h3><div class='input-group'><span class='input-group-addon glyphicon glyphicon-user'></span><input id='login-username' class='form-control' type='text' placeholder='Username'/></div><div class='clearfix'></div><br/><div class='input-group'><span class='input-group-addon glyphicon glyphicon-lock'></span><input id='login-password' class='form-control' type='password' placeholder='Password'/></div><div class='clearfix'></div><br/><div class='col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3'><button id='login-btn' class='btn btn-info' type='button'>Đăng Nhập</button></div></div>"});
	res.end();
});

module.exports = routers;