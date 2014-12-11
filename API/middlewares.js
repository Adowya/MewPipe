module.exports.controller = function(app, config, modules, models, middlewares) {

	exports.checkAuth = function(req, res, next) {
		if(typeof req.headers["x-access-token"] != "undefined"){
			var token = req.headers["x-access-token"];
			models.token.findOne({key: token})
			.populate('_user')
			.exec(function(error, token){
				if(token){
					if (token.ttl >= Math.round(+new Date() / 1000)){
						req.user = token._user;
						token.ttl = Math.round(+new Date() / 1000) + config.ttlToken;
						token.save(function(err) {
							if (err) {
								if(config.debug == true){
									console.log({checkAuth_token_err: err});
								}
								res.send(401);
							}else {
								next();
							}
						});
					}else{
						models.token.remove({_id: token._id}, function(err){
							if(err) {
								if(config.debug == true){
									console.log({error_DELETE_token: err});
								}
							}
						});
						res.send(401);
					}
				}else{
					res.send(401);
				}
			});
		}else{
			res.send(401);
		}
	};

	exports.checkAdmin = function(req, res, next) {
		if(typeof req.headers["x-access-token"] != "undefined"){
			var token = req.headers["x-access-token"];
			models.token.findOne({key: token})
			.populate('_user')
			.exec(function(error, token){
				if(token){
					if (token.ttl >= Math.round(+new Date() / 1000)){
						req.user = token._user;
						token.ttl = Math.round(+new Date() / 1000) + config.ttlToken;
						token.save(function(err) {
							if (err) {
								if(config.debug == true){
									console.log({checkAuth_token_err: err});
								}
								res.send(401);
							}else{
								if(token._user.isAdmin == true){
									next();	
								}else{
									res.send(401);
								}
							}
						});
					}else{
						models.token.remove({_id: token._id}, function(err){
							if(err) {
								if(config.debug == true){
									console.log({error_DELETE_token: err});
								}
							}
						});
						res.send(401);
					}
				}else{
					res.send(401);
				}
			});
		}else{
			res.send(401);
		}
	};

	exports.header = function(req, res, next) {
		res.header("Cache-Control", "max-age=1");
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type,x-access-token");
		next();
	};

};