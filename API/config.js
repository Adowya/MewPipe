/**
* CONFIG
**/
var env = "DEV"; // DEV / PROD
var config = { 
	"server": {
		"port": 80,
		"address": "192.168.1.13"
	},
	"salt": "$2a$10$sU3LKpiKHhQfcEezTKuZnY",
	"ttlToken": 7200, //1H
	"debug": false,
	"env": env,
	"root_dir": __dirname
};
if("DEV" == env){
	config.server.address = "localhost";
	config.server.port = 8080;
	config.debug = true;
}

exports.config = config;