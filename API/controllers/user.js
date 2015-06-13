 module.exports.controller = function(app, router, config, modules, models, middlewares, sessions) {

 	var regExEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
* READ ALL
**/
router.get('/users', function(req, res){
	models.User.find()
	.select("-identifier -__v")
	.exec(function(err, users){
		if(err){
			if(config.debug){
				console.log({"error_GET_users": err});
			}
			return res.json({"success": false, "error": "An error occurred."});
		}
		return res.json({"success": true, "data": users});
	});
});


/**
* READ ONE
**/
router.get("/user", middlewares.checkAuth, function(req, res){
	var id = req.user._id;
	models.User.findOne({_id: id})
	.select("-identifier -__v")
	.exec(function(err, user){
		if(err){
			if(config.debug){
				console.log({"error_GET_user": err});
			}
			return res.json({"success": false, "error": "An error occurred."});
		}
		return res.json({"success": true, "data": user});
	});
});


/**
* GET USERS STATS
**/
router.get("/users/stats", middlewares.checkAuth, function(req, res){
	var id = req.user._id;
	models.Video.find({_user: id})
	.exec(function(err, videos){
		if(err){
			if(config.debug){
				console.log({"error_GET_user": err});
			}
			return res.json({"success": false, "error": "An error occurred."});
		}
		models.View.find({_user: id})
		.exec(function(err, views){
			if(err){
				if(config.debug){
					console.log({"error_GET_user": err});
				}
				return res.json({"success": false, "error": "An error occurred."});
			}
			return res.json({"success": true, "data": {videos: videos.length, views: views.length}});
		});
	});
});


/**
* CREATE
**/
router.post("/users", function(req, res){
	if(req.body.birthdate && req.body.email && req.body.password && req.body.firstname && req.body.lastname){
		if(!regExEmail.test(req.body.email)){
			return res.json({"success": false, "error": "Invalid email."});
		}
		var newUser = new models.User({
			identifier: modules.bcrypt.hashSync(req.body.password, config.salt),
			birthdate: req.body.birthdate,
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			authProvider: "local"
		});
		models.User.findOne({email: newUser.email})
		.select("email")
		.exec(function(err, testEmail){
			if(testEmail) {
				return res.json({"success": false, "error": "Email already exist."});
			}
			newUser.save(function(err, newUser){
				if(err){
					if(config.debug){
						console.log({"error_ADD_user": err});
					}
					return res.json({"success": false, "error": "An error occurred."});
				}
				return res.json({"success": true, "data": newUser});
			});
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});


/**
* UPDATE
**/
router.put("/users", middlewares.checkAuth, function(req, res){
	if(req.body.birthdate && req.body.email && req.body.firstname && req.body.lastname){
		if(!regExEmail.test(req.body.email)){
			return res.json({"success": false, "error": "Invalid email."});
		}
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
					return res.json({"success": false, "error": "Email address already exist."});
				}
			}
			models.User.update({_id: req.user._id}, editUser, function(err){
				if(err) {
					if(config.debug){
						console.log({"error_PUT_user": err});
					}
					return res.json({"success": false, "error": "An error occurred."});
				}
				return res.json({"success": true});
			});
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});


/**
* CHANGE PASSWORD
**/
router.put("/user/changePassword", middlewares.checkAuth, function(req, res){
	if(req.user.authProvider != "local"){
		return res.json({"success": false, "error": "You can't change your password."});
	}
	if(typeof req.body.oldPass == "undefined"){
		return res.json({"success": false, "error": "Old password undefined."});
	}
	if(typeof req.body.newPass == "undefined"){
		return res.json({"success": false, "error": "New password undefined."});
	}
	var id = req.user._id;
	var oldPass =  modules.bcrypt.hashSync(req.body.oldPass, config.salt);
	var newPass =  modules.bcrypt.hashSync(req.body.newPass, config.salt);

	models.User.find({_id: id, identifier: oldPass})
	.exec(function(err, user){
		if(user.length > 0) {
			var query = {_id: req.user._id},
			data_update = {
				identifier: newPass
			};
			models.User.update(query, data_update, function(err){
				if(err) {
					if(config.debug){
						console.log({"error_changePass": err});
					}
					return res.json({"success": false, "error": "An error occured."});
				}
				res.json({"success": true});
			});
		}else {
			res.json({"success": false, "error": " Invalid old password."});
		}
	});
});


/**
* DELETE
**/
router.delete("/users", middlewares.checkAuth, function(req, res){
	var id = req.user._id;
	models.User.findOne({_id: id})
	.exec(function(err, user){
		if(err) {
			return res.json({"success": false, "error": "Invalid user ID."});
		}
		models.Video.find({_user: id})
		.exec(function(err, videos){
			if(videos){
				for(var i=0; i < videos.length; i++){
					modules.fs.unlink(config.videoDirectory+"/"+videos[i]._id+"."+videos[i].ext, function(){return});
					modules.fs.unlink(config.thumbnailsDirectory+"/"+videos[i]._id+".png", function(){return});
				}
			}
		});
		models.User.find({_id: id}).remove().exec(function(err){
			return;
		});
		models.Video.find({_user: id}).remove().exec(function(err){
			return;
		});
		models.View.find({_user: id}).remove().exec(function(err){
			return;
		});
		res.json({"success": true});
	});
});

};
