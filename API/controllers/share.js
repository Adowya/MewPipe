module.exports.controller = function(app, config, modules, models, middlewares) {

/**
* READ ALL
**/
app.get('/shares', middlewares.checkAuth, function(req, res){
	models.share.find({_user: req.user._id})
	.select("_id _user _item key created")
	.populate("_item", "_id _user name type size created path")
	.where("deleted").ne(true)
	.exec(function (err, shares) {
		if(err){
			if(config.debug == true){
				console.log({"errorReadShare": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			models.share.populate(shares, {
				path: '_item._user',
				select: '_id username lastname firstname email created',
				model: models.user 
			}, function(){
				res.json({"success": true, "shares": shares});
			});
		}
	});
});

/**
* READ USER SHARE
**/
app.post("/share/users", middlewares.checkAuth, function(req, res){
	if(req.body.itemId){
		models.share.find({_item: req.body.itemId})
		.populate("_item", "_id name type size created path")
		.populate("_user", "_id username lastname firstname email created")
		.where("deleted").ne(true)
		.exec(function(err, shares){
			if(err){
				if(config.debug == true){
					console.log({"error_GET_friends": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else{
				var usersShare = [];
				for(var i=0; i < shares.length; i++){
					usersShare.push(shares[i]._user);
				}
				res.json({"success": true, "users": usersShare});
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed. (itemId)"});
	}
});

/**
* CREATE
**/
app.post('/share', middlewares.checkAuth, function(req, res){
	if(req.body.itemId && req.body.userId){
		models.item.findOne({_id: req.body.itemId})
		.where("deleted").ne(true)
		.exec(function(err, item){
			if(item){
				if(item._user == req.user._id){
					models.user.findOne({_id: req.body.userId})
					.where("deleted").ne(true)
					.exec(function(err, user){
						if(user){
							models.share.findOne({_user: req.body.userId, _item: req.body.itemId})
							.where("deleted").ne(true)
							.exec(function(err, existShare){
								if(existShare){
									res.json({"success": false, "error": "You have already share this file with this friend."});
								}else{
									var newShare = new models.share({
										_user: req.body.userId,
										_item: req.body.itemId
									});
									newShare.save(function(err, share) {
										if (err) {
											if(config.debug == true){
												console.log({"errorNewShare": err});
											}
											res.json({"success": false, "error": "An error occurred."});
										}else {
											share.deleted = undefined;
											share.__v = undefined;
											res.json({"success": true, "share": share});
										}
									});
								}
							});
						}else{
							res.json({"success": false, "error": "Invalid userId."});
						}
					});
				}else{
					res.json({"success": false, "error": "You can't share this file."});
				}
			}else{
				res.json({"success": false, "error": "Invalid itemId."});
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed. (userId, itemId)"});
	}
});


/**
* DELETE
**/
app.post('/share/delete', middlewares.checkAuth, function(req, res){
	if(req.body.itemId && req.body.userId){
		models.share.findOne({_item: req.body.itemId, _user: req.body.userId})
		.populate("_item")
		.where("deleted").ne(true)
		.exec(function(err, share){
			if(share){
				if(share._item._user == req.user._id){
					models.share.update({_id: share._id},{deleted: true}, function(err){
						if(err){
							res.json({"success": false, "error": "An error occurred."});
						}else{
							res.json({"success": true});
						}
					});
				}else{
					res.json({"success": false, "error": "You are not allowed to remove this sharing."});
				}
			}else{
				res.json({"success": false, "error": "Can't found this sharing."});
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed. (userId, itemId)"});
	}
});
}