var express = require("express"),
	routers = express.Router();
	
var config = require("./../config/config.js");

var textLib = require(config.LIB_PATH + "text.js");
var _rank = require(config.LIB_PATH + "rank.js");
var rank = new _rank();

routers.get("/",function(req,res){
	res.render("main_layout");
	res.end();
	
});

routers.post("/check_login_info",function(req,res){
	var username = req.body.username.toLowerCase();
	var password = textLib.toHash(req.body.password);
	req.user_model.findUser(username,password,function(err,data){
		if(data.length){
			req.session.user = data[0];
			req.session.user.password = null;
			res.cookie('user',req.session.user,{signed:true,maxAge:3600000});
			var link = "/suggestions";
			var admin_link = "/admin";
			var edit_link ="/edit-user-info"
			//res.send({success:"<style type='text/css'>#login-form{text-align: center;position: fixed;top: 200px;right: -240px;-moz-transition: right 0.5s;-webkit-transition: right 0.5s; -ms-transition: right 0.5s;transition: right 0.5s; z-index:1000; }#login-form > table{width:255px;}#login-form > table > tbody > tr > td:nth-child(2){width:235px;height: 130px;background: #374551;}#login-form a{color:#A9F5F2;}#login-form:hover{right: 0px;}#login-form table span{display: block;font-weight: bold;font-size: 15px;border-radius: 8px 0 0 8px;background: #374551;width: 10px;padding: 3px 5px 3px 5px;}#login-form table{text-align: center;color: white;border-spacing: 0;}#login-form td{padding: 0px;}#login-form table table td{padding: 10px 5px 10px 5px;}#login-form table table{background: #374551;}#login-form button{background: none;border:1px solid white;border-radius: 5px;color: white;padding: 3px 7px 3px 7px;}#login-form button:hover{cursor: pointer;}</style><div id='login-form'><table><tr><td><span>L<br/>o<br/>g<br/>i<br/>n</span></td><td><p>Welcome " + username + "</p><a href='" + link + "'><p>Check new movie today!</p></a><p><button type='button' id='login-logout'>Logout</button></p></td></tr></table></div>"});
			var response = "<div class='icon'><span class='glyphicon glyphicon-log-in'></span></div><div id='login-form' class='col-md-3 col-lg-3'><h3>Welcome " + username + "</h3><div class='input-group'><br/><a href='" + link + "'><p>Check new movie today!</p></a>";
			response+= "<a href='" + edit_link + "'><p>Edit Your Profile!</p></a>";
			if(req.session.user.role && req.session.user.role=="admin"){
				response+= "<a href='" + admin_link + "'><p>Admin Panel!</p></a>";
			}
			response+="</div><div class='clearfix'></div><br/><div class='col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3'><button id='login-logout' class='btn btn-info' type='button'>Đăng Xuất</button></div></div>";
			var nav_add_obj = "<li><a href='"+link+"'>GỢI Ý PHIM</a></li>";
			res.send({success: response, nav_add_obj: nav_add_obj});
		}
		else{
			res.send({error:"Đăng nhập thất bại"});
		}
		res.end();
	});
});


routers.post("/edit-user-info",function(req,res){
	var user= {};
	user.username = req.body.username;
	user.password = textLib.toHash(req.body.password);
	//user['confirm-password'] = req.body['confirm-password'];
	user.email = req.body.email;
	user['favorite-company'] = req.body['favorite-company']?req.body['favorite-company']:[];
	user['favorite-cinema'] = req.body['favorite-cinema']?req.body['favorite-cinema']:[];
	user['favorite-player'] = req.body['favorite-player']?req.body['favorite-player'].split(","):[];
	user['favorite-kind'] = req.body['favorite-kind']?req.body['favorite-kind']:[];
	user['favorite-director'] = req.body['favorite-director']?req.body['favorite-director'].split(","):[];
	user['birthday-year'] = req.body['birthday-year']?req.body['birthday-year']:0;
	user['job'] = req.body['job']?req.body['job']:[];
	user['gender'] = req.body['gender']?req.body['gender']:"male";
	user['role'] = req.session.user.role? req.session.user.role: null;
	console.log(user);
	req.user_model.updateUser(user,function(err,data){
		if(err){
			res.render("error",{message:"Cập nhật thông tin không thành công",redirect:"/edit-user-info"});
		}
		else{
			req.session.user = user;
			res.render("success",{message:"Cập nhật thông tin thành công!",redirect:"/"});
		}
		res.end();
	});
});

routers.post("/register_info",function(req,res){
	var user= {};
	user.username = req.body.username;
	user.password = textLib.toHash(req.body.password);
	//user['confirm-password'] = req.body['confirm-password'];
	user.email = req.body.email;
	user['favorite-company'] = req.body['favorite-company']?req.body['favorite-company']:[];
	user['favorite-cinema'] = req.body['favorite-cinema']?req.body['favorite-cinema']:[];
	user['favorite-player'] = req.body['favorite-player']?req.body['favorite-player'].split(","):[];
	user['favorite-kind'] = req.body['favorite-kind']?req.body['favorite-kind']:[];
	user['favorite-director'] = req.body['favorite-director']?req.body['favorite-director'].split(","):[];
	user['birthday-year'] = req.body['birthday-year']?req.body['birthday-year']:0;
	user['job'] = req.body['job']?req.body['job']:[];
	user['gender'] = req.body['gender']?req.body['gender']:"male";
	req.user_model.insertUser(user,function(err,data){
		if(err){
			res.render("error",{message:"Tạo tài khoản không thành công",redirect:"/registers"});
		}
		else{
			res.render("success",{message:"Tạo tài khoản thành công!",redirect:"/"});
		}
		res.end();
	});
});

routers.post("/admin_register_info",function(req,res){
	var user= {};
	user.username = req.body.username;
	user.password = textLib.toHash(req.body.password);
	//user['confirm-password'] = req.body['confirm-password'];
	user.email = req.body.email;
	user['favorite-company'] = req.body['favorite-company']?req.body['favorite-company']:[];
	user['favorite-cinema'] = req.body['favorite-cinema']?req.body['favorite-cinema']:[];
	user['favorite-player'] = req.body['favorite-player']?req.body['favorite-player'].split(","):[];
	user['favorite-kind'] = req.body['favorite-kind']?req.body['favorite-kind']:[];
	user['favorite-director'] = req.body['favorite-director']?req.body['favorite-director'].split(","):[];
	user['birthday-year'] = req.body['birthday-year']?req.body['birthday-year']:0;
	user['job'] = req.body['job']?req.body['job']:[];
	user['gender'] = req.body['gender']?req.body['gender']:"male";
	user['role'] = "admin";
	req.user_model.insertUser(user,function(err,data){
		if(err){
			res.render("error",{message:"Tạo tài khoản không thành công",redirect:"/registers"});
		}
		else{
			res.render("success",{message:"Tạo tài khoản thành công!",redirect:"/"});
		}
		res.end();
	});
});

module.exports = routers;