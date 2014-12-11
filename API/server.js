/**
* CONFIG
**/
var config = require(__dirname+"/config.js").config;

/**
* MODULES
**/
var modules = {
	fs: require("fs"),
	path: require("path"),
	bcrypt: require("bcrypt-nodejs"),
	crypto: require("crypto"),
	url: require('url'),
	multipart: require('connect-multiparty')
};

/**
* MODELS
**/
var models = {};
modules.fs.readdirSync(__dirname+"/models").forEach(function (file) {
	var fileName = file.substr(0,file.length-3);
	var fileExt = file.substr(-3);
	if(fileExt == ".js") {
		if(fileName != "bdd") {
			models[fileName] = require(__dirname+"/models/" + file)[fileName];
		}
	}
});

/**
* EXPRESS
**/
var express = require("express");
var http = require("http");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
app.use(express.static(__dirname + '/../Client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var router = express.Router();
if(true == config.debug) {
	app.use(errorHandler());
	app.use(morgan('combined', {}));
}

/**
* MIDDLEWARES
**/
var middlewares = require(__dirname+"/middlewares.js");
middlewares.controller(app, config, modules, models, middlewares);
app.all("*", middlewares.header);
app.use('/api', router);

/**
* CONTROLLERS
**/
modules.fs.readdirSync(__dirname+"/controllers").forEach(function (file) {
	if(file.substr(-3) == ".js") {
		route = require(__dirname+"/controllers/" + file);
		route.controller(app, router, config, modules, models, middlewares);
	}
});

/**
* START LOGS
**/
console.log("############################ ############################ ############################ ############################");
console.log("Started since: "+new Date().toISOString());
console.log("Environement: "+config.env);
if(true == config.debug) {
	console.log("Debug ON");
}else{
	console.log("Debug OFF");
}

/**
* SERVER
**/
http.createServer(app).listen(config.server.port, function(){
	console.log("MewPipe API listening on "+ config.server.address +":"+ config.server.port);
	console.log("############################ ############################ ############################ ############################");
});
