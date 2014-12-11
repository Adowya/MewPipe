module.exports.controller = function(app, router, config, modules, models, middlewares) {

/**
* READ ALL
**/
router.get('/plan', function(req, res){
	models.plan.find()
	.where("deleted").ne(true)
	.select("name description price expireAfter shareLimit sizeLimit bandwidthLimit isDefault created")
	.exec(function (err, plans) {
		if(plans){
			res.json({"success": true, "plan": plans});
		}else if(err){
			if(config.debug == true){
				console.log({"errorReadPlan": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			res.json({"success": false, "error": "An error occurred."});
		}
	});
});

/**
* READ ONE BY ID
**/
router.get('/plan/:id', function(req, res){
	var id = req.params.id;
	models.plan.findOne({_id: id})
	.select("name description price expireAfter shareLimit sizeLimit bandwidthLimit isDefault created")
	.where("deleted").ne(true)
	.exec(function(err, plan){
		if(plan){
			plan.deleted = undefined;
			plan.__v = undefined;
			res.json({"success": true, "plan": plan});
		}else if(err){
			if(config.debug == true){
				console.log({"errorReadOnePlan": err});
			}
			res.json({"success": false, "error": "An error occurred."});
		}else{
			res.json({"success": false, "error": "An error occurred."});
		}
	});
});


/**
* READ ALL
**/
router.post('/user/plan', middlewares.checkAuth, function(req, res){
	if(req.body.planId){
		models.plan.findOne({_id: req.body.planId})
		.where("deleted").ne(true)
		.exec(function (err, plan) {
			if(plan){
				var editUser = {
					_plan: plan._id
				};
				models.user.update({_id: req.user._id}, editUser, function(err){
					if(err) {
						if(config.debug == true){
							console.log({"errorChangePlanUser": err});
						}
						res.json({"success": false, "error": "An error occurred."});
					}else {
						res.json({"success": true, "plan": plan});
					}
				});
			}else if(err){
				if(config.debug == true){
					console.log({"errorReadPlan": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else{
				res.json({"success": false, "error": "An error occurred."});
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed (planId)."});
	}
});

/**
* CREATE
**/
router.post('/plan', middlewares.checkAdmin, function(req, res){
	if(req.body.name && req.body.description && req.body.price && req.body.expireAfter && req.body.shareLimit && req.body.sizeLimit){
		if(!isNaN(req.body.price) && !isNaN(req.body.expireAfter) && !isNaN(req.body.shareLimit) && !isNaN(req.body.sizeLimit)){
			if(req.body.isDefault == true || req.body.isDefault == "true"){
				req.body.isDefault = true;
				models.plan.update({isDefault: true}, {isDefault: false}, {multi: true}, function(err){return});
			}else{
				req.body.isDefault = false;
			}
			var newPlan = new models.plan({
				name: req.body.name,
				description: req.body.description,
				price: parseFloat(req.body.price),
				expireAfter: parseInt(req.body.expireAfter),
				shareLimit: parseInt(req.body.shareLimit),
				sizeLimit: parseInt(req.body.sizeLimit),
				bandwidthLimit: parseInt(req.body.bandwidthLimit),
				isDefault: req.body.isDefault
			});
			newPlan.save(function(err, plan) {
				if (err) {
					if(config.debug == true){
						console.log({"errorAddPlan": err});
					}
					res.json({"success": false, "error": "An error occurred."});
				}else {
					plan.deleted = undefined;
					plan.__v = undefined;
					res.json({"success": true, "plan": plan});
				}
			});
		}else{
			res.json({"success": false, "error": "Invalid numeric fields."});
		}
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});

/**
* UPDATE
**/
router.put('/plan', middlewares.checkAdmin, function(req, res){
	if(req.body._id){
		var id = req.body._id;
		var data_update = {};
		if(req.body.name){
			data_update.name = req.body.name;
		}
		if(req.body.description){
			data_update.description = req.body.description;
		}
		if(req.body.price){
			data_update.price = parseFloat(req.body.price);
		}
		if(req.body.expireAfter){
			data_update.expireAfter = parseInt(req.body.expireAfter);
		}
		if(req.body.shareLimit){
			data_update.shareLimit = parseInt(req.body.shareLimit);
		}
		if(req.body.sizeLimit){
			data_update.sizeLimit = parseInt(req.body.sizeLimit);
		}
		if(req.body.bandwidthLimit){
			data_update.bandwidthLimit = parseInt(req.body.bandwidthLimit);
		}
		models.plan.findOne({_id: id})
		.where("deleted").ne(true)
		.exec(function(err, plan){
			if(plan){
				if(req.body.isDefault == true || req.body.isDefault == "true"){
					data_update.isDefault = true;
					models.plan.update({isDefault: true}, {isDefault: false}, {multi: true}, function(err){return});
				}else if(req.body.isDefault == "false"){
					if(plan.isDefault == true){
						res.json({"success": false, "error": "Can't update default field on default plan."});
						return;
					}
					data_update.isDefault = plan.isDefault;
				}else{
					data_update.isDefault = plan.isDefault;
				}
				models.plan.update({_id: id}, data_update, function(err, plan, test){
					if(err) {
						if(config.debug == true){
							console.log({"errorUpdatePlan": err});
						}
						res.json({"success": false, "error": "An error occurred."});
					}else{
						models.plan.findOne({_id: id})
						.where("deleted").ne(true)
						.exec(function(err, plan){
							plan.deleted = undefined;
							plan.__v = undefined;
							res.json({"success": true, "plan": plan});
						});
					}
				});
			}else if(err){
				if(config.debug == true){
					console.log({"errorFindUpdatePlan": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else{
				res.json({"success": false, "error": "The plan you want to update doesn't exist."});
			}
		});
	}else{
		res.json({"success": false, "error": "Missing _id field."});
	}
});

/**
* DELETE
**/
router.post('/plan/delete', middlewares.checkAdmin, function(req, res){
	if(req.body._id){
		var id = req.body._id;
		models.plan.findOne({_id: id})
		.where("deleted").ne(true)
		.exec(function(err, plan){
			if(plan){
				if(plan.isDefault == true){
					res.json({"success": false, "error": "Can't remove default plan."});
				}else{
					models.plan.update({_id: id},{deleted: true}, function(err){
						if(err){
							res.json({"success": false, "error": "An error occurred."});
						}else{
							res.json({"success": true});
						}
					});
				}
			}
		});
	}else{
		res.json({"success": false, "error": "All fields must be completed."});
	}
});
}