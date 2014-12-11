module.exports.controller = function(app, config, modules, models, middlewares) {

/**
* CREATE
**/
app.post("/friend/add", middlewares.checkAuth, function(req, res){
	if(req.body._userAnswerer){
		if(req.body._userAnswerer != req.user._id){
			var newFriend = new models.friend({
				_userAsker: req.user._id,
				_userAnswerer: req.body._userAnswerer
			});
			models.friend.findOne({_userAnswerer: newFriend._userAnswerer, _userAsker: newFriend._userAsker})
			.where("deleted").ne(true)
			.exec(function(err, alreadyFriend){
				if(err){
					if(config.debug == true){
						console.log({"error_GET_user_friend_add": err});
					}
					res.json({"success": false, "error": "An error occurred."});
				}else if(alreadyFriend){
					if(alreadyFriend.valid == false){
						res.json({"success": false, "error": "Friend request already sent."});
					}else{
						res.json({"success": false, "error": "You are already friend."});
					}
				}else{
					models.user.findOne({_id: newFriend._userAnswerer})
					.where("deleted").ne(true)
					.exec(function(err, user){
						if(err){
							if(config.debug == true){
								console.log({"error_GET_user_friend_add": err});
							}
							res.json({"success": false, "error": "This user could not be found."});
						}else if(user){
							newFriend.save(function(err, newFriend){
								if(err){
									if(config.debug == true){
										console.log({"error_ADD_friend": err});
									}
									res.json({"success": false, "error": "An error occurred."});
								}else{
									newFriend.deleted = undefined;
									res.json({"success": true, "friendRequest": newFriend});
								}
							});
						}else{
							res.json({"success": false, "error": "This user could not be found."});
						}
					});
				}
			});
		}else{
			res.json({"success": false, "error": "Can't add yourself as a friend."});
		}
	}else{
		res.json({"success": false, "error": "Missing '_userAnswerer' field."});
	}
});


/**
* READ ALL
**/
app.get("/user/friends", middlewares.checkAuth, function(req, res){
	models.friend.find({valid: true})
	.or([{"_userAsker": req.user._id}, {"_userAnswerer": req.user._id}])
	.populate("_userAsker", "_id username lastname firstname email")
	.populate("_userAnswerer", "_id username lastname firstname email")
	.where("deleted").ne(true)
	.exec(function(err, friends){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_friends": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			var myFriends = [];
			for(var i=0; i < friends.length; i++){
				if(JSON.stringify(friends[i]._userAsker._id) == JSON.stringify(req.user._id)){
					myFriends.push(friends[i]._userAnswerer);
				}else if(JSON.stringify(friends[i]._userAnswerer._id) == JSON.stringify(req.user._id)){
					myFriends.push(friends[i]._userAsker);
				}
			}
			res.json({"success": true, "friends": myFriends});
		}
	});
});

/**
* READ WAITING RESPONSE
**/
app.get("/friend/waitingResponse", middlewares.checkAuth, function(req, res){
	models.friend.find({valid: false, _userAsker: req.user._id})
	.populate("_userAsker", "_id username lastname firstname email")
	.populate("_userAnswerer", "_id username lastname firstname email")
	.where("deleted").ne(true)
	.exec(function(err, friends){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_friends": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			var myFriends = [];
			for(var i=0; i < friends.length; i++){
				if(JSON.stringify(friends[i]._userAsker._id) == JSON.stringify(req.user._id)){
					myFriends.push(friends[i]._userAnswerer);
				}else if(JSON.stringify(friends[i]._userAnswerer._id) == JSON.stringify(req.user._id)){
					myFriends.push(friends[i]._userAsker);
				}
			}
			res.json({"success": true, "friends": myFriends});
		}
	});
});

/**
* READ WAITING REQUEST
**/
app.get("/friend/waitingRequest", middlewares.checkAuth, function(req, res){
	models.friend.find({valid: false, _userAnswerer: req.user._id})
	.populate("_userAsker", "_id username lastname firstname email")
	.populate("_userAnswerer", "_id username lastname firstname email")
	.where("deleted").ne(true)
	.exec(function(err, friends){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_friends": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			var myFriends = [];
			for(var i=0; i < friends.length; i++){
				if(JSON.stringify(friends[i]._userAsker._id) == JSON.stringify(req.user._id)){
					myFriends.push(friends[i]._userAnswerer);
				}else if(JSON.stringify(friends[i]._userAnswerer._id) == JSON.stringify(req.user._id)){
					myFriends.push(friends[i]._userAsker);
				}
			}
			res.json({"success": true, "friends": myFriends});
		}
	});
});

/**
* READ NO FRIEND
**/
app.get("/user/nofriends", middlewares.checkAuth, function(req, res){
	models.friend.find()
	.or([{"_userAsker": req.user._id}, {"_userAnswerer": req.user._id}])
	.where("deleted").ne(true)
	.exec(function(err, friends){
		if(err){
			if(config.debug == true){
				console.log({"error_GET_friends": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			var myFriends = [];
			for(var i=0; i < friends.length; i++){
				if(friends[i]._userAsker == req.user._id){
					myFriends.push(friends[i]._userAnswerer);
				}else if(friends[i]._userAnswerer == req.user._id){
					myFriends.push(friends[i]._userAsker);
				}
			}
			models.user.find()
			.where("deleted").ne(true)
			.where("_id").ne(req.user._id)
			.select("username lastname firstname created")
			.exec(function(err, users){
				if(err){
					if(config.debug == true){
						console.log({"error_GET_friends": err});
					}
					res.json({"success": false, "error": "An error occurred."});
				}else{
					var noFriends = [];
					var isFriend = false;
					for(var y=0; y < users.length; y++){
						isFriend = false;
						for(var i=0; i < myFriends.length; i++){
							if(myFriends[i] == users[y]._id){
								isFriend = true;
							}
						}
						if(isFriend == false){
							noFriends.push(users[y]);
						}
					}
					res.json({"success": true, "noFriends": noFriends});
				}
			});
		}
	});
});


/**
* ACCEPT REQUEST
**/
app.post("/friend/accept", middlewares.checkAuth, function(req, res){
	if(req.body._userAsker){
		models.friend.findOne({_userAsker: req.body._userAsker, _userAnswerer: req.user._id, valid: false})
		.where("deleted").ne(true)
		.exec(function(err, friend){
			if(err){
				if(config.debug == true){
					console.log({"error_GET_friend_accept": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else if(friend){
				models.friend.update({_id: friend._id}, {valid: true}, function(err){
					res.json({"success": true});
				});
			}else{
				res.json({"success": false, "error": "Can't found request."});	
			}
		});
	}else{
		res.json({"success": false, "error": "Missing '_userAsker' field."});
	}
});

/**
* DENY REQUEST
**/
app.post("/friend/deny", middlewares.checkAuth, function(req, res){
	if(req.body._userAsker){
		models.friend.findOne({_userAsker: req.body._userAsker, _userAnswerer: req.user._id, valid: false})
		.where("deleted").ne(true)
		.exec(function(err, friend){
			if(err){
				if(config.debug == true){
					console.log({"error_GET_friend_accept": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else if(friend){
				models.friend.update({_id: friend._id}, {deleted: true}, function(err){
					res.json({"success": true});
				});
			}else{
				res.json({"success": false, "error": "Can't found request."});	
			}
		});
	}else{
		res.json({"success": false, "error": "Missing '_userAsker' field."});
	}
});


/**
* DELETE
**/
app.post("/friend/delete", middlewares.checkAuth, function(req, res){
	if(req.body._id){
		models.friend.findOne({_userAsker: req.body._id, _userAnswerer: req.user._id})
		.where("deleted").ne(true)
		.exec(function(err, friend){
			if(err){
				if(config.debug == true){
					console.log({"error_GET_friend_delete": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else if(friend){
				models.friend.update({_id: friend._id}, {deleted: true}, function(err){
					res.json({"success": true});
				});
			}else{
				models.friend.findOne({_userAsker: req.user._id, _userAnswerer: req.body._id})
				.where("deleted").ne(true)
				.exec(function(err, friend){
					if(err){
						if(config.debug == true){
							console.log({"error_GET_friend_delete": err});
						}
						res.json({"success": false, "error": "An error occurred."});
					}else if(friend){
						models.friend.update({_id: friend._id}, {deleted: true}, function(err){
							res.json({"success": true});
						});
					}else{
						res.json({"success": false, "error": "Can't found friendship."});	
					}
				});	
			}
		});
	}else{
		res.json({"success": false, "error": "Missing '_userAnswerer' field."});
	}
});

};