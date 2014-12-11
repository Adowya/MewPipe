var env = "dev";

if("dev" == env){
	var appConfig = {
		currentVersion: "0.0.1",
		api: {
			addr: "127.0.0.1",
			port: 1337,
		},
		debug: true
	};
}else if(env == "dist"){
	var appConfig = {
		currentVersion: "0.0.1",
		api: {
			addr: "",
			port: '80',
		},
		debug: false
	};
}