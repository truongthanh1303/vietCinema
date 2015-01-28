$(document).ready(function() {
	/*var temp;
	$('ul.nav.navbar-nav > li').click(function(event) {
		if(typeof temp != 'undefined'){
			temp.toggleClass('active');
		}
		temp = $(this);
		$(this).toggleClass('active');
	});*/
	/*$(window).resize(function(){
		$('#view').text('View: '+$(window).width());
	});*/

	var top = $('#header').offset().top;// + $('#header').height();
	$(document).scroll(function() {
		//var scrollTop = $(window).scrollTop();
		if($(window).scrollTop() >= top){
			$('#header .navbar').addClass('navbar-fixed-top');
		} else {
			$('#header .navbar').removeClass('navbar-fixed-top');
		}
	});
	// expand or collapse list
	$('#expList').find('li:has(ul)').click(function(event) {
  		if (this == event.target) {
  			$(this).toggleClass('expanded');// glyphicon-minus-sign glyphicon-plus-sign
  			$(this).children('ul').toggle('medium');
  		}
  		return false;
  	}).addClass('collapsed').children('ul').hide();// glyphicon glyphicon-plus-sign
	$("#cineplex").change(function(){
		var _data = {_id:$(this).val()}; // _id of the cineplex
		$.post('/selectCineplex', _data, function(data, textStatus, xhr) {
			/*optional stuff to do after success */
			//alert(data);
			$("#titleCineplex").text(data._data[0].name);
			$("#iframe-map").attr('src', 'https://www.google.com/maps/embed/v1/place?q='+data.map+'&key='+data.key);
			$("#cinemas-info .thumbnail img").attr('src', data._data[0].image);
			$(".address-cinema").html("");
			for(var i in data._data[0]){
				if(i != 'name' && i != 'company' && i != 'image' && i != '_id'){
					$(".address-cinema").append("<p><strong>"+i+": </strong>"+data._data[0][i]+"</p>");
				}
			}
		});
	});
	/*$("ul.nav.navbar-nav li.dropdown a.dropdown-toggle").blur(function(e){
		$(this).parent().removeClass('active');
		e.preventDefault();
	});*/
	$("#company_select li a").click(function(){
		//alert($(this).attr('data-url'));
		var _company = $(this).attr('data-url');
		$("#company_select .head-select-title").text($(this).text());
		$("#company").val(_company);
		/*$.ajax({
			url: '/get_cineplex',
			type: 'POST',
			dataType: 'json', //default: Intelligent Guess (Other values: xml, json, script, or html)
			data: {_data: _company},
		})
		.done(function(_data) {
			//console.log("success: ",_data);
			$("#cineplexs_item").html("");
			$("#cineplex_select .head-select-title").text('Rap');
			var _company_temp = "";
			if(_company == "lotte" || _company == "cgv"){
				_company_temp = _company.toUpperCase();
			}
			for(var i in _data){
				$("#cineplexs_item").append("<li><a href='javascript:void(0)' data-url='"+_data[i].name+"'>"+_company_temp+" "+_data[i].name+"</a></li>");
			}
		})
		.fail(function(e) {
			console.log("error: ",e);
		})always(function(datas) {
			console.log("complete: ",datas);
		});*/
	});
	//var data_url = "";
	/*$("#cineplexs_item").on('click','li a', function(){
		//alert($(this).text());
		$("#cineplex_select .head-select-title").text($(this).text());
		data_url = $(this).attr('data-url');
	});*/
	$("#get_list_film_cineplex").click(function(e){
		if($("#company").val() != ""){
			$.ajax({
				url: '/get_list_film',
				type: 'POST',
				//dataType: 'json',//default: Intelligent Guess (Other values: xml, json, script, or html)
				data: {company: $("#company").val(), typeFilm: $("#type_of_film").val()},
			})
			.done(function(data) {
				console.log("success: ",data);
				$("#listFilm > h1").text($("#listFilm > h1").text().substring(0,$("#listFilm > h1").text().trim().lastIndexOf(" ")) + " " +$("#company").val().toUpperCase());
				$("#listFilm > .content-list-film").html(data);
			})
			.fail(function(e) {
				console.log("error: ",e);
			})
			.always(function(cpl) {
				console.log("complete: ",cpl);
			});
		}else{
			alert("OOP!");
		}
		e.preventDefault();
	});

	$.ajax({
			url:"/ajax_get_login_form",
			type:"get",
			dataType:"html",
		}).done(function(data){
			data = JSON.parse(data); console.log(data)
			if(data.nav_add_obj){
				$("#mycontent").append(data.success);
				$("#nav ul.nav.navbar-nav").append(data.nav_add_obj);
			}else{
				$("#mycontent").append(data.success);
			}
		});
		$(document).on('click','#login-btn',function(){
			$.ajax({
				url:"/check_login_info",
				type:"post",
				dataType:"json",
				data:{username:$('#login-username').val(),password:$('#login-password').val()},
			}).done(function(data){
				if(data.success){
					$('#mycontent').html(data.success);
					$("#nav ul.nav.navbar-nav").append(data.nav_add_obj);
				}
				else{
					alert(data.error);
				}
			});
		});
		$(document).on('click','#login-logout',function(){
			$.ajax({
				url:"/logout",
				type:"GET",
				dataType:"json",
				data:{},
			}).done(function(data){
				if(data.success){
					$('#mycontent').html(data.success);
					$('#nav ul.nav.navbar-nav li:last-of-type').remove();
				}
			});
		});
});