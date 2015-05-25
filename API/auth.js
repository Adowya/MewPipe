var config = require(__dirname+"/config.js").config;
var bcrypt = require("bcrypt-nodejs");
var crypto = require("crypto");
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var fbStrategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require(__dirname+"/models/User.js").User;
passport.sessions = [];


passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new fbStrategy({
    clientID: config.oauth.facebook.clientId,
    clientSecret: config.oauth.facebook.clientSecret,
    callbackURL: "/auth/facebook/callback",
    enableProof: false
 },
 function(accessToken, refreshToken, profile, done) {
 	process.nextTick(function () {
	 	crypto.randomBytes(48, function(err, randomKey) {
	 		var key = randomKey.toString("hex");
	 		User.findOne({accessToken: profile._json.id})
	 		.select("firstname lastname email accessToken")
	 		.lean()
	 		.exec(function(err, user){
	 			if(user){
	 				user.token = key;
	 				var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
	 				for(var i=0; i<passport.sessions.length; i++){
	 					if(String(passport.sessions[i].userId) == String(user._id)){
	 						passport.sessions.splice(i, 1);
	 					}
	 				}
	 				passport.sessions.push({userId: user._id, token: user.token, ttl: ttlToken});
	 				return done(null, user);
	 			}else{
	 				var user = {
	 					firstname: profile._json.first_name,
	 					lastname: profile._json.last_name,
	 					email: profile._json.email,
	 					accessToken: profile._json.id,
	 					birthdate: profile._json.birthday
	 				};
	 				var newUser = new User(user);
	 				user.token = key;
	 				var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
	 				newUser.save(function(err, newUser){
	 					if(err){
	 						console.log(err);
	 					}
	 					for(var i=0; i<passport.sessions.length; i++){
	 						if(String(passport.sessions[i].userId) == String(newUser._id)){
	 							passport.sessions.splice(i, 1);
	 						}
	 					}
	 					passport.sessions.push({userId: newUser._id, token: user.token, ttl: ttlToken});
	 					return done(err, user);
	 				});
	 			}
	 		});
	 	});
	});
}));

passport.use(new googleStrategy({
	clientID: config.oauth.google.clientId,
	clientSecret: config.oauth.google.clientSecret,
	callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		crypto.randomBytes(48, function(err, randomKey) {
			var key = randomKey.toString("hex");
			User.findOne({accessToken: profile._json.id})
			.select("firstname lastname email accessToken")
			.lean()
			.exec(function(err, user){
				if(user){
					user.token = key;
					var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
					for(var i=0; i<passport.sessions.length; i++){
						if(String(passport.sessions[i].userId) == String(user._id)){
							passport.sessions.splice(i, 1);
						}
					}
					passport.sessions.push({userId: user._id, token: user.token, ttl: ttlToken});
					return done(null, user);
				}else{
					var user = {
						firstname: profile._json.name.givenName,
						lastname: profile._json.name.familyName,
						email: profile._json.emails[0].value,
						accessToken: profile._json.id,
						birthdate: profile._json.birthday
					};
					var newUser = new User(user);
					user.token = key;
					var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
					newUser.save(function(err, newUser){
						if(err){
							console.log(err);
						}
						for(var i=0; i<passport.sessions.length; i++){
							if(String(passport.sessions[i].userId) == String(newUser._id)){
								passport.sessions.splice(i, 1);
							}
						}
						passport.sessions.push({userId: newUser._id, token: user.token, ttl: ttlToken});
						return done(err, user);
					});
				}
			});
		});
	});
}
));

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
	process.nextTick(function () {
		crypto.randomBytes(48, function(err, randomKey) {
			var key = randomKey.toString("hex");
			User.findOne({email: email, accessToken: bcrypt.hashSync(password, config.salt)})
			.select("firstname lastname email accessToken")
			.lean()
			.exec(function(err, user){
				if(user){
					user.token = key;
					var ttlToken = Math.round(+new Date() / 1000) + config.ttlToken;
					for(var i=0; i<passport.sessions.length; i++){
						if(String(passport.sessions[i].userId) == String(user._id)){
							passport.sessions.splice(i, 1);
						}
					}
					passport.sessions.push({userId: user._id, token: user.token, ttl: ttlToken});
					return done(null, user);
				}else{
					return done(err, user);
				}
			});
		});
	});
}));

module.exports = passport;