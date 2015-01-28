var crypto= require("crypto");
var textLib = {
	convertUtf8ToNonUtf8 : function(input){
		var output = input;
		output = output.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g,"a");
		output = output.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g,"e");
		output = output.replace(/(ì|í|ị|ỉ|ĩ)/g,"i");
		output = output.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g,"o");
		output = output.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g,"u");
		output = output.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g,"y");
		output = output.replace(/(đ)/g,"d");
		output = output.replace(/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/g,"A");
		output = output.replace(/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/g,"E");
		output = output.replace(/(Ì|Í|Ị|Ỉ|Ĩ)/g,"I");
		output = output.replace(/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/g,"O");
		output = output.replace(/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/g,"U");
		output = output.replace(/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/g,"Y");
		output = output.replace(/(Đ)/g,"D");
		output = output.replace(/\̣|\̀|\́|\̉|\̃/g,"");
		return output;
	},
	clearAllSpace:function(input){
		var output = input;
		output = output.replace(/\s/g,'');
		output = output.replace(/\-/g,'');
		return output;
	},
	clearBlankSpace : function(input){
		var output = input;
		output = output.replace(/\s+/,'');
		output = output.replace(/\s{2,}/g,' ');
		output = output.replace(/\s+$/,'');
		return output;
	},
	getNumberFromText : function(input){
		re = input.match(/(\d{2})/,'');
		return re[1];
	},
	cutFromFirstComma : function(input){
		var output = input;
		output = output.substring(output.indexOf(",")+1,output.length);
		return output;
	},
	editDateFormat:function(input){
		var date_arr = input.split('/');
		var output = '';
		for(var i = 0; i < date_arr.length;i++){
			var temp = parseInt(date_arr[i]);
			if(temp<10) temp = "0"+temp;
			output += temp+"/"
		}
		output = output.substring(0,output.length-1);
		return output;
	},
	escapeHTML: function(html){
		return String(html).replace(/<.*>/g, '').replace(/<\/.*>/g,'');
	},
	countSpace:function(string){
		var _index = 0,
			count = 0;
		string = string.trim();
		for(var i in string){
			if(count == 7){
				return _index;
			}
			if(string[i] == " "){
				count += 1;
				_index = i;
			}
		}
		if(count < 7)
			return string.length;
	},
	hexToUnicode: function(string){
		return text.replace(/&#(\d+);/g,function(match, num){
			return String.fromCharCode(num);
		}).replace(/&#x([A-Za-z0-9]+);/g, function(match, num){
			return String.fromCharCode(parseInt(num, 16));
		});
	},
	toHash: function(string){
		return crypto.createHash('md5').update(string).digest('hex');
	}
};
module.exports = textLib;