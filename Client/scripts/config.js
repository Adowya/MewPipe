var env = "dev";

if("dev" == env){
	var appConfig = {
		currentVersion: "0.0.1",
		api: {
			prefix: "http://",
			addr: "127.0.0.1",
			port: 8080,
			sub:'/api'
		},
		debug: true
	};
}else if(env == "dist"){
	var appConfig = {
		currentVersion: "0.0.1",
		api: {
			prefix: "https://",
			addr: "",
			port: '80',
			sub:'/api'
		},
		debug: false
	};
}

var apiUrl = {
	route: {
		login: "/auth/google",
		logout: "/auth/logout",

		share_create: "/share",
		share_readOne: "/share/users",
		share_readAll: "/shares",
		share_update: "",
		share_delete: "/share/delete",

		user_create: "/user",
		user_readOne: "/user",
		user_readAll: "/users",
		user_update: "/user",
		user_delete: "/user/delete/",
		user_findByUsername: "/users/findByUsername",
		user_changePassword : "/user/changePassword",

		video_upload: "/videos/upload",
		video_read: "/videos",
		video_readByUser: "/videos/user",
		share_update: "",
		video_delete: "/video/delete",
		video_archive: "/video/archive",
		video_download: "/video/download",
		video_image: "/videos/thumbnails",
		video_play: "/videos/play",

		video_browse: "/user/items"
	},
}


// login: /auth/google
// logout: /auth/logout

// get video: /videos/:vid
// all video: /videos
// all video by userID: /videos/user/:uid
// upload video: POST /videos *x-access-token

// delete video: /videos/delete/:vid *x-access-token
// archive video: /videos/archive/:vid *x-access-token

// view video: /videos/play/:vid
// get thumbnails: /videos/thumbnails/:vid
// download video: /videos/download/:vid


var getApiAddr = function () {
	var apiAddr = appConfig.api.prefix + appConfig.api.addr+":"+appConfig.api.port+appConfig.api.sub;;
	return apiAddr;
};

var appStorage = {
	get: function (item) {
		return JSON.parse(localStorage.getItem(item));
	},
	set: function (name, value) {
		var itemString = JSON.stringify(value);
		localStorage.setItem(name, itemString);
		return true;
	},
	delete: function (item) {
		localStorage.removeItem(item);
		return true;
	}
};
