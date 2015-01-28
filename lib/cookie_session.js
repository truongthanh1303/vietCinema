function createSignedCookie(res,name,val){
	res.cookie(name,val,{signed:true,maxAge:3600000});
}

function createSession(req,name,val){
	req.session[name] = val;
}
function checkSignedCookie(req,name){
	if(req.signedCookie[name]){
		return true;
	}
	return false;
}
function checkSession(req,name){
	if(req.session[name]){
		return true;
	}
	return false;
}
function checkLoginSession(req){
	if(req.session.user){
		return req.session.user;
	}
}