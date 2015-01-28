var config = {
	schedule_link	:"http://www.platinumcineplex.vn/vi/show-time",
	department_link	:"http://www.platinumcineplex.vn/vi/show-time",
	onScreen_movie_link		:"http://platinumcineplex.vn/vi/movie/list/showing?itemId=3",
	commingSoon_movie_link	:"http://platinumcineplex.vn/vi/movie/list/coming?itemId=3",
	promotion_link 			:"http://platinumcineplex.vn/vi/news/category/news-and-promotion?itemId=6",
	schedule:{
		department_container	: "div.select-time ul:first-of-type li:not(:first-child)",
		department_name			: "span",
		department_id			:"cinema-id",
		movie_container 		: "div.select-time ul:nth-of-type(2) li",
		movie_name				: "span",
		movie_id				:"movie-id",
		time_container	: function(departmentId, movieId,dateId){
			return "ul.list-times li[data-"+ this.department_id + "=" + departmentId +"][data-"+ this.movie_id + "=" + movieId+"]";
		}
	},
	department:{
		container 	: "ul.topnav li:nth-of-type(2) ul li a",
		image		: "#slides2 > div > div > a > img",
		name		: "div.content.container.grid12-8 h2",
		address 	: "span.address p:nth-of-type(4)",
		phone 		: "span.address p:nth-of-type(6)",
		intro		:"span.address p:nth-of-type(2)",
		open_time	:"span.address p:nth-of-type(8)",
		note		:"span.address p:nth-of-type(10)"
	},
	onScreen_movie:{
		container 		: "ul.mov-main-list.container.full li div h2 a:first-of-type",
		image			:"ul.mov-main-list.container.full li > div:first-of-type > a > img",
		info_container 	: "div.content.container.grid12-8",
		name 			: "h2",
		start_time 		: "span.pub-date",
		length 			: "table.movie-info p:first-of-type",
		director 		: "table.movie-info p:nth-of-type(2)",
		player 			: "table.movie-info p:nth-of-type(3)",
		version 		: "table.movie-info p:nth-of-type(4)",
		country 		: "table.movie-info p:nth-of-type(5)",
		kind 			: "table.movie-info p:nth-of-type(6)",
		intro 			: "span.mov-content",
		trailer 		: "iframe.mov-trailer"
	},
	commingSoon_movie:{
		container 		:"ul.mov-main-list.container.full li > div > h2 a:first-of-type",
		image			:"ul.mov-main-list.container.full li > div:first-of-type > a > img",
		info_container 	: "div.content.container.grid12-8",
		name 			: "h2",
		start_time 		: "span.pub-date",
		length 			: "table.movie-info p:first-of-type",
		director 		: "table.movie-info p:nth-of-type(2)",
		player 			: "table.movie-info p:nth-of-type(3)",
		version 		: "table.movie-info p:nth-of-type(4)",
		country 		: "table.movie-info p:nth-of-type(5)",
		kind 			: "table.movie-info p:nth-of-type(6)",
		intro 			: "span.mov-content",
		trailer 		: "iframe.mov-trailer"
	},
	promotion:{
		container 		: "div.container.grid-full ul li > a",
		image			: "a.news-thumb-med > img",
		title 			: "div.container.grid-full>span.post-title",
		content 		: "div.container.grid-full div.post-content section p"
	}
};

module.exports = config;