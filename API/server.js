/**
* CONFIG
**/
var config = require("./config.js").config;

/**
* MODULES
**/
var modules = {
	fs: require("fs"),
	path: require("path"),
	bcrypt: require("bcrypt-nodejs"),
	crypto: require("crypto"),
	url: require('url')
};

/**
* MODELS
**/
var models = {};
modules.fs.readdirSync("./models").forEach(function (file) {
	var fileName = file.substr(0,file.length-3);
	var fileExt = file.substr(-3);
	if(fileExt == ".js") {
		if(fileName != "bdd") {
			models[fileName] = require("./models/" + file)[fileName];
		}
	}
});

/**
* EXPRESS
**/
var express = require("express");
var http = require("http");
var app = express();
app.set("port", process.env.PORT || config.server.port);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({keepExtensions: true, uploadDir: modules.path.join(__dirname, "./STORAGE/temp"), limit: 1099511627776}));
if(true == config.debug) {
	app.use(express.errorHandler());
	app.use(express.logger());
}

/**
* MIDDLEWARES
**/
var middlewares = require("./middlewares.js");
middlewares.controller(app, config, modules, models, middlewares);
app.all("*", middlewares.header);
app.use(app.router);

/**
* CONTROLLERS
**/
modules.fs.readdirSync("./controllers").forEach(function (file) {
	if(file.substr(-3) == ".js") {
		route = require("./controllers/" + file);
		route.controller(app, config, modules, models, middlewares);
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
http.createServer(app).listen(app.get("port"), function(){
	console.log("SupDropBox API listening on "+ config.server.address +":"+ app.get("port"));
	console.log("############################ ############################ ############################ ############################");
});
