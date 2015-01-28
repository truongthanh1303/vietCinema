var express = require("express"),
	routers = express.Router();
var ObjectId = require('mongodb').ObjectID;

var config = require("./../config/config.js");

var textLib = require(config.LIB_PATH + "text.js");
var _rank = require(config.LIB_PATH + "rank.js");
var rank = new _rank();
var point = require(config.LIB_PATH + "point.js");

/*routers.get("/",function(req,res){
	req.promotion_model.findAllPromotion(function(err,promotion_data){
		req.schedule_model.findAllSchedule(function(err,schedule_data){
			req.onScreenMovie_model.findAllMovie(function(err,movie_data){
				var now = new Date();
				now = now.getDate()+"/" + (now.getMonth() + 1) + "/" + now.getFullYear();
				for(var i = schedule_data.length -1 ; i >= 0 ; i--){
					if(schedule_data[i].date != now && schedule_data[i].date != ('0' + now) ){
						schedule_data.splice(i,1);
					}
				}
				res.render("index", {company_arr: req.company_arr,promotion_arr: promotion_data, schedule_arr:schedule_data, movie_arr:movie_data});
				res.end();
			});
		});
	});
	
});*/
routers.get('/', function(req, res){
	req.promotion_model.findAllPromotion(function(err,promotion_data){
		req.schedule_model.findAllSchedule(function(err,schedule_data){
			req.commingSoonMovie_model.findAllCommingsoonMovie(function(err, commingMovieData){
				req.onScreenMovie_model.findAllMovie(function(err,movie_data){
					var now = new Date();
					var month = now.getMonth() + 1;
					now = month>=10?now.getDate()+"/" + (now.getMonth() + 1) + "/" + now.getFullYear() : now.getDate()+"/0" + (now.getMonth() + 1) + "/" + now.getFullYear();
					for(var i = schedule_data.length -1 ; i >= 0 ; i--){
						if(schedule_data[i].date != now && schedule_data[i].date != ('0' + now) ){
							schedule_data.splice(i,1);
						}
					};
					res.render("film", {title:"Trang Chủ - Viet Cinema -",company_arr: req.company_arr,promotion_arr: promotion_data, schedule_arr:schedule_data, movie_arr:movie_data, commingsoonMovieData: commingMovieData, _host: req.protocol+"://"+req.headers.host});
					res.end();
				});
			});
		});
	});
});

routers.get("/schedule",function(req,res){
		req.schedule_model.findAllSchedule(function(err,schedule_arr){
			res.render("schedule",{title:'LỊCH CHIẾU',company_arr:req.company_arr, schedule_arr:schedule_arr});
			res.end();
		});
});

routers.get('/phimsapchieu', function(req, res){
	req.commingSoonMovie_model.find({"company":"galaxy"},{},function(err,commingsoonMovieData){
		if(err) console.log(err);
		for(var i in commingsoonMovieData){
			commingsoonMovieData[i].name = commingsoonMovieData[i].name.substr(0, textLib.countSpace(commingsoonMovieData[i].name)).toUpperCase();
		}
		res.render('commingsoon-nowshowing',{title: 'Phim Sắp Chiếu', dataMovie: commingsoonMovieData, typeOffilm: "PHIM SẮP CHIẾU", _company: req.company_arr, _host: req.protocol+"://"+req.headers.host});
		res.end();
	});
});
routers.get('/phimdangchieu', function(req, res){
	req.onScreenMovie_model.find({"company":"galaxy"},{},function(err,onscreenMovieData){
		if(err) console.log(err);
		for(var i in onscreenMovieData){
			onscreenMovieData[i].name = onscreenMovieData[i].name.substr(0, textLib.countSpace(onscreenMovieData[i].name)).toUpperCase();
		}
		res.render('commingsoon-nowshowing', {title: 'Phim Đang Chiếu', dataMovie: onscreenMovieData, typeOffilm: "PHIM ĐANG CHIẾU", _company: req.company_arr, _host: req.protocol+"://"+req.headers.host});
		res.end();
	});
});
routers.get('/detailMovie/:typeOfFilm/:company/:id', function(req, res){
	var id = req.params.id,
		typeOfFilm = req.params.typeOfFilm,
		company = req.params.company;
	//if(company == 'galaxy' || company == 'platinum'){
		req[typeOfFilm+'_model'].find({"_id": new ObjectId(id)},{}, function(err, detailMovie){
			req.schedule_model.aggregate(
			{
				$match:{
					company: detailMovie[0].company,
					movie: detailMovie[0].name
				}
			},
			{
				$group:{
					_id: {cinema: "$cinema"},
					date_time:{
						$push: {date: "$date", time:"$time"}
					}
				}
			},
			function(err, dataSchedule){
				res.render('detail-commingsoon-nowshowing', {title: detailMovie[0].company+' - Thông Tin Phim '+detailMovie[0].name, detailMovieObject: detailMovie, dataSchedule: dataSchedule, typeOfFilm: typeOfFilm});
				res.end();
			});
		});
	/*}else{///////////////
		req.schedule_model.find({"_id": new ObjectId(id)},{}, function(err, detailMovie){
			req.onScreenMovie_model.find({"company": company},{}, function(err, data){
				if(company == 'cgv'){
					for(var i in data){
						var movie_name = textLib.convertUtf8ToNonUtf8(data[i].name.replace(/\:/g,'').replace(/\s/g,'').toLowerCase());
						////////////////////////////////////////////////////////////////////////////
						//console.log(movie_name, detailMovie[0].movie.replace(/\s/g,'').toLowerCase());
						if(detailMovie[0].movie.replace(/\s/g,'').toLowerCase().indexOf(movie_name) != -1){
							detailMovie[0]['intro'] = data[i].intro;
							detailMovie[0]['trailer'] = data[i].trailer;
							detailMovie[0]['image'] = data[i].image;
							detailMovie[0]['start_time'] = data[i].start_time;
							detailMovie[0]['end_time'] = data[i].end_time;
							detailMovie[0]['kind'] = data[i].kind;
							detailMovie[0]['player'] = data[i].player;
							detailMovie[0]['director'] = data[i].director;
							detailMovie[0]['length'] = data[i].length;
							break;
						}
					}
					detailMovie[0]['name'] = detailMovie[0].movie;
				}
				if(company == 'lotte'){
					for(var i in data){
						var movie_name = textLib.convertUtf8ToNonUtf8(data[i].name.replace(/\:/g,'').toLowerCase());
						var schedule_movie = textLib.convertUtf8ToNonUtf8(detailMovie[0].movie).replace(/\:/g,'').replace(/\(.*\)/,'').replace(/\,/,'').toLowerCase().split("-");
						schedule_movie = schedule_movie[0].split(' ');
						var count = 0;
						for(var j in schedule_movie){
							if(movie_name.indexOf(schedule_movie[j]) != -1){
								count++;
							}
						}
						////////////////////////////////////////////////////////////////
						console.log(movie_name+"/////"+schedule_movie);
						if(count > 1){
							detailMovie[0]['intro'] = "Waiting...";
							detailMovie[0]['trailer'] = data[i].trailer;
							detailMovie[0]['image'] = data[i].image;
							detailMovie[0]['start_time'] = data[i].start_time;
							detailMovie[0]['end_time'] = data[i].end_time;
							detailMovie[0]['kind'] = data[i].kind;
							detailMovie[0]['player'] = data[i].player;
							detailMovie[0]['director'] = data[i].director;
							detailMovie[0]['length'] = data[i].length;
							detailMovie[0]['version'] = data[i].version;
							break;
						}
					}
					detailMovie[0]['name'] = detailMovie[0].movie;
				}
			});
			req.schedule_model.aggregate(
			{
				$match:{
					company: detailMovie[0].company,
					movie: detailMovie[0].movie
				}
			},
			{
				$group:{
					_id: {cinema: "$cinema"},
					date_time:{
						$push: {date: "$date", time:"$time"}
					}
				}
			},
			function(err, dataSchedule){
				res.render('detail-commingsoon-nowshowing', {title: detailMovie[0].company+' - Thông Tin Phim '+detailMovie[0].movie, detailMovieObject: detailMovie, dataSchedule: dataSchedule});
				res.end();
				//////////////////////////////////////////////////////////////////////
				console.log(detailMovie);
			});
		});
	}*/
});
routers.materialMap = {
	key		: 'AIzaSyD6hy62p8I02T0UdVHF1KuwHPimiK6APKc',
	place	: {
		'galaxy':{
			'Galaxy Nguyễn Du'			:'Galaxy%20Nguyen%20Du%20Cinema%2C%20B%E1%BA%BFn%20Th%C3%A0nh%2C%20Ho%20Chi%20Minh%2C%20Vietnam',
			'Galaxy Nguyễn Trãi'		:'Galaxy%20Nguyen%20Trai%20Cinema%2C%20Nguy%E1%BB%85n%20C%C6%B0%20Trinh%2C%20Ho%20Chi%20Minh%2C%20Vietnam',
			'Galaxy Tân Bình'			:'Galaxy+Tan+Binh+Cinema,+phường+14,+Ho+Chi+Minh,+Vietnam',
			'Galaxy Kinh Dương Vương'	:'Galaxy%20Kinh%20D%C6%B0%C6%A1ng%20V%C6%B0%C6%A1ng%2C%20Kinh%20D%C6%B0%C6%A1ng%20V%C6%B0%C6%A1ng%2C%20Ho%20Chi%20Minh%20City%2C%20Ho%20Chi%20Minh%2C%20Vietnam',
			'Galaxy Quang Trung'		:'304%20Quang%20Trung%2C%2011%2C%20G%C3%B2%20V%E1%BA%A5p%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam'
		},
		'lotte':{
			'Hà Đông'			:'Lotte+cinema+Hà+Đông,+Hà+Cầu,+Hà+Nội,+Vietnam',
			'Landmark'			:'Lotte+Cinema+Keangnam,+Phạm+Hùng,+Mễ+Trì,+Hanoi,+Vietnam',
			'Hạ Long'			:'big+c+Hạ+Long',
			'Đà Nẵng'			:'Lotte+Mart,+Nại+Nam,+Đà+Nẵng,+Da+Nang,+Vietnam',
			'Huế'				:'Big+C,+Bà+Triệu,+Hue,+Thua+Thien-Hue,+Vietnam',
			'Nha Trang'			:'lotte+cinema+Nha+Trang',
			'Phan Thiết'		:'lotte+cinema+Phan+Thiết',
			'Biên Hòa'			:'Lotte+Cinema,+Biên+Hòa,+Dong+Nai,+Vietnam',
			'Bình Dương'		:'Lotte+Mart,+QL+13,+tx.+Thuận+An,+Binh+Duong,+Vietnam',
			'Cantavil'			:'Lotte+Cinema,+Cantavil+An+Phu,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam',
			'Cộng Hòa'			:'Lotte+Cinema+Cong+Hoa,+Cộng+Hòa,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam',
			'Nam Sài Gòn'		:'Lotte+mart+Nam+Sài+Gòn',
			'Diamond'			:'Lotte+Cinema+Diamond,+Lê+Duẩn,+Bến+Nghé,+Ho+Chi+Minh,+Vietnam',
			'Phú Thọ (Q11)'		:'Lotte+Cinema+Phu+Tho+(Dist+11),+Lê+Đại+Hành,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam'
		},
		'cgv':{
			'HCMC - Celadon Tân Phú'			:'Aeon+Vietnam,+Bờ+Bao+Tân+Thắng,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam',
			'HCMC - Pandora City'				:'Trung+Tâm+Thương+Mại+Paradon+City',
			'HCMC - Crescent Mall'				:'CGV+Cinemas,+Nguyễn+Văn+Linh,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam',
			'HCMC - Hùng Vương Plaza'			:'plaża+Hùng+Vương,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam',
			'HCMC - CT Plaza'					:'CGV%20Cinema%20CT%20Plaza',
			'HCMC - Parkson Paragon'			:'CGV+Cinemas++parkson',
			'Hà Nội - Vincom Center Bà Triệu'	:'Vincom+Center+Hà+Nội,+Bà+Triệu,+Hanoi,+Vietnam',
			'Hà Nội - MIPEC Tower'				:'CGV+MIPEC+Tower,+Tây+Sơn,+Hanoi,+Vietnam',
			'Hạ Long - Marine Plaza'			:'H%E1%BA%A1%20Long%20-%20Marine%20Plaza',
			'Cần Thơ - Sense City'				:'SENSE+CITY+CẦN+THƠ,+Hòa+Bình,+Can+Tho,+Vietnam',
			'Hải Phòng - Thùy Dương Plaza'		:'TD+plaza+hải+phòng',
			'Đà Nẵng - Vinh Trung Plaza'		:'Vinh+Trung+Plaza,+Hùng+Vương,+Da+Nang,+Vietnam',
			'Biên Hòa - CGV Biên Hòa'			:'cgv+bien+hoa',
			'Vũng Tàu - Lam Sơn Square'			:'Lam+Sơn+Square,+Vung+Tau,+Ba+Ria+-+Vung+Tau,+Vietnam',
			'Quy Nhơn - Kim Cúc Plaza'			:'Tây+Sơn,+Ghềnh+Ráng,+tp.+Quy+Nhơn,+Bình+Định,+Viet+Nam',
			'Bình Dương - Bình Dương Square'	:'Rạp+CGV+Bình+Dương'
		},
		'bhd':{
			'BHD Star Cineplex ICON 68'			:'BHD+Star+Cineplex+ICON+68,+Hải+Triều,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam',
			'BHD Star Cineplex Centre Mall'		:'BHD+Star+Cineplex+Satra+Pham+Hung,+Phạm+Hùng,+Ho+Chi+Minh+City,+Ho+Chi+Minh,+Vietnam',
			'BHD Star Cineplex 3/2'				:'Bhd+Star+Cinema,+phường+12,+Ho+Chi+Minh,+Vietnam'
		},
		'platinum':{
			'Platinum Royal City'		:'Platinum+Cineplex,+Royal+City,+Nguyễn+Trãi,+Thượng+Đình,+Hanoi,+Vietnam',
			'Platinum The Garden'		:'trung+tâm+thương+mại+Garden+Shopping+Centre',
			'Platinum Long Biên'		:'Platinum+Cinema,+Phúc+Lợi,+Long+Biên,+Hanoi,+Vietnam',
			'Platinum Nha Trang'		:'trung+tâm+thương+mại+Nha+Trang+Center',
			'Platinum Times City'		:'458+Minh+Khai,+Hanoi,+Vietnam'
		}
	}
};
routers.get('/cinemas-info/:company', function(req, res){
	var name,
		company = req.params.company;
	if(company == "galaxy")
		name = "Galaxy Kinh Dương Vương";
	else if(company == "lotte")
		name = "Diamond";
	else if(company == "bhd")
		name = "BHD Star Cineplex ICON 68";
	else if(company == "cgv")
		name = "HCMC - Crescent Mall";
	else if(company == "platinum")
		name = "Platinum Times City";
	req.cinema_model.find({'company':company},{'name':1}, function(err, company_arr){
		if(!err){
			req.cinema_model.find({"company": company, "name":name}, {},function(err, cinema_data){
				if(err)
					console.log("Err: ",err);
				//console.log(company_arr);
				//console.log(cinema_data);
				//console.log(routers.materialMap.place[company][name]);
				res.render('cinemas-info', {title: 'Thông Tin Rạp Chiếu Phim', arr_company: company_arr, cine_data: cinema_data, map: routers.materialMap.place[company][name], _key: routers.materialMap.key});
				res.end();
			});
		}
	});
});
routers.get('/promotions', function(req, res){
	//var company = req.params.company;
	req.promotion_model.find({"company":"platinum"},{}, function(err, promotion_arr){
		res.render('promotion', {title: 'Tin Tức - Khuyến Mãi', promotions: promotion_arr, _company: req.company_arr});
		res.end();
	});
});
routers.get('/detail-promotion/:company/:id', function(req, res){
	req.promotion_model.find({"_id": new ObjectId(req.params.id)},{},function(err, detailPromotion){
		res.render('detail-promotion', {title: req.params.company+' - Promotion - '+detailPromotion[0].title, detailPromotion: detailPromotion});
		res.end();
	});
});
routers.get("/registers",function(req,res){
	req.cinema_model.findAllDepartment(function(err,department_arr){
		req.point_model.findAll_point(function(err,point_arr){
			if(err){
				res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/"});
				res.end();
				return;
			}
			var kind_point_arr = point_arr[0]['kind_arr']?point_arr[0]['kind_arr']:[];
			var job_point_arr = point_arr[0]['job_arr']?point_arr[0]['job_arr']:[];
			res.render("registers",{title: "Đăng Ký Tài Khoản", company_arr:req.company_arr,department_arr:department_arr,point_arr:point.getMainKind(kind_point_arr),job_arr:point.getMainJob(job_point_arr)});
			res.end();
		});
	});
});

routers.get("/admin",function(req,res){
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
			res.render("error",{message:"Bạn Không Có Quyền Truy Cập Trang",redirect:"/"});
			res.end();
			return;
		};
	}
	req.cinema_model.findAllDepartment(function(err,department_arr){
		res.render("admin",{title: "Trang Quản Trị"});
		//res.render("admin_register",{title: "Admin Register", company_arr:req.company_arr,department_arr:department_arr,point_arr:point.getMainKind(),job_arr:point.getMainJob()});
		res.end();	
	});
});

routers.get("/admin-registers",function(req,res){
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
			res.render("error",{message:"Bạn Không Có Quyền Truy Cập Trang",redirect:"/"});
			res.end();
			return;
		};
	}
	req.cinema_model.findAllDepartment(function(err,department_arr){
		if(err){
			res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/admin"});
			res.end();
			return;
		}
		req.point_model.findAll_point(function(err,point_arr){
			if(err){
				res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/admin"});
				res.end();
				return;
			}
			var kind_point_arr = point_arr[0]['kind_arr']?point_arr[0]['kind_arr']:[];
			var job_point_arr = point_arr[0]['job_arr']?point_arr[0]['job_arr']:[];
			res.render("admin_register",{title: "ĐK TK Quản Trị", company_arr:req.company_arr,department_arr:department_arr,point_arr:point.getMainKind(kind_point_arr),job_arr:point.getMainJob(job_point_arr)});
			res.end();	
		});
	});
});

routers.get("/edit-user-info",function(req,res){
	var user = req.session.user;
	if(!user && !req.signedCookies.user){
		res.render("error",{message:"Vui Lòng Đăng Nhập"});
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
			}
		}
		req.cinema_model.findAllDepartment(function(err,department_arr){
			if(err){
				res.render("error",{message:"Error getting data from database"});
				res.end();
				return;
			}
			req.point_model.findAll_point(function(err,point_arr){
				if(err){
					res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/admin"});
					res.end();
					return;
				}
				var kind_point_arr = point_arr[0]['kind_arr']?point_arr[0]['kind_arr']:[];
				var job_point_arr = point_arr[0]['job_arr']?point_arr[0]['job_arr']:[];
				res.render("edit-user-info",{title: "Sửa Thông Tin Tài Khoản", company_arr:req.company_arr,department_arr:department_arr,point_arr:point.getMainKind(kind_point_arr),job_arr:point.getMainJob(job_point_arr),user: req.session.user});
				res.end();	
			});
		});
	}
});

routers.get("/suggestions",function(req,res){
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
			}
		}
		req.schedule_model.findAllSchedule(function(err,schedule_arr){
			if(err){
				res.render("error",{message:"Error getting data from database",redirect:"/suggestions"});
				res.end();
				return;
			}
			req.point_model.findAll_point(function(err,point_arr){
				if(err){
					res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/"});
					res.end();
					return;
				}
				var kind_point_arr = point_arr[0]['kind_arr']?point_arr[0]['kind_arr']:[];
				var job_point_arr = point_arr[0]['job_arr']?point_arr[0]['job_arr']:[];
				var cinema_arr=[];
				for(var i = 0 ; i < req.company_arr.length; i++){
					cinema_arr[req.company_arr[i]] = [];
				}
				for(var i = 0; i < schedule_arr.length;i++){
					if(cinema_arr[schedule_arr[i].company].indexOf(schedule_arr[i].cinema)==-1){
						cinema_arr[schedule_arr[i].company].push(schedule_arr[i].cinema);
					}
				}
				res.render("suggestions",{title: "Gợi Ý Phim",kind_arr:point.getMainKind(kind_point_arr),cinema_arr:cinema_arr,user:req.session.user,job_arr:point.getMainJob(job_point_arr)});
				res.end();
			});
		});
	}
});
routers.get('/edit-data', function(req, res){
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
			res.render("error",{message:"Bạn Không Có Quyền Truy Cập Trang",redirect:"/"});
			res.end();
			return;
		};
	}
	req.promotion_model.findAllPromotion(function(promotion_err, promotion_arr){
		if(promotion_err){
			console.log("Error with findAllPromotion");
			return;
		}
		req.onScreenMovie_model.findAllMovie(function(onscreenmovie_err, onscreenmovie_arr){
			if(onscreenmovie_err){
				console.log("Error with findAllOnscreenMovie");
				return;
			}
			req.commingSoonMovie_model.findAllCommingsoonMovie(function(commingsoonmovie_err, commingsoonmovie_arr){
				if(commingsoonmovie_err){
					console.log("Error with findAllCommingsoonMovie");
					return;
				}
				res.render('edit-data', {title: 'Sửa Dữ Liệu Phim', promotion_arr: promotion_arr, onscreenmovie_arr: onscreenmovie_arr, commingsoonmovie_arr: commingsoonmovie_arr});
				res.end();
			});
		});
	});
});

routers.get("/point",function(req,res){
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
			res.render("error",{message:"Bạn Không Có Quyền Truy Cập Trang",redirect:"/"});
			res.end();
			return;
		};
	}
	req.point_model.findAll_point(function(err,point_arr){
		if(err){
			res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/admin"});
			res.end();
			return;
		}
		var kind_point_arr = point_arr[0]['kind_arr']?point_arr[0]['kind_arr']:[];
		res.render("point",{"kind_arr":kind_point_arr, title: "Sửa Điểm Thể Loại Phim"});
		res.end();
	});

});

routers.get("/job_point",function(req,res){
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
			res.render("error",{message:"Bạn Không Có Quyền Truy Cập Trang",redirect:"/"});
			res.end();
			return;
		};
	}
	req.point_model.findAll_point(function(err,point_arr){
		if(err){
			res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/admin"});
			res.end();
			return;
		}
		var job_point_arr = point_arr[0]['job_arr']?point_arr[0]['job_arr']:[];
		res.render("job_point",{"kind_arr":job_point_arr, title: "Sửa Điểm Theo Nghề"});
		res.end();
	});
});

routers.get("/rank_point",function(req,res){
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
			res.render("error",{message:"Bạn Không Có Quyền Truy Cập Trang",redirect:"/"});
			res.end();
			return;
		};
	}
	req.point_model.findAll_point(function(err,point_arr){
		if(err){
			res.render("error",{message:"Lỗi Kết Nối DB",redirect:"/admin"});
			res.end();
			return;
		}
		var rank_point_arr = point_arr[0]['rank_arr']?point_arr[0]['rank_arr']:[];
		res.render("rank_point",{title:"Sửa thang điểm", "rank_arr":rank_point_arr});
		res.end();
	});
});

module.exports = routers;