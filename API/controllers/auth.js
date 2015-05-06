 module.exports.controller = function(app, router, config, modules, models, middlewares, sessions) {

 	// app.get('/auth/google', modules.passport.authenticate('google'));

 	// app.get('/auth/google/return', function(req, res, next) {
 	// 	modules.passport.authenticate("google", function(err, user, info) {
 	// 		if(err || !user){ 
 	// 			return res.redirect('/#/auth/error');
 	// 		}
 	// 		req.login(user, function(err) {
 	// 			if(err){ return next(err); }
 	// 			res.cookie('token', user.token, {expires: new Date(Date.now() + config.ttlToken*1000)});
 	// 			console.log(sessions);
 	// 			return res.redirect('/#/auth/success');
 	// 		});
 	// 	})(req, res, next);
 	// });

 	app.get('/auth/logout', middlewares.checkAuth, function(req, res, next) {
 		for(var i=0; i<sessions.length; i++){
 			if(String(req.user._id) == String(sessions[i].userId)){
 				sessions.splice(i, 1);
 			}
 		}
 		return res.json({"success": true});
 	});

 	app.get('/auth/facebook',
 		modules.passport.authenticate('facebook',{ authType: 'rerequest', scope: ['email','user_birthday'] }));

 // 	app.get('/auth/facebook/callback',
 // 		modules.passport.authenticate('facebook', { failureRedirect: '/login' }),
 // 		function(req, res) {
 // 			req.login(user, function(err) {
 // 				if(err){ return next(err); }
 // 				res.cookie('token', user.token, {expires: new Date(Date.now() + config.ttlToken*1000)});
 // 				console.log(sessions);
 // 				return res.redirect('/#/auth/success');
 // 			});
	// });

	 	app.get('/auth/facebook/callback', function(req, res, next) {
 		modules.passport.authenticate('facebook', { failureRedirect: '/login' }, function(err, user) {
 			if(err || !user){ 
 				return res.redirect('/#/auth/error');
 			}
 			req.login(user, function(err) {
 				if(err){ return next(err); }
 				//res.cookie('token', user.token, {expires: new Date(Date.now() + config.ttlToken*1000)});
 				console.log(sessions);
 				return res.redirect('/#/auth/success/'+user.token);
 			});
 		})(req, res, next);
 	});
 };