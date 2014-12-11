 module.exports.controller = function(app, config, modules, models, middlewares) {

 	var regExEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
* LOGIN
**/
app.post("/user/login", function(req, res){
	if(typeof req.body.username != "undefined" && typeof req.body.password != "undefined"){
		var username = req.body.username;
		var password = modules.bcrypt.hashSync(req.body.password, config.salt);
		models.user.findOne({username: username, password: password})
		.populate('_plan')
		.exec(function(error, user){
			if(user){
				modules.crypto.randomBytes(48, function(err, randomKey) {
					var key = randomKey.toString("hex");
					models.token.findOne({_user: user._id}, function(err, token){
						if(token){
							token.key = key;
							token.ttl = Math.round(+new Date() / 1000) + config.ttlToken;
							token.save(function(err) {
								if(err){
									if(config.debug == true){
										console.log({"error_NEW_token": err});
									}
									res.json({"success": false, "error": "An error occurred."});
								}else{
									user.password = undefined;
									user.deleted = undefined;
									user._plan.deleted = undefined;
									res.json({"success": true, "token": token.key, "user": user});
								}
							});
						}else{
							var newToken = new models.token({
								key: key,
								_user: user._id,
								ttl: Math.round(+new Date() / 1000) + config.ttlToken
							});
							newToken.save(function (err, token) {
								if(err){
									if(config.debug == true){
										console.log({error_token: err});
									}
									res.json({"success": false, "error": "An error occurred."});
								}else{
									user.password = undefined;
									user.deleted = undefined;
									user._plan.deleted = undefined;
									res.json({"success": true, "token": token.key, "user": user});
								}
							});
						}
					});
				});
			}else{
				res.json({"success": false, "error": "Invalid username / password."});
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});

/**
* LOGOUT
**/
app.get("/user/logout", middlewares.checkAuth, function(req, res){
	var query = models.token.findOne({_user: req.user._id});
	query.exec(function(error, token){
		if(token){
			token.remove(function(err){
				if(err) {
					if(config.debug == true){
						console.log({"error_DELETE_token": err});
					}
					res.json({"success": false, "error": "An error occurred."});
				}else{
					res.json({"success": true});
				}
			});
		}else{
			res.json({"success": false, "error": "An error occurred."});
		}
	});
});

/**
* READ ALL
**/
app.get('/users', middlewares.checkAuth, function(req, res){
	models.user.find()
	.select("username lastname firstname created")
	.where("deleted").ne(true)
	.exec(function(err, users){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_user": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			res.json({"success": true, "users": users});
		}
	});
});

/**
* READ ALL BY USERNAME
**/
app.post('/users/findByUsername', middlewares.checkAuth, function(req, res){
	if(req.body.username){
		var regExSearch = new RegExp(req.body.username, 'i');
		models.user.find()
		.select("username lastname firstname created")
		.where("deleted").ne(true)
		.or([{'username': {$regex: regExSearch}}])
		.exec(function(err, users){
			if(err){
				if(config.debug == true){
					console.log({"error_GET_user": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else{
				res.json({"success": true, "users": users});
			}
		});
	}else{
		res.json({"success": false, "error": "Missing 'username' field."});
	}
});

/**
* READ ONE
**/
app.get("/user", middlewares.checkAuth, function(req, res){
	var id = req.user._id;
	models.user.findOne({_id: id})
	.populate('_plan')
	.select("username lastname firstname email description subscriptionDate created isAdmin")
	.where("deleted").ne(true)
	.exec(function(err, user){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_user": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			res.json({"success": true, "user": user});
		}
	});
});

/**
* CREATE
**/
app.post("/user", function(req, res){
	if(req.body.username && req.body.password && req.body.email && req.body.firstname && req.body.lastname){
		if(regExEmail.test(req.body.email) == true){
			if(req.body.username.indexOf(' ') === -1){
				models.plan.findOne({isDefault: true})
				.where("deleted").ne(true)
				.exec(function(err, plan){
					if(plan){
						if(req.body.username.length <= 12){
							var newUser = new models.user({
								username: req.body.username,
								password: modules.bcrypt.hashSync(req.body.password, config.salt),
								email: req.body.email,
								firstname: req.body.firstname,
								lastname: req.body.lastname,
								_plan: plan._id
							});
							models.user.find({username: newUser.username})
							.select("username")
							.where("deleted").ne(true)
							.exec(function(err, testUsername){
								if(testUsername.length > 0) {
									res.json({"success": false, "error": "Username already exist."});
								}else{
									models.user.find({email: newUser.email})
									.select("email")
									.where("deleted").ne(true)
									.exec(function(err, testEmail){
										if(testEmail.length > 0) {
											res.json({"success": false, "error": "Email address already exist."});
										}else{
											newUser.save(function(err, newUser){
												if(err){
													if(config.debug == true){
														console.log({"error_ADD_user": err});
													}
													res.json({"success": false, "error": "An error occurred."});
												}else{
													if(config.debug == true){
														console.log({"New user": {"_id": newUser._id, "username": newUser.username}});
													}
													var path = config.root_dir+"/STORAGE/files/"+newUser._id;
													modules.fs.mkdir(path, function(err){
														if(err){
															res.json({"success": false, "error": "Can't create your private directory."});
														}else{
															var newItem = new models.item({
																_user: newUser._id,
																_parentId: null,
																type: 'dir',
																name: "/",
																path: "/"+newUser._id,
																size: null
															});
															newItem.save(function(err, item) {
																if(!err){
																	newUser.password = undefined;
																	newUser.deleted = undefined;
																	res.json({"success": true, "user": newUser});
																}else{
																	res.json({"success": false, "error": "Can't initialize your private directory."});
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}else{
							res.json({"success": false, "error": "Username size must be less than 12 caracters."});
						}
					}else{
						res.json({"success": false, "error": "Can't found default plan."});
					}
				});
			}else{
				res.json({"success": false, "error": "Username must not contain blank spaces."});
			}
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
app.put("/user", middlewares.checkAuth, function(req, res){
	if(req.body.username && req.body.email && req.body.firstname && req.body.lastname){
		if(regExEmail.test(req.body.email) == true){
			if(req.body.username.indexOf(' ') === -1){
				if(req.body.username.length <= 12){
					var editUser = {
						username: req.body.username,
						email: req.body.email,
						firstname: req.body.firstname,
						lastname: req.body.lastname
					};
					models.user.find({username: editUser.username})
					.select("username")
					.where("deleted").ne(true)
					.exec(function(err, testUsername){
						if(testUsername.length > 0) {
							if(req.user.username != editUser.username){
								res.json({"success": false, "error": "Username already exist."});
								return;
							}	
						}
						models.user.find({email: editUser.email})
						.select("email")
						.where("deleted").ne(true)
						.exec(function(err, testEmail){
							if(testEmail.length > 0) {
								if(req.user.email != editUser.email){
									res.json({"success": false, "error": "Email address already exist."});
									return;
								}
							}
							models.user.update({_id: req.user._id}, editUser, function(err){
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
					});
				}else{
					res.json({"success": false, "error": "Username size must be less than 12 caracters."});
				}
			}else{
				res.json({"success": false, "error": "Username must not contain blank spaces."});
			}
		}else{
			res.json({"success": false, "error": "Invalid email."});
		}
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});

 /**
* PROMOTE USER
**/
app.post("/user/promote", middlewares.checkAdmin, function(req, res){
	if(req.body.username){
		var editUser = {
			isAdmin: true
		};
		models.user.update({username: req.body.username}, editUser, function(err){
			if(err) {
				if(config.debug == true){
					console.log({"error_PUT_user": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else {
				res.json({"success": true});
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed (username)."});
	}
});

 /**
* DEMOTE USER
**/
app.post("/user/demote", middlewares.checkAdmin, function(req, res){
	if(req.body.username){
		var editUser = {
			isAdmin: false
		};
		models.user.update({username: req.body.username}, editUser, function(err){
			if(err) {
				if(config.debug == true){
					console.log({"error_PUT_user": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else {
				res.json({"success": true});
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed (username)."});
	}
});

/**
* CHANGE PASSWORD
**/
app.put("/user/changePassword", middlewares.checkAuth, function(req, res){
	if (typeof req.body.oldPass != "undefined"){
		if (typeof req.body.newPass != "undefined"){
			var id = req.user._id;
			var oldPass =  modules.bcrypt.hashSync(req.body.oldPass, config.salt);
			var newPass =  modules.bcrypt.hashSync(req.body.newPass, config.salt);

			models.user.find({_id: id, password: oldPass})
			.where("deleted").ne(true)
			.select("username")
			.exec(function(err, user){
				if(user.length > 0) {
					var query = {_id: req.user._id},
					data_update = {
						password: newPass
					};
					models.user.update(query, data_update, function(err){
						if(err) {
							if(config.debug == true){
								console.log({"error_changePass": err});
							}
							res.json({"success": false, "error": "An error occurred."});
						}else {
							res.json({"success": true});
						}
					});
				}else {
					res.json({"success": false, "error": "Invalid old password."});
				}
			});
		}else{
			res.json({"success": false, "error": "New password undefined."});
		}
	}else{
		res.json({"success": false, "error": "Old password undefined."});
	}
});

/**
* DELETE
**/
app.put("/user/delete", middlewares.checkAuth, function(req, res){
	if(typeof req.body.pass != "undefined"){
		var id = req.user._id;
		var pass =  modules.bcrypt.hashSync(req.body.pass, config.salt);

		models.user.findOne({_id: id, password: pass})
		.where("deleted").ne(true)
		.exec(function(err, user){
			if(user) {
				models.user.update({_id: id},{deleted: true}, function(err){
					return;
				});
				models.item.update({_user: id},{deleted: true}, {multi: true}, function(err){
					return;
				});
				models.share.update({_id: id}, {deleted: true}, {multi: true}, function(err){
					return;
				});
				models.token.find({_user: id}).remove().exec(function(err){
					return;
				});
				res.json({"success": true});
			}else {
				res.json({"success": false, "error": "Invalid password."});
			}
		});
	}else{
		res.json({"success": false, "error": "Invalid password."});
	}
});
 
};
