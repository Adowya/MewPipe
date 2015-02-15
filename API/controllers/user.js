 module.exports.controller = function(app, router, config, modules, models, middlewares, sessions) {

 	var regExEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
* READ ALL
**/
router.get('/users', function(req, res){
	models.User.find()
	.select("_id firstname lastname email bithdate")
	.exec(function(err, users){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_users": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			res.json({"success": true, "data": users});
		}
	});
});

/**
* READ ALL BY USERNAME
**/
// router.post('/users/findByUsername', function(req, res){
// 	if(req.body.username){
// 		var regExSearch = new RegExp(req.body.username, 'i');
// 		models.User.find()
// 		.select("firstname lastname email bithdate")
// 		.or([{'username': {$regex: regExSearch}}])
// 		.exec(function(err, users){
// 			if(err){
// 				if(config.debug == true){
// 					console.log({"error_GET_user": err});
// 				}
// 				res.json({"success": false, "error": "An error occurred."});
// 			}else{
// 				res.json({"success": true, "users": users});
// 			}
// 		});
// 	}else{
// 		res.json({"success": false, "error": "Missing 'username' field."});
// 	}
// });

/**
* READ ONE
**/
router.get("/user", middlewares.checkAuth, function(req, res){
	var id = req.user._id;
	models.User.findOne({_id: id})
	.select("_id firstname lastname email bithdate")
	.exec(function(err, user){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_user": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			res.json({"success": true, "data": user});
		}
	});
});


/**
* DELETE
**/
router.post("/users/delete", function(req, res){
	var id = req.user._id;
	models.User.findOne({_id: id})
	.exec(function(err, user){
		if(user) {
			console.log("Not implemented yet...");
			res.json({"success": true});
		}else {
			res.json({"success": false, "error": "Invalid user ID."});
		}
	});
});
 
};
