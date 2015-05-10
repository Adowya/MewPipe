module.exports.controller = function(app, router, config, modules, models, middlewares, sessions) {


 	app.get('/auth/google', modules.passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }));


 	app.get('/auth/google/callback', function(req, res, next) {
 		modules.passport.authenticate('google', { failureRedirect: '/#/auth/error' }, function(err, user) {
 			if(err || !user){ 
 				return res.redirect('/#/auth/error');
 			}
 			req.login(user, function(err) {
 				if(err){ return next(err); }
 				//res.cookie('token', user.token, {expires: new Date(Date.now() + config.ttlToken*1000)});
 				return res.redirect(req.headers.referer+'#/auth/success/'+user.token);
 			});
 		})(req, res, next);
 	});

 	app.get('/auth/facebook', modules.passport.authenticate('facebook',{ authType: 'rerequest', scope: ['email','user_birthday'] }));

 	app.get('/auth/facebook/callback', function(req, res, next) {
 		modules.passport.authenticate('facebook', { failureRedirect: '/#/auth/error' }, function(err, user) {
 			if(err || !user){ 
 				return res.redirect('/#/auth/error');
 			}
 			req.login(user, function(err) {
 				if(err){ return next(err); }
 				//res.cookie('token', user.token, {expires: new Date(Date.now() + config.ttlToken*1000)});
 				return res.redirect(req.headers.referer+'#/auth/success/'+user.token);
 			});
 		})(req, res, next);
 	});

 	app.get('/auth/logout', middlewares.checkAuth, function(req, res, next) {
 		for(var i=0; i<sessions.length; i++){
 			if(String(req.user._id) == String(sessions[i].userId)){
 				sessions.splice(i, 1);
 			}
 		}
 		return res.json({"success": true});
 	});
};