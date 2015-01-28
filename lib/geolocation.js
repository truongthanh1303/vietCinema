var request = require("request");

var config = require("./../config/config.js");

var _httpLib = require(config.LIB_PATH + "http.js");

var textLib = require(config.LIB_PATH + "text.js");

var _cinema_model = require(config.MODEL_PATH+"cinema.js");

var geolocation = function(){
	this.step = 25;
	this.httpLib = new _httpLib();
	this.http_option = config.cloneHttpOption();
};

geolocation.prototype.coordFromAddress = function(address,callback){
	var link = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address;
	this.httpLib.get(link,this.http_option,3,function(err,res,body){
		if(err){
			callback(err);
		}
		else{
			var result = JSON.parse(body);
			if(result.status!="OK"){
				callback(true);
			}
			else{
				callback(null,{latitude:result.results[0].geometry.location.lat,longitude:result.results[0].geometry.location.lng});
			}
		}
	});
}

geolocation.prototype.addressFromCoord = function(latitude,longitude,callback){
	var link = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude +"," + longitude;
	this.httpLib.get(link,this.http_option,3,function(err,res,body){
		if(err){
			callback(err);
		}
		else{
			var result = JSON.parse(body);
			if(result.status!="OK"){
				callback(true);
			}
			else{
				callback(null,result.results[0]['formatted_address']);
			}
		}
	});
}

geolocation.prototype.distance = function(current_latitude,current_longitude,first_index,last_index,department_arr,re,callback){
	var destination_address ="";
	if(last_index> department_arr.length){
		last_index = department_arr.length;
	}
	for(var i = first_index ; i < last_index ; i++ ){
		var address = this.editAddress(department_arr[i]);
		destination_address += address+"|";
	}
	destination_address = destination_address.substring(0,destination_address.length-1);
	var link_param = "mode=driving&origins=" + current_latitude + ","+current_longitude + "&destinations=" + destination_address;
	var link = "https://maps.googleapis.com/maps/api/distancematrix/json?";
	link = link + link_param;
	this.httpLib.get(link,this.http_option,3,function(err,res,body){
		var result = JSON.parse(body);
		if(err){
			callback(err);
		}
		else if(result.status!="OK"){
			callback(true);
		}
		else{
			var last = 0;
			if(last_index == department_arr.length){
				last = last_index - first_index;
			}
			else{
				last = this.step;
			}
			for(var i = 0 ; i < last ; i++){
				var obj = {};
				obj.cinema = department_arr[first_index+i].name;
				obj.company = department_arr[first_index+i].company;
				if(result.rows[0].elements[i].status!="OK"){
					obj.distance = -1;
				}
				else{
					obj.distance = result.rows[0].elements[i].distance.value;
				}
				re.push(obj);
			}
			if(last_index == department_arr.length){
				callback(null,re);
				return;
			}
			first_index = last_index;
			if(last_index+this.step > department_arr.length){
				last_index = department_arr.length;
			}
			else{
				last_index+= this.step;
			}
			this.distance(current_latitude,current_longitude,first_index,last_index,department_arr,re,callback);
		}
	}.bind(this));
}

geolocation.prototype.editAddress = function(element){
	element.address = element.address.replace(/TP\.HCM|Tp\.HCM|TPHCM|TpHCM/g,'Ho Chi Minh');
	element.address = element.address.replace(/TP\.|Tp\.|TP\s|tp\s|Tp\s/g,' ');
	if(element.company == 'lotte'){
		element.address = element.address.replace(/Q\.|q\.|Q\s|q\s/,'Quan ');
		element.address = element.address.replace(/P\s|p\s|P\.|p\./,'Phuong ');
		element.address = element.address.replace(/(q)(\d+)/,function(match,p1,p2,offset,string){
				return "Quan " + p2;
		});
		element.address = textLib.cutFromFirstComma(element.address);
	}
	if(element.company == 'cgv'){
		element.address = element.address.replace(/P\.\s/,'Phuong ');
		if(element.address.indexOf("–") != -1){
			element.address = element.address.substring(element.address.indexOf("–")+1,element.address.length);
		}
		if(element.address.indexOf("-") != -1){
			element.address = element.address.substring(element.address.indexOf("-")+1,element.address.length);
		}
	}
	if(element.company == 'bhd'){
		if(element.address.indexOf("Lầu")==0){
			element.address = textLib.cutFromFirstComma(element.address);
		}
	}
	if(element.company == 'galaxy'){
		element.address = element.address.replace(/Q\.|q\./,'Quan ');
		element.address = element.address.replace(/(Q)(\d+)/,function(match,p1,p2,offset,string){
				return "Quan " + p2;
		});
		element.address = element.address.replace(/P\.|p\./,'Phuong ');
	}
	if(element.company == 'platinum'){
		element.address = element.address.replace(/\s\–\s/g,',');
		element.address = textLib.cutFromFirstComma(element.address);
	}
	element.address = textLib.clearBlankSpace(" " + element.address + " ");
	element.address = element.address.replace(/\s|\(|\-|\) /g,'+');
	return element.address;
}

module.exports = geolocation;