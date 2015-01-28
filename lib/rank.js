var config = require("./../config/config.js");

var textLib = require(config.LIB_PATH + "text.js"),
	point 	= require(config.LIB_PATH + "point.js");

var rank = function(){
};

rank.prototype.heapify = function(arr,index,size){
	var max = index;
	var left = index * 2 + 1;
	var right = index * 2 +2;
	if(left < size && arr[left] > arr[max]){
		max = left;
	}
	if(right < size && arr[right] > arr[max]){
		max = right;
	}
	if(max!=index){
		var temp = arr[max];
		arr[max] = arr[index];
		arr[index]= temp;
		this.heapify(arr,max,size);
	}
}

rank.prototype.heapifyDistance = function(arr,index,size){
	var max = index;
	var left = index * 2 + 1;
	var right = index * 2 +2;
	if(left < size && arr[left].distance > arr[max].distance){
		max = left;
	}
	if(right < size && arr[right].distance > arr[max].distance){
		max = right;
	}
	if(max!=index){
		var temp = arr[max];
		arr[max] = arr[index];
		arr[index]= temp;
		this.heapifyDistance(arr,max,size);
	}
}

rank.prototype.heapifyPoint = function(arr,index,size){
	var max = index;
	var left = index * 2 + 1;
	var right = index * 2 +2;
	if(left < size && arr[left].point > arr[max].point){
		max = left;
	}
	if(right < size && arr[right].point > arr[max].point){
		max = right;
	}
	if(max!=index){
		var temp = arr[max];
		arr[max] = arr[index];
		arr[index]= temp;
		this.heapifyPoint(arr,max,size);
	}
}

rank.prototype.buildHeapTree = function(arr){
	var root = Math.floor(arr.length/2);
	for( var i = root ; i >= 0 ; i--){
		this.heapify(arr,i,arr.length);
	}
	return arr;
}

rank.prototype.buildDistanceHeapTree = function(arr){
	var root = Math.floor(arr.length/2);
	for( var i = root ; i >= 0 ; i--){
		this.heapifyDistance(arr,i,arr.length);
	}
	return arr;
}

rank.prototype.buildPointHeapTree = function(arr){
	var root = Math.floor(arr.length/2);
	for( var i = root ; i >= 0 ; i--){
		this.heapifyPoint(arr,i,arr.length);
	}
	return arr;
}

rank.prototype.heapSort = function(arr){
	var size = arr.length;
	arr = this.buildHeapTree(arr);
	while(size > 1){
		var temp = arr[0];
		arr[0] = arr[size - 1];
		arr[size - 1] = temp;
		size--;
		this.heapify(arr,0,size)
	}
	return arr;

}

rank.prototype.distanceHeapSort = function(arr){
	var size = arr.length;
	arr = this.buildDistanceHeapTree(arr);
	while(size > 1){
		var temp = arr[0];
		arr[0] = arr[size - 1];
		arr[size - 1] = temp;
		size--;
		this.heapifyDistance(arr,0,size)
	}
	return arr;

}

rank.prototype.pointHeapSort = function(arr){
	var size = arr.length;
	arr = this.buildPointHeapTree(arr);
	while(size > 1){
		var temp = arr[0];
		arr[0] = arr[size - 1];
		arr[size - 1] = temp;
		size--;
		this.heapifyPoint(arr,0,size)
	}
	return arr;

}

rank.prototype.heapifyCinema = function(arr,index,size){
	var max = index;
	var left = index * 2 + 1;
	var right = index * 2 +2;
	if(left < size && arr[left].cinema > arr[max].cinema){
		max = left;
	}
	if(right < size && arr[right].cinema > arr[max].cinema){
		max = right;
	}
	if(max!=index){
		var temp = arr[max];
		arr[max] = arr[index];
		arr[index]= temp;
		this.heapifyCinema(arr,max,size);
	}
}

rank.prototype.buildCinemaHeapTree = function(arr){
	var root = Math.floor(arr.length/2);
	for( var i = root ; i >= 0 ; i--){
		this.heapifyCinema(arr,i,arr.length);
	}
	return arr;
}

rank.prototype.cinemaHeapSort = function(arr){
	var size = arr.length;
	arr = this.buildCinemaHeapTree(arr);
	while(size > 1){
		var temp = arr[0];
		arr[0] = arr[size - 1];
		arr[size - 1] = temp;
		size--;
		this.heapifyCinema(arr,0,size)
	}
	return arr;

}

rank.prototype.pushIntoOne = function(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr) {
	var re = [];
	for(var i = 0 ; i < cgv_schedule_arr.length; i++){
		re.push(cgv_schedule_arr[i]);
	}
	for(var i = 0 ; i < lotte_schedule_arr.length; i++){
		re.push(lotte_schedule_arr[i]);
	}
	for(var i = 0 ; i < galaxy_schedule_arr.length; i++){
		re.push(galaxy_schedule_arr[i]);
	}
	for(var i = 0 ; i < bhd_schedule_arr.length; i++){
		re.push(bhd_schedule_arr[i]);
	}
	for(var i = 0 ; i < platinum_schedule_arr.length; i++){
		re.push(platinum_schedule_arr[i]);
	}
	return re;
};

rank.prototype.getScheduleByCompany = function(schedule_arr,cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr) {
	for(var i = 0 ; i < schedule_arr.length; i++){
		if(schedule_arr[i].company == "cgv"){
			cgv_schedule_arr.push(schedule_arr[i]);
		}
		else if(schedule_arr[i].company == "lotte"){
			lotte_schedule_arr.push(schedule_arr[i]);
		}
		else if(schedule_arr[i].company == "galaxy"){
			galaxy_schedule_arr.push(schedule_arr[i]);
		}
		else if(schedule_arr[i].company == "platinum"){
			platinum_schedule_arr.push(schedule_arr[i]);
		}
		else if(schedule_arr[i].company == "bhd"){
			bhd_schedule_arr.push(schedule_arr[i]);
		}
	}
};

rank.prototype.getOnScreenMovieByCompany = function(movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr) {
	for(var i = 0 ; i < movie_arr.length; i++){
		if(movie_arr[i].company == "cgv"){
			cgv_movie_arr.push(movie_arr[i]);
		}
		else if(movie_arr[i].company == "lotte"){
			lotte_movie_arr.push(movie_arr[i]);
		}
		else if(movie_arr[i].company == "galaxy"){
			galaxy_movie_arr.push(movie_arr[i]);
		}
		else if(movie_arr[i].company == "platinum"){
			platinum_movie_arr.push(movie_arr[i]);
		}
		else if(movie_arr[i].company == "bhd"){
			bhd_movie_arr.push(movie_arr[i]);
		}
	}
};

rank.prototype.getCommingSoonMovieByCompany = function(commingSoonMovie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr) {
	for(var i = 0 ; i < commingSoonMovie_arr.length; i++){
		if(commingSoonMovie_arr[i].company == "cgv"){
			cgv_commingSoonMovie_arr.push(commingSoonMovie_arr[i]);
		}
		else if(commingSoonMovie_arr[i].company == "lotte"){
			lotte_commingSoonMovie_arr.push(commingSoonMovie_arr[i]);
		}
		else if(commingSoonMovie_arr[i].company == "galaxy"){
			galaxy_commingSoonMovie_arr.push(commingSoonMovie_arr[i]);
		}
		else if(commingSoonMovie_arr[i].company == "platinum"){
			platinum_commingSoonMovie_arr.push(commingSoonMovie_arr[i]);
		}
		else if(commingSoonMovie_arr[i].company == "bhd"){
			bhd_commingSoonMovie_arr.push(commingSoonMovie_arr[i]);
		}
	}
};

rank.prototype.getInfoForScheduleArr = function(cgv_schedule_arr,lotte_schedule_arr,galaxy_schedule_arr,bhd_schedule_arr,platinum_schedule_arr,movie_arr,cgv_movie_arr,lotte_movie_arr,galaxy_movie_arr,bhd_movie_arr,platinum_movie_arr,cgv_commingSoonMovie_arr,lotte_commingSoonMovie_arr,galaxy_commingSoonMovie_arr,bhd_commingSoonMovie_arr,platinum_commingSoonMovie_arr){
	for(var i = 0 ; i < cgv_commingSoonMovie_arr.length; i++){
		cgv_movie_arr.push(cgv_commingSoonMovie_arr[i]);
	}
	for(var i = 0 ; i < bhd_commingSoonMovie_arr.length; i++){
		bhd_movie_arr.push(bhd_commingSoonMovie_arr[i]);
	}
	for(var i = 0 ; i < lotte_commingSoonMovie_arr.length; i++){
		lotte_movie_arr.push(lotte_commingSoonMovie_arr[i]);
	}
	for(var i = 0 ; i < platinum_commingSoonMovie_arr.length; i++){
		platinum_movie_arr.push(platinum_commingSoonMovie_arr[i]);
	}
	for(var i = 0 ; i < galaxy_commingSoonMovie_arr.length; i++){
		galaxy_movie_arr.push(galaxy_commingSoonMovie_arr[i]);
	}
	for(var i = 0 ; i < cgv_schedule_arr.length; i++){
		for(var j = 0 ; j < cgv_movie_arr.length; j++){
			var movie_name = textLib.convertUtf8ToNonUtf8(cgv_movie_arr[j].name);
			movie_name = textLib.clearAllSpace(movie_name);
			movie_name = movie_name.toLowerCase();
			var schedule_name =textLib.clearAllSpace(cgv_schedule_arr[i].movie);
			schedule_name = schedule_name.toLowerCase();
			schedule_name = schedule_name.replace(/\(.*\)/g,'');
			schedule_name = schedule_name.replace(/3d|hfr|4dx|atmos/g,'');
			if(movie_name.indexOf(schedule_name)!=-1 || schedule_name.indexOf(movie_name)!=-1){
				cgv_schedule_arr[i].kind =  cgv_movie_arr[j].kind;
				cgv_schedule_arr[i].player =  cgv_movie_arr[j].player;
				cgv_schedule_arr[i].director =  cgv_movie_arr[j].director;
				cgv_schedule_arr[i].image = cgv_movie_arr[j].image;
				cgv_schedule_arr[i].intro = cgv_movie_arr[j].intro;
				if(cgv_movie_arr[j].age){
					cgv_schedule_arr[i].age = cgv_movie_arr[j].age;
				}
				break;
			}
		}
	}
	for(var i = 0 ; i < lotte_schedule_arr.length; i++){
		for(var j = 0 ; j < lotte_movie_arr.length; j++){
			var movie_name = textLib.convertUtf8ToNonUtf8(lotte_movie_arr[j].name);
			movie_name = textLib.clearAllSpace(movie_name);
			movie_name = movie_name.replace(/\:/g,'');
			movie_name = movie_name.toLowerCase();
			var schedule_name = lotte_schedule_arr[i].movie.toLowerCase();
			schedule_name = textLib.clearAllSpace(schedule_name);
			schedule_name = schedule_name.toLowerCase();
			schedule_name = schedule_name.replace(/\(.*\)/g,'');
			schedule_name = schedule_name.replace(/\-.*/g,'');
			if(movie_name.indexOf(schedule_name)!=-1){
				lotte_schedule_arr[i].kind =  lotte_movie_arr[j].kind;
				lotte_schedule_arr[i].player =  lotte_movie_arr[j].player;
				lotte_schedule_arr[i].director =  lotte_movie_arr[j].director;
				lotte_schedule_arr[i].image = lotte_movie_arr[j].image;
				break;
			}
		}
	}
	for(var i = 0 ; i < galaxy_schedule_arr.length; i++){
		for(var j = 0 ; j < galaxy_movie_arr.length; j++){
			if(galaxy_schedule_arr[i].movie.indexOf(galaxy_movie_arr[j].name)!=-1 ||galaxy_movie_arr[j].name.indexOf(galaxy_schedule_arr[i].movie)!=-1 ){
				galaxy_schedule_arr[i].kind =  galaxy_movie_arr[j].kind;
				galaxy_schedule_arr[i].player =  galaxy_movie_arr[j].player;
				galaxy_schedule_arr[i].director =  galaxy_movie_arr[j].director;
				galaxy_schedule_arr[i].image = galaxy_movie_arr[j].image;
			}
		}
	}
	for(var i = 0 ; i < bhd_schedule_arr.length; i++){
		for(var j = 0 ; j < bhd_movie_arr.length; j++){
			if(textLib.clearBlankSpace(" " + bhd_schedule_arr[i].movie + " ") == textLib.clearBlankSpace(" " + bhd_movie_arr[j].name + " ") ){
				bhd_schedule_arr[i].kind =  bhd_movie_arr[j].kind;
				bhd_schedule_arr[i].player =  bhd_movie_arr[j].player;
				bhd_schedule_arr[i].director =  bhd_movie_arr[j].director;
				bhd_schedule_arr[i].image = bhd_movie_arr[j].image;
				if(bhd_movie_arr[j].age){
					bhd_schedule_arr[i].age = bhd_movie_arr[j].age;
				}
			}
		}
	}
	for(var i = 0 ; i < platinum_schedule_arr.length; i++){
		for(var j = 0 ; j < platinum_movie_arr.length; j++){
			if(platinum_schedule_arr[i].movie==platinum_movie_arr[j].name){
				platinum_schedule_arr[i].kind =  platinum_movie_arr[j].kind;
				platinum_schedule_arr[i].player =  platinum_movie_arr[j].player;
				platinum_schedule_arr[i].director =  platinum_movie_arr[j].director;
				platinum_schedule_arr[i].image = platinum_movie_arr[j].image;
			}
		}
	}
};

rank.prototype.rankKind = function(schedule_arr,user_kind_arr,kind_point_arr){
	var kind_arr = point.getPointArr(kind_point_arr,user_kind_arr);
	for(var i in schedule_arr){
		if(!schedule_arr[i].point){
			schedule_arr[i].point = 0;
		}
		var movie_kind = schedule_arr[i].kind;
		if(movie_kind){
			movie_kind = movie_kind.slice(0);
			for(var j in movie_kind){
				movie_kind[j] = textLib.convertUtf8ToNonUtf8(movie_kind[j]);
				movie_kind[j] = textLib.clearAllSpace(movie_kind[j]);
				movie_kind[j] = movie_kind[j].toLowerCase();
				for(var k in kind_arr){
					if(movie_kind[j].indexOf(kind_arr[k].value)!=-1){
						schedule_arr[i].point += kind_arr[k].point;
					}
				}
			}
		}
	}
	return schedule_arr;
}

rank.prototype.rankDistance = function(schedule_arr,distance_arr){
	for(var i = 0 ; i < schedule_arr.length; i++){
		if(!schedule_arr[i].point){
			schedule_arr[i].point = 0;
		}
		for( var j = 0 ; j < distance_arr.length;j++){
			if(schedule_arr[i].company=='lotte'){
				var cinema_name = textLib.convertUtf8ToNonUtf8(distance_arr[j].cinema);
				cinema_name = cinema_name.replace(/\s/g,'');
				if(cinema_name=="BienHoa")cinema_name= "DongNai";
				if(cinema_name=="PhuTho(Q11)")cinema_name= "PhuTho";
				if(schedule_arr[i].cinema == cinema_name){
					schedule_arr[i].distance = distance_arr[j].distance;
					schedule_arr[i].point += distance_arr[j].point;
					break;
				}
			}
			else{
				if(schedule_arr[i].cinema == distance_arr[j].cinema){
					schedule_arr[i].distance = distance_arr[j].distance;
					schedule_arr[i].point += distance_arr[j].point;
					break;
				}
			}	
		}
	}
	return schedule_arr;
};

rank.prototype.createDistanceArr = function(point_cfg,distance_arr) {
	distance_arr = this.distanceHeapSort(distance_arr);
	var point = 0;
	for(var i = distance_arr.length - 1 ; i >=0; i--){
		distance_arr[i].point = 0;
		if(distance_arr[i+1] && distance_arr[i].distance!=distance_arr[i+1].distance && distance_arr[i].distance>=0){
			point += point_cfg.distance;
		}
		distance_arr[i].point += point;
		if(distance_arr[i].distance < 0){
			distance_arr[i].point = 0;
		}
	}
	return distance_arr;
};



rank.prototype.rankAge = function(point_cfg,birthday_year,schedule_arr){
	var age = (new Date()).getFullYear() - birthday_year;
	for(var i in schedule_arr){
		if(!schedule_arr[i].point){
			schedule_arr[i].point = 0;
		}
		if(schedule_arr[i].company == "cgv" || schedule_arr[i].company == "bhd"){
			if(schedule_arr[i].age <= age){
				schedule_arr[i].point += point_cfg.age;
			}
		}
		else if(schedule_arr[i].company == "galaxy" || schedule_arr[i].company == "platinum"){
			if(schedule_arr[i].movie.search(/\d{2}/)!=-1){
				var movie_age = textLib.getNumberFromText(schedule_arr[i].movie);
				movie_age = parseInt(movie_age);
				if(movie_age <= age){
					schedule_arr[i].point += point_cfg.age;
				}
			}
		}
		else{

		}
	}
	return schedule_arr;
};

rank.prototype.rankJob = function(kind_point,job_point,job_arr,schedule_arr) {
	var job_point_arr = point.getJobPointArr(kind_point,job_point,job_arr);
	for(var i in schedule_arr){
		if(!schedule_arr[i].point){
			schedule_arr[i].point = 0;
		}
		var movie_kind = schedule_arr[i].kind;
		if(movie_kind){
			movie_kind = movie_kind.slice(0);
			for(var j in movie_kind){
				movie_kind[j] = textLib.convertUtf8ToNonUtf8(movie_kind[j]);
				movie_kind[j] = textLib.clearAllSpace(movie_kind[j]);
				movie_kind[j] = movie_kind[j].toLowerCase();
				for(var k in job_point_arr){
					if(movie_kind[j].indexOf(job_point_arr[k].value)!=-1){
						schedule_arr[i].point +=job_point_arr[k].point;
					}
				}
			}
		}
	}
	return schedule_arr;
};

rank.prototype.optimizeScheduleArr = function (schedule_arr){
	var re=[];
	while(schedule_arr.length>0){
		schedule_arr[schedule_arr.length-1].point = 0;
		re.push(schedule_arr[schedule_arr.length-1]);
		re[re.length-1]['time-arr'] = [];
		var obj = {};
		obj.date = schedule_arr[schedule_arr.length-1].date;
		obj.time = schedule_arr[schedule_arr.length-1].time
		re[re.length-1]['time-arr'].push(obj);
		schedule_arr.splice(schedule_arr.length-1,1);
		for(var i = schedule_arr.length-1; i>=0;i--){
			if(re[re.length-1].company == schedule_arr[i].company && re[re.length-1].cinema == schedule_arr[i].cinema && re[re.length-1].movie == schedule_arr[i].movie){
				var obj = {};
				obj.date = schedule_arr[i].date;
				obj.time = schedule_arr[i].time;
				re[re.length-1]['time-arr'].push(obj);
				schedule_arr.splice(i,1);
			}
		}
	}
	return re;
}

rank.prototype.optimizeDepartmentArr = function (schedule_arr,department_arr){
	for(var i = department_arr.length-1; i>=0 ; i--){
		var exists = false;
		for(var j = 0 ; j < schedule_arr.length ; j++){
			var cinema_name = textLib.convertUtf8ToNonUtf8(schedule_arr[j].cinema);
			cinema_name = cinema_name.replace(/\s/g,'');
			var name = textLib.convertUtf8ToNonUtf8(department_arr[i].name);
			name = name.replace(/\s/g,'');
			if(cinema_name == name){
				exists = true;
				break;
			}
			if(cinema_name=="DongNai" && name=="BienHoa"){
				exists = true;
				break;
			}
			if(cinema_name=="PhuTho" && name=="PhuTho(Q11)"){
				exists = true;
				break;
			}
		}
		if(!exists){
			department_arr.splice(i,1);
		}
	}
	return department_arr;
}

rank.prototype.rankSamePointArr = function (schedule_arr){
	if(schedule_arr.length<2){
		return schedule_arr;
	}
	var distanceFlag = schedule_arr[0]&&schedule_arr[0].distance ? true : false;
	var start = -1;
	var end = -1;
	if(schedule_arr[0].point == schedule_arr[1].point){
		start = 0;
	}
	for (var i = 1; i < schedule_arr.length-1; i++){
	 	if(schedule_arr[i].point!=schedule_arr[i-1].point && schedule_arr[i].point == schedule_arr[i+1].point){
	 		start = i;
		}
	 	if(schedule_arr[i].point==schedule_arr[i-1].point && schedule_arr[i].point != schedule_arr[i+1].point){
	 		end = i+1;
	 		var arr = schedule_arr.slice(start,end);
	 		if(distanceFlag){
	 			arr = this.distanceHeapSort(arr);
			}
			else{
				arr = this.cinemaHeapSort(arr);
			}
			for(j = end-1 ; j >= start ; j--){
				schedule_arr[j] = arr[end-j - 1];
			}
			
	 	}
	};
	if(schedule_arr[schedule_arr.length-1].point == schedule_arr[schedule_arr.length-2].point ){
		end = schedule_arr.length;
 		var arr = schedule_arr.slice(start,end);
 		if(distanceFlag){
 			arr = this.distanceHeapSort(arr);
		}
		else{
			arr = this.cinemaHeapSort(arr);
		}
		for(j = end-1 ; j >= start ; j--){
			schedule_arr[j] = arr[end-j - 1];
		}
	}
	return schedule_arr;
}

rank.prototype.removeDistance = function (schedule_arr,radius){
	radius = radius * 1000;
	for(var i = schedule_arr.length-1; i>=0 ; i--){
		if(schedule_arr[i].distance && schedule_arr[i].distance > radius){
			schedule_arr.splice(i,1);
		}
	}
	return schedule_arr;
}

/*
* @augments: movie_schedule_arr --> mang chua cac phan tu object;
* 			 user_profile_director --> thong tin dao dien yeu thich trong profile cua user.
* @returns: mang cac phan tu object da duoc cong diem
*/
rank.prototype.rankDirectorPlayer = function(point_cfg,movie_schedule_arr, user_profile_director_arr, String_field){
	if(String_field.toLowerCase() != 'director' && String_field.toLowerCase() != 'player'){
		return false;
	}
	var _user_profile_director_arr = textLib.convertUtf8ToNonUtf8(user_profile_director_arr.join());
	for(var i in movie_schedule_arr){//for(var i = 0; i < movie_schedule_arr.length; i++){
		if(!movie_schedule_arr[i].point){
			movie_schedule_arr[i].point = 0;
		}
			//var _length = movie_schedule_arr[i][j]['director'].length;
		for(var k in movie_schedule_arr[i][String_field]){
			if(_user_profile_director_arr.toLowerCase().indexOf(textLib.convertUtf8ToNonUtf8(movie_schedule_arr[i][String_field][k]).toLowerCase()) != -1){
				movie_schedule_arr[i]['point'] += point_cfg.director_player;
			}
		}
	}
	return movie_schedule_arr;
}

rank.prototype.rankCineplex = function(point_cfg,movie_schedule_arr, user_profile_cineplex_arr){
	var _user_profile_cineplex_arr = textLib.convertUtf8ToNonUtf8(user_profile_cineplex_arr.join());
	for(var i in movie_schedule_arr){
		if(!movie_schedule_arr[i].point){
			movie_schedule_arr[i]['point'] = 0;
		}
		if(_user_profile_cineplex_arr.toLowerCase().indexOf(textLib.convertUtf8ToNonUtf8(movie_schedule_arr[i].cinema).toLowerCase()) != -1){
			movie_schedule_arr[i]['point'] += point_cfg.cineplex;
		}
	}
	return movie_schedule_arr;
}

rank.prototype.rankCineCompany = function(point_cfg,schedule_arr, company_arr){
	for(var i in schedule_arr){
		if(!schedule_arr[i].point){
			schedule_arr[i]['point'] = 0;
		}
		if(company_arr.indexOf(schedule_arr[i].company) != -1){
			schedule_arr[i]['point'] += point_cfg.company;
		}
	}
	return schedule_arr;
}

/*---------------------------------------------------*/
/*---------------RANK NEW VERSION-----------------------*/
/*---------------------------------------------------*/

rank.prototype.rankMovieName = function(point_cfg,query_arr,movie_name){
	var pointt = 0;
	movie_name = textLib.convertUtf8ToNonUtf8(movie_name);
	movie_name = textLib.clearBlankSpace(" " + movie_name + " ");
	movie_name = movie_name.toLowerCase();
	for(var i in query_arr){
		while(movie_name.indexOf(query_arr[i])!=-1){
			movie_name = movie_name.replace(query_arr[i],'');
			pointt+=point_cfg.name;
		}
	}
	return pointt;
}

rank.prototype.rankPlayerDirectorV2 = function(point_cfg,query_arr,player_arr){
	var pointt = 0;
	if(!player_arr){
		return pointt;
	}
	player_arr = player_arr.slice(0);
	for(var i in query_arr){
		for(var j in player_arr){
			player_arr[j] = textLib.convertUtf8ToNonUtf8(player_arr[j]);
			player_arr[j] = textLib.clearBlankSpace(" " + player_arr[j] + " ");
			player_arr[j] = player_arr[j].toLowerCase();
			while(player_arr[j].indexOf(query_arr[i])!=-1){
				player_arr[j] = player_arr[j].replace(query_arr[i],'');
				pointt+=point_cfg.director_player;
			}
		}
	}
	return pointt;
}

rank.prototype.rankCompany = function(point_cfg,query_arr,company){
	var pointt = 0;
	for(var i in query_arr){
		if(company.indexOf(query_arr[i])!=-1){
			pointt+=point_cfg.company;
		}
	}
	return pointt;
}

rank.prototype.rankCinema = function(point_cfg,query_arr,cinema){
	var pointt = 0;
	cinema = textLib.convertUtf8ToNonUtf8(cinema);
	cinema = textLib.clearBlankSpace(" " + cinema + " ");
	cinema = cinema.toLowerCase();
	for(var i in query_arr){
		if(cinema.indexOf(query_arr[i])!=-1){
			pointt+=point_cfg.cineplex;
		}
	}
	return pointt;
}

rank.prototype.rankDate = function(point_cfg,query_arr,time_arr){
	var pointt = 0;
	if(!time_arr){
		return pointt;
	}
	for(var i in query_arr){
		for(var j in time_arr){
			if(time_arr[j].date.indexOf(query_arr[i])!=-1){
				pointt+=point_cfg.date;
			}
		}
	}
	return pointt;
}

rank.prototype.rankKindV2 = function(movie_kind_arr,kind_arr_v2){
	var pointt = 0;
	if(!movie_kind_arr){
		return pointt;
	}
	movie_kind_arr = movie_kind_arr.slice(0);
	for(var i in movie_kind_arr){
		movie_kind_arr[i] = textLib.convertUtf8ToNonUtf8(movie_kind_arr[i]);
		movie_kind_arr[i] = textLib.clearAllSpace(" " + movie_kind_arr[i] + " ");
		movie_kind_arr[i] = movie_kind_arr[i].toLowerCase();
		if(movie_kind_arr[i]!=""){
			for(var j in kind_arr_v2){
				if(movie_kind_arr[i].indexOf(kind_arr_v2[j].value)!=-1){
					pointt+=kind_arr_v2[j].point;
				}
			}
		}
	}
	return pointt;
}

rank.prototype.rankQuery = function(point_cfg,query_arr,schedule_arr,kind_arr_v2){
	var re = [];
	for(var i = 0 ; i < schedule_arr.length; i++){
		var pointt = 0;
		pointt = this.rankMovieName(point_cfg,query_arr,schedule_arr[i].movie);
		pointt += this.rankPlayerDirectorV2(point_cfg,query_arr,schedule_arr[i].player);
		pointt += this.rankPlayerDirectorV2(point_cfg,query_arr,schedule_arr[i].director);
		pointt += this.rankCompany(point_cfg,query_arr,schedule_arr[i].company);
		pointt += this.rankDate(point_cfg,query_arr,schedule_arr[i]['time-arr']);
		pointt += this.rankCinema(point_cfg,query_arr,schedule_arr[i].cinema);
		pointt += this.rankKindV2(schedule_arr[i].kind,kind_arr_v2);
		schedule_arr[i].point+=pointt;
		if(pointt){
			re.push(schedule_arr[i]);
		}
	}
	return re;
}

rank.prototype.advanceRank = function(point_cfg,kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,company_user,age_user,job_point,jobs_user,schedule_arr){
	var re = [];
	var kind_point_arr = point.getPointArr(kind_point,kind_user);
	var job_point_arr = point.getJobPointArr(kind_point,job_point,jobs_user);
	var age = (new Date()).getFullYear() - age_user;
	for(var i = 0 ; i < schedule_arr.length; i++){
		var pointt = 0;
		if(kind_enable){
			pointt += this.rankKindV3(schedule_arr[i].kind,kind_point_arr);
		}
		if(director_enable){
			pointt += this.rankPlayerDirectorV3(point_cfg,schedule_arr[i].director,director_user);
		}
		if(player_enable){
			pointt += this.rankPlayerDirectorV3(point_cfg,schedule_arr[i].player, player_user);
		}
		if(cinema_enable){
			pointt += this.rankCompanyCinemaV3(point_cfg,schedule_arr[i].cinema, cinema_user);
			pointt += this.rankCompanyCinemaV3(point_cfg,schedule_arr[i].company, company_user);
		}
		if(age_enable){
			pointt += this.rankAgeV3(point_cfg,age,schedule_arr[i]);
		}
		if(jobs_enable){
			pointt += this.rankJobV3(job_point_arr,schedule_arr[i].kind);
		}
		schedule_arr[i].point+=pointt;
		re.push(schedule_arr[i]);
	}
	return re;
}

rank.prototype.advanceRankV2 = function(point_cfg,kind_enable,director_enable,player_enable,cinema_enable,age_enable,jobs_enable,kind_user,kind_point,director_user,player_user,cinema_user,company_user,age_user,job_point,jobs_user,schedule_arr){
	var re = [];
	var kind_point_arr = point.getPointArr(kind_point,kind_user);
	var job_point_arr = point.getJobPointArr(kind_point,job_point,jobs_user);
	var age = (new Date()).getFullYear() - age_user;
	for(var i = 0 ; i < schedule_arr.length; i++){
		var pointt = 0;
		if(kind_enable){
			pointt += this.rankKindV3(schedule_arr[i].kind,kind_point_arr);
		}
		if(director_enable){
			pointt += this.rankPlayerDirectorV3(point_cfg,schedule_arr[i].director,director_user);
		}
		if(player_enable){
			pointt += this.rankPlayerDirectorV3(point_cfg,schedule_arr[i].player, player_user);
		}
		if(cinema_enable){
			pointt += this.rankCompanyCinemaV3(point_cfg,schedule_arr[i].cinema, cinema_user);
			pointt += this.rankCompanyCinemaV3(point_cfg,schedule_arr[i].company, company_user);
		}
		if(age_enable){
			pointt += this.rankAgeV3(point_cfg,age,schedule_arr[i]);
		}
		if(jobs_enable){
			pointt += this.rankJobV3(job_point_arr,schedule_arr[i].kind);
		}
		schedule_arr[i].point+=pointt;
		if(pointt){
			re.push(schedule_arr[i]);
		}
	}
	return re;
}

rank.prototype.rankKindV3 = function(movie_kind,kind_point_arr){
	var pointt = 0;
	if(!movie_kind || !movie_kind.length){
		return pointt;
	}
	var kind_arr = movie_kind.slice(0);
	for(var i in kind_arr){
		kind_arr[i] = textLib.convertUtf8ToNonUtf8(kind_arr[i]);
		kind_arr[i] = textLib.clearAllSpace(kind_arr[i]);
		kind_arr[i] = kind_arr[i].toLowerCase();
		if(kind_arr[i]!=""){
			for(var j in kind_point_arr){
				if(kind_point_arr[j].value.indexOf(kind_arr[i])!=-1){
					pointt+= kind_point_arr[j].point;
				}
			}
		}
	}
	return pointt;
}

rank.prototype.rankPlayerDirectorV3 = function(point_cfg,movie_player_arr,user_player_arr){
	var pointt = 0;
	if(!movie_player_arr || !user_player_arr){
		return pointt;
	}
	user_player_arr = user_player_arr.slice(0);
	movie_player_arr = movie_player_arr.slice(0);
	for(var i in user_player_arr){
		user_player_arr[i] = textLib.convertUtf8ToNonUtf8(user_player_arr[i]);
		user_player_arr[i] = textLib.clearBlankSpace(" " + user_player_arr[i] + " ");
		user_player_arr[i] = user_player_arr[i].toLowerCase();
	}
	for(var i in movie_player_arr){
		movie_player_arr[i] = textLib.convertUtf8ToNonUtf8(movie_player_arr[i]);
		movie_player_arr[i] = textLib.clearBlankSpace(" " + movie_player_arr[i] + " ");
		movie_player_arr[i] = movie_player_arr[i].toLowerCase();
	}
	for(var i in user_player_arr){
		if(user_player_arr[i]!=""){
			for(var j in movie_player_arr){
				if(movie_player_arr[j]!=""){
					if(movie_player_arr[j].indexOf(user_player_arr[i])!=-1){
						pointt+=point_cfg.director_player;
					}
				}
			}
		}
	}
	return pointt;
}

rank.prototype.rankCompanyCinemaV3 = function(point_cfg,cineplex,cineplex_arr){
	var pointt = 0;
	for(var i in cineplex_arr){
		if(cineplex_arr[i].indexOf(cineplex)!=-1){
			pointt+=point_cfg.cineplex;
		}
	}
	return pointt;
}

rank.prototype.rankAgeV3 = function(point_cfg,age,schedule){
	var pointt = 0;
	if(!schedule.name && !schedule.age){
		return pointt;
	}
	if(schedule.company == "cgv" || schedule.company == "bhd"){
		if(schedule.age <= age){
			pointt += point_cfg.age;
		}
	}
	else if(schedule.company == "galaxy" || schedule.company == "platinum"){
		if(schedule.movie.search(/\d{2}/)!=-1){
			var movie_age = textLib.getNumberFromText(schedule.movie);
			movie_age = parseInt(movie_age);
			if(movie_age <= age){
				pointt += point_cfg.age;
			}
		}
	}
	return pointt;	
};

rank.prototype.rankJobV3 = function(job_point_arr,movie_kind){
	var pointt = 0;
	if(!movie_kind || !movie_kind.length){
		return pointt;
	}
	var kind_arr = movie_kind.slice(0);
	for(var i in kind_arr){
		kind_arr[i] = textLib.convertUtf8ToNonUtf8(kind_arr[i]);
		kind_arr[i] = textLib.clearAllSpace(kind_arr[i]);
		kind_arr[i] = kind_arr[i].toLowerCase();
		if(kind_arr[i]!=""){
			for(var j in job_point_arr){
				if(job_point_arr[j].value.indexOf(kind_arr[i])!=-1){
					pointt+= job_point_arr[j].point;
				}
			}
		}
	}
	return pointt;
}

module.exports = rank;