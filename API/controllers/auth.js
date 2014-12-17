 module.exports.controller = function(app, router, config, modules, models, middlewares) {

 	app.get('/auth', modules.passport.authenticate('google'));

 	app.get('/auth/return',
 		modules.passport.authenticate('google', {
 			successRedirect : '/',
 			failureRedirect : '/login'
 		})
 	);

 	app.get('/test', middlewares.ensureAuthenticated, function(req, res) {
 		res.json({"req": req.isAuthenticated});
 	});

 };