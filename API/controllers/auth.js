 module.exports.controller = function(app, router, config, modules, models, middlewares, sessions) {

 	app.get('/auth/google', modules.passport.authenticate('google'));

 	app.get('/auth/google/return', function(req, res, next) {
 		modules.passport.authenticate("google", function(err, user, info) {
 			if(err || !user){ 
 				return res.redirect('/#/auth/error');
 			}
 			req.login(user, function(err) {
 				if(err){ return next(err); }
 				res.cookie('token', user.token, {expires: new Date(Date.now() + config.ttlToken*1000)});
 				console.log(sessions);
 				return res.redirect('/#/auth/success');
 			});
 		})(req, res, next);
 	});

 	app.get('/auth/logout', function(req, res, next) {
 		
 		return res.redirect('/#/auth/logout/success');
 	});

 };