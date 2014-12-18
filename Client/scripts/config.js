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
		login: "/user/login",
		logout: "/user/logout",

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

		video_upload: "/video",
		video_read: "/video",
		share_update: "",
		video_delete: "/video/delete/",
		video_download: "/video/download/",
		video_browse: "/user/items"
	},
}

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
