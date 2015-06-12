/**
* CONFIG
**/
var config = require(__dirname+"/config.js").config;

/**
* MODULES
**/
var modules = {
	fs: require("fs"),
	async: require("async"),
	path: require("path"),
	bcrypt: require("bcrypt-nodejs"),
	crypto: require("crypto"),
	url: require('url'),
	_: require('lodash-node'),
	multipart: require('connect-multiparty'),
	ffmpeg: require('fluent-ffmpeg'),
	hbjs: require("handbrake-js"),
	auth: require(__dirname+"/auth.js")
};
var sessions = modules.auth.sessions;


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
app.use(modules.auth.initialize());
app.use(modules.auth.session());
var router = express.Router();
if(!config.debug) {
	app.use(errorHandler());
	app.use(morgan('combined', {}));
}

/**
* MIDDLEWARES
**/
var middlewares = require(__dirname+"/middlewares.js");
middlewares.controller(app, config, modules, models, middlewares, sessions);
app.all("*", middlewares.header);
app.use('/api', router);


/**
* CONTROLLERS
**/
modules.fs.readdirSync(__dirname+"/controllers").forEach(function (file) {
	if(file.substr(-3) == ".js") {
		route = require(__dirname+"/controllers/" + file);
		route.controller(app, router, config, modules, models, middlewares, sessions);
	}
});

/**
* CREATE STORAGE DIR
**/
if(!modules.fs.existsSync(__dirname+"/STORAGE/")){
	modules.fs.mkdirSync(__dirname+"/STORAGE/");
}
if(!modules.fs.existsSync(__dirname+"/STORAGE/.tmp")){
	modules.fs.mkdirSync(__dirname+"/STORAGE/.tmp");
}
if(!modules.fs.existsSync(__dirname+"/STORAGE/videos")){
	modules.fs.mkdirSync(__dirname+"/STORAGE/videos");
}
if(!modules.fs.existsSync(__dirname+"/STORAGE/thumbnails")){
	modules.fs.mkdirSync(__dirname+"/STORAGE/thumbnails");
}
modules.fs.readdirSync(config.tmpDirectory).forEach(function (file) {
	modules.fs.unlink(config.tmpDirectory+"/"+file, function(){return});
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
