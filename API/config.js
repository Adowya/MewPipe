/**
* CONFIG
**/
var config = { 
	"server": {
		"port": 8888,
		"address": "192.168.1.13"
	},
	"salt": "$2c$10$sU3LKpiKHhQfcEezTKuZnY",
	"ttlToken": 7200, //1H
	"debug": false,
	"env": "DEV",
	"root_dir": __dirname
};

exports.config = config;