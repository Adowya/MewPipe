/**
* CONFIG
**/
var env = "DEV";
var config = {
	currentVersion: "0.0.2",
	debug: false,

	getApiAddr: function () {
		return config.api.prefix + config.api.addr + ":" + config.api.port + config.api.sub;
	},

	api: {
		prefix: "https://",
		addr: "MYIP",
		port: 8080,
		sub: '/api',
		route: {
			logout: "/auth/logout",

			share_create: "/share",
			share_readOne: "/share/users",
			share_readAll: "/shares",
			share_delete: "/share/delete",

			user_create: "/user",
			user_readOne: "/user", // *x-access-token
			user_readAll: "/users",
			user_update: "/users",
			user_delete: "/user/delete/",
			user_findByUsername: "/users/findByUsername",
			user_changePassword: "/user/changePassword",

			video_guest: "/videos/user", // :id
			video_update: "/videos",
			video_last: "/videos/last",
			video_upload: "/videos/upload", // *x-access-token
			video_read: "/videos",
			video_user: "/videos/user/all",
			video_delete: "/videos", // :id *x-access-token
			video_archive: "/videos/archive", // *x-access-token
			video_download: "/videos/download", // :id
			video_image: "/videos/thumbnails", // :id
			video_play: "/videos/play",

			video_browse: "/user/items"
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