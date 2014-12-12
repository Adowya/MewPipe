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
		login: "/login",
		logout: "/logout"
	},
}

var getApiAddr = function () {
	var apiAddr = appConfig.api.prefix + appConfig.api.addr+":"+appConfig.api.port+"/"+appConfig.api.sub;;
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
