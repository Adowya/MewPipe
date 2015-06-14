/**
* CONFIG
**/
var env = "PROD";
var config = {
	currentVersion: "1.0.0",
	debug: false,

	getApiAddr: function () {
		return config.api.prefix + config.api.addr + ":" + config.api.port;
	},

	api: {
		prefix: "http://",
		addr: "localhost",
		port: 8080,
		sub: '/api',
		route: {
			auth_logout: "/auth/logout",
			auth_login: "/auth/local",
			auth_user : "/auth/user",
			auth_supinfo : '/auth/supinfo',
			
			share_create: "/api/share",
			share_readOne: "/api/share/users",
			share_readAll: "/api/shares",
			share_delete: "/api/share/delete",

			user_create: "/api/users",
			user_readOne: "/api/user", // *x-access-token
			user_readAll: "/api/users",
			user_update: "/api/users",
			user_delete: "/api/users/",
			user_findByUsername: "/api/users/findByUsername",
			user_changePassword: "/api/user/changePassword", // *x-access-token 
			user_suggested: "/api/user/videos/suggestion",
			user_stat: "/api/users/stats",
			
			video_upload: "/api/videos/upload", // *x-access-token
			video_update: "/api/videos",
			video_read: "/api/videos",
			video_delete: "/api/videos", // :id *x-access-token
			video_guest: "/api/videos/user", // :id
			video_user: "/api/videos/user/all",
			video_search: "/api/videos/search",
			video_last: "/api/videos/last",
			video_related: "/api/videos/related", // :vid *x-access-token
			video_convert: "/api/videos/getConvertPercent", // :<videoId>
			video_download: "/api/videos/download", // :id
			video_image: "/api/videos/thumbnails", // :id
			video_play: "/api/videos/play"
		}
	},

	storage: {
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
	}
};

// Dev properties
if (env == "DEV") {
	config.api.prefix = "http://";
	config.api.addr = "localhost";
	config.api.port = 8080;
	config.debug = true;
}