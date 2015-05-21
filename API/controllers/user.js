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
	.select("_id firstname lastname email bithdate created")
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
* CREATE
**/
router.post("/users", function(req, res){
	if(req.body.birthdate && req.body.email && req.body.password && req.body.firstname && req.body.lastname){
		if(regExEmail.test(req.body.email)){
			var newUser = new models.User({
				accessToken: modules.bcrypt.hashSync(req.body.password, config.salt),
				birthdate: req.body.birthdate,
				email: req.body.email,
				firstname: req.body.firstname,
				lastname: req.body.lastname
			});
			models.User.find({email: newUser.email})
			.select("email")
			.exec(function(err, testEmail){
				if(testEmail.length > 0) {
					res.json({"success": false, "error": "Email already exist."});
				}else{
					newUser.save(function(err, newUser){
						if(err){
							if(config.debug){
								console.log({"error_ADD_user": err});
							}
							res.json({"success": false, "error": "An error occurred."});
						}else{
							res.json({"success": true, "data": newUser});
						}
					});
				}
			});
		}else{
			res.json({"success": false, "error": "Invalid email."});
		}
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});

/**
* UPDATE
**/
router.put("/users", middlewares.checkAuth, function(req, res){
	if(req.body.birthdate && req.body.email && req.body.firstname && req.body.lastname){
		if(regExEmail.test(req.body.email)){
			var editUser = {
				birthdate: req.body.birthdate,
				email: req.body.email,
				firstname: req.body.firstname,
				lastname: req.body.lastname
			};
			models.User.find({email: editUser.email})
			.select("email")
			.where("deleted").ne(true)
			.exec(function(err, testEmail){
				if(testEmail.length > 0) {
					if(req.user.email != editUser.email){
						res.json({"success": false, "error": "Email address already exist."});
						return;
					}
				}
				models.User.update({_id: req.user._id}, editUser, function(err){
					if(err) {
						if(config.debug == true){
							console.log({"error_PUT_user": err});
						}
						res.json({"success": false, "error": "An error occurred."});
					}else {
						res.json({"success": true});
					}
				});
			});
		}else{
			res.json({"success": false, "error": "Invalid email."});
		}
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});

/**
* DELETE
**/
router.delete("/users", function(req, res){
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
