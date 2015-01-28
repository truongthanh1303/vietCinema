var config = require("./../config/config.js");
var textLib = require(config.LIB_PATH + "text.js");
var kind_pointt = {
	"Hành Động":{
		"Trinh Thám":4,
		"Kinh Dị":2,
		"Phiêu Lưu":7,
		"Chiến Tranh":5,
		"Dã Sử":3,
		"Kịch Tính":5,
	},
	"Kịch Tính":{
		"Hồi hộp":8,
		"Kinh Dị":7,
		"Hành Động":5,
		"Phiêu Lưu":5,
	},
	"Hài":{
		"Hành Động":1,
		"Hoạt Hình":8,
		"Phiêu Lưu":2,
		"Âm Nhạc":5,
		"Dã Sử":1,
	},
	"Hoạt Hình":{
		"Hài":5,
		"Hành Động":5,
		"Viễn Tưởng":5,
		"Tình Cảm":2,
		"Phiêu Lưu":5,
		"Âm Nhạc":3,
	},
	"Viễn Tưởng":{
		"Giả Tưởng":90,
		"Hành Động":3,
		"Hoạt Hình":8,
		"Kinh Dị":4,
		"Phiêu Lưu":2,
		"Bí Ẩn":3,
	},
	"Kinh Dị":{
		"Hành Động":2,
		"Viễn Tưởng":5,
		"Phiêu Lưu":4,
		"Trinh Thám":6,
		"Dã Sử":4,
		"Bí Ẩn":3,
		"Kịch Tính":5,
	},
	"Tình Cảm":{
		"Hài":1,
		"Tâm Lý":9,
		"Âm Nhạc":4,
		"Lãng Mạng":8,
	},
	"Phiêu Lưu":{
		"Hành Động":4,
		"Hài":2,
		"Viễn Tưởng":4,
		"Tâm Lý":3,
		"Trinh Thám":2,
		"Chiến Tranh":3,
		"Bí Ẩn":3,
		"Kịch Tính":5,
		"Hồi Hộp":5,
	},
	"Tâm Lý":{
		"Hài":2,
		"Kinh Dị":2,
		"Hoạt Hình":2,
		"Viễn Tưởng":3,
		"Kinh Dị":5,
		"Tình Cảm":7,
		"Trinh Thám":5,
		"Chiến Tranh":5,
		"Âm Nhạc":3,
	},
	"Trinh Thám":{
		"Hành Động":4,
		"Viễn Tưởng":1,
		"Phiêu Lưu":4,
		"Tâm Lý":4,
		"Tội Phạm":8,
		"Băng Nhóm":8,
		"Bí Ẩn":5,
		"Kịch Tính":5,
		"Hồi Hộp":5,
		"Hình Sự":5,
	},
	"Chiến Tranh":{
		"Hành Động":5,
		"Kinh Dị":3,
		"Phiêu Lưu":2,
		"Tâm Lý":3,
		"Kịch Tính":3,
		"Hồi Hộp":5,
	},
	"Âm Nhạc":{
		"Hài":3,
		"Tình Cảm":4,
		"Tâm Lý":4
	},
	"Dã Sử":{
		"Viễn Tưởng":3,
		"Cổ Trang":8,
	},
}

var job_pointt={
	"Kĩ Thuật":{
		"Hành Động":8,
		"Kịch Tính":7,
		"Hài":9,
		"Hoạt Hình":4,
		"Viễn Tưởng":9,
		"Kinh Dị":6,
		"Tình Cảm":4,
		"Phiêu Lưu":8,
		"Tâm Lý":4,
		"Trinh Thám":6,
		"Chiến Tranh":5,
		"Âm Nhạc":3,
	},
	"Xã Hội":{
		"Hành Động":4,
		"Kịch Tính":8,
		"Hài":8,
		"Hoạt Hình":7,
		"Viễn Tưởng":2,
		"Kinh Dị":5,
		"Tình Cảm":8,
		"Phiêu Lưu":5,
		"Tâm Lý":8,
		"Trinh Thám":6,
		"Chiến Tranh":6,
		"Âm Nhạc":8,
	},
	"Văn Hoá":{
		"Hành Động":4,
		"Kịch Tính":8,
		"Hài":8,
		"Hoạt Hình":7,
		"Viễn Tưởng":2,
		"Kinh Dị":5,
		"Tình Cảm":8,
		"Phiêu Lưu":5,
		"Tâm Lý":8,
		"Trinh Thám":6,
		"Chiến Tranh":6,
		"Âm Nhạc":8,
	},
	"Nghệ Thuật":{
		"Hành Động":4,
		"Kịch Tính":8,
		"Hài":8,
		"Hoạt Hình":7,
		"Viễn Tưởng":4,
		"Kinh Dị":5,
		"Tình Cảm":8,
		"Phiêu Lưu":5,
		"Tâm Lý":8,
		"Trinh Thám":6,
		"Chiến Tranh":6,
		"Âm Nhạc":10,
	},
	"Nông Nghiệp":{
		"Hành Động":6,
		"Kịch Tính":8,
		"Hài":9,
		"Hoạt Hình":7,
		"Viễn Tưởng":4,
		"Kinh Dị":6,
		"Tình Cảm":8,
		"Phiêu Lưu":6,
		"Tâm Lý":8,
		"Trinh Thám":7,
		"Chiến Tranh":8,
		"Âm Nhạc":8,
	},
}

function getMainKind(kind_point){
	var re=[];
	for (var i in kind_point)
	{
		re.push(i);
	}
	return re;
};

function getMainJob(job_point){
	var re=[];
	for (var i in job_point)
	{
		re.push(i);
	}
	return re;
};

function getPointArr(kind_point,kind_arr){
	var re=[];
	for(var i in kind_arr){
		var obj={};
		obj.name= kind_arr[i];
		var index = textLib.convertUtf8ToNonUtf8(kind_arr[i]);
		index = textLib.clearAllSpace(index);
		index = index.toLowerCase();
		obj.value = index;
		obj.point = 100;
		re.push(obj);
		for(var j in kind_point){
			var jndex = textLib.convertUtf8ToNonUtf8(j);
			jndex = textLib.clearAllSpace(jndex);
			jndex = jndex.toLowerCase();
			if(index.indexOf(jndex)!=-1){
				for(var k in kind_point[j]){
					var kndex = textLib.convertUtf8ToNonUtf8(k);
					kndex = textLib.clearAllSpace(kndex);
					kndex = kndex.toLowerCase();
					var obj={};
					obj.name= k;
					obj.value = kndex;
					obj.point = kind_point[j][k]*10;
					re.push(obj);
				}
				break;
			}
		}
	}
	return re;
};

function getJobPointArr(kind_point,job_point,job_arr){
	var re =[];
	for(var i in job_arr ){
		var index = textLib.convertUtf8ToNonUtf8(job_arr[i]);
		index = textLib.clearAllSpace(index);
		index = index.toLowerCase();
		for(var j in job_point){
			var jndex = textLib.convertUtf8ToNonUtf8(j);
			jndex = textLib.clearAllSpace(jndex);
			jndex = jndex.toLowerCase();
			if(jndex.indexOf(index)!=-1){
				for(var g in job_point[j]){
					var obj ={};
					var gndex = textLib.convertUtf8ToNonUtf8(g);
					gndex = textLib.clearAllSpace(gndex);
					gndex = gndex.toLowerCase();
					obj.name = g;
					obj.value = gndex;
					obj.point = job_point[j][g]*10;
					re.push(obj);
					for(var k in kind_point){
						var kndex = textLib.convertUtf8ToNonUtf8(k);
						kndex = textLib.clearAllSpace(kndex);
						kndex = kndex.toLowerCase();
						if(kndex.indexOf(gndex)!=-1){
							for (var h in kind_point[k]){
								var hndex = textLib.convertUtf8ToNonUtf8(h);
								hndex = textLib.clearAllSpace(hndex);
								hndex = hndex.toLowerCase();
								var obj ={};
								obj.name = h;
								obj.value = hndex;
								obj.point = job_point[j][g]* kind_point[k][h];
								re.push(obj);
							};
							break;
						}
						
					}
				}
				break;
			}
		}
	}
	return re;
};

/*---------------------------------------------------*/
/*---------------POINT NEW VERSION-----------------------*/
/*---------------------------------------------------*/

function getPointArr2(kind_point,query_arr){
	var re = [];
	var added = [];
	for(var i in query_arr){
		for(var j in kind_point){
			var jndex = textLib.convertUtf8ToNonUtf8(j);
			jndex = textLib.clearAllSpace(jndex);
			jndex = jndex.toLowerCase();
			if(jndex.indexOf(query_arr[i])!=-1 && added.indexOf(j)==-1){
				var obj = {};
				obj.name = j;
				obj.value = jndex;
				obj.point = 1000;
				re.push(obj);
				added.push(j);
				for(var k in kind_point[j]){
					var kndex = textLib.convertUtf8ToNonUtf8(k);
					kndex = textLib.clearAllSpace(kndex);
					kndex = kndex.toLowerCase();
					var obj = {};
					obj.name = k;
					obj.value = kndex;
					obj.point = kind_point[j][k];
					re.push(obj);
				}
			}
		}
	}
	return re;
}

module.exports.getMainKind = getMainKind;
module.exports.getPointArr = getPointArr;
module.exports.getPointArr2 = getPointArr2;
module.exports.getJobPointArr = getJobPointArr;
module.exports.getMainJob = getMainJob;
