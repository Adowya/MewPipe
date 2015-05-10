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
	multipart: require('connect-multiparty'),
	passport: require('passport'),
	ffmpeg: require('fluent-ffmpeg'),
	fbStrategy: require('passport-facebook').Strategy,
	googleStrategy: require('passport-google-oauth').OAuth2Strategy
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
* PASSPORT
**/
var sessions = [];
modules.passport.serializeUser(function(user, done) {
	done(null, user);
});
modules.passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

modules.passport.use(new modules.fbStrategy({
    clientID: config.oauth.facebook.clientId,
    clientSecret: config.oauth.facebook.clientSecret,
    callbackURL: "/auth/facebook/callback",
    enableProof: false
 },
 function(accessToken, refreshToken, profile, done) {
 	process.nextTick(function () {
	 	modules.crypto.randomBytes(48, function(err, randomKey) {
	 		var key = randomKey.toString("hex");
	 		models.User.findOne({authId: profile._json.id})
	 		.select("firstname lastname email authId")
	 		.lean()
	 		.exec(function(err, user){
	 			if(user){
	 				user.token = key;
	 				var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
	 				for(var i=0; i<sessions.length; i++){
	 					if(String(sessions[i].userId) == String(user._id)){
	 						sessions.splice(i, 1);
	 					}
	 				}
	 				sessions.push({userId: user._id, token: user.token, ttl: ttlToken});
	 				return done(null, user);
	 			}else{
	 				var user = {
	 					firstname: profile._json.first_name,
	 					lastname: profile._json.last_name,
	 					email: profile._json.email,
	 					authId: profile._json.id,
	 					birthdate: profile._json.birthday
	 				};
	 				var newUser = new models.User(user);
	 				user.token = key;
	 				var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
	 				newUser.save(function(err, newUser){
	 					if(err){
	 						console.log(err);
	 					}
	 					for(var i=0; i<sessions.length; i++){
	 						if(String(sessions[i].userId) == String(newUser._id)){
	 							sessions.splice(i, 1);
	 						}
	 					}
	 					sessions.push({userId: newUser._id, token: user.token, ttl: ttlToken});
	 					return done(err, user);
	 				});
	 			}
	 		});
	 	});
	});
}));

modules.passport.use(new modules.googleStrategy({
    clientID: config.oauth.google.clientId,
    clientSecret: config.oauth.google.clientSecret,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      modules.crypto.randomBytes(48, function(err, randomKey) {
	 		var key = randomKey.toString("hex");
	 		models.User.findOne({authId: profile._json.id})
	 		.select("firstname lastname email authId")
	 		.lean()
	 		.exec(function(err, user){
	 			if(user){
	 				user.token = key;
	 				var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
	 				for(var i=0; i<sessions.length; i++){
	 					if(String(sessions[i].userId) == String(user._id)){
	 						sessions.splice(i, 1);
	 					}
	 				}
	 				sessions.push({userId: user._id, token: user.token, ttl: ttlToken});
	 				return done(null, user);
	 			}else{
	 				var user = {
	 					firstname: profile._json.name.givenName,
	 					lastname: profile._json.name.familyName,
	 					email: profile._json.emails[0].value,
	 					authId: profile._json.id,
	 					birthdate: profile._json.birthday
	 				};
	 				var newUser = new models.User(user);
	 				user.token = key;
	 				var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
	 				newUser.save(function(err, newUser){
	 					if(err){
	 						console.log(err);
	 					}
	 					for(var i=0; i<sessions.length; i++){
	 						if(String(sessions[i].userId) == String(newUser._id)){
	 							sessions.splice(i, 1);
	 						}
	 					}
	 					sessions.push({userId: newUser._id, token: user.token, ttl: ttlToken});
	 					return done(err, user);
	 				});
	 			}
	 		});
	 	});
    });
  }
));

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
app.use(modules.passport.initialize());
app.use(modules.passport.session());
var router = express.Router();
if(false == config.debug) {
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
* CLEAR TEMP
**/
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
