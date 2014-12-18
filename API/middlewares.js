module.exports.controller = function(app, config, modules, models, middlewares) {

	exports.checkAuth = function(req, res, next) {
		if(req.isAuthenticated()){
			return next();
		}
		//res.status(401).end();
		res.redirect('/auth');
	};

	exports.checkAdmin = function(req, res, next) {

	};

	exports.header = function(req, res, next) {
		res.header("Cache-Control", "max-age=1");
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type,x-access-token");
		next();
	};

	exports.multipart = modules.multipart({uploadDir: __dirname+'/STORAGE/temp'});

};