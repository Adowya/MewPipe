 module.exports.controller = function(app, router, config, modules, models, middlewares) {

 	app.get('/auth', modules.passport.authenticate('google'));

 	app.get('/auth/return', function(req, res, next) {
 		modules.passport.authenticate("google", function(err, user, info) {
 			if(err || !user){ 
 				return res.redirect('/error');
 			}
 			req.login(user, function(err) {
 				if(err){ return next(err); }
 				return res.redirect('/');
 			});

 		})(req, res, next);
 	});

 	app.get('/test', middlewares.checkAuth, function(req, res) {
 		res.json({"req": req.user});
 	});

 };