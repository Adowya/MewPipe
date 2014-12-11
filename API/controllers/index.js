module.exports.controller = function(app, config, modules, models, middlewares) {

	app.get('/', function(req, res){
		res.send('API is running...');
	});

	app.get('/firstLoad', function(req, res){
		var newPlan = new models.plan({
			name: "Free plan",
			description: "Awesome storage capacity for FREE!",
			price: 0,
			expireAfter: 0,
			shareLimit: 10,
			sizeLimit: 5000000000,
			bandwidthLimit: 512000,
			isDefault: true
		});
		newPlan.save(function(err, plan) {
			if (err) {
				if(config.debug == true){
					console.log({"errorAddPlan": err});
				}
				res.json({"success": false, "error": "An error occurred."});
			}else {
				var newUser = new models.user({
					username: "admin",
					password: modules.bcrypt.hashSync("admin", config.salt),
					email: "admin@cubbyhole.fr",
					firstname: "Admin",
					lastname: "Admin",
					isAdmin: true,
					_plan: plan._id
				});

				newUser.save(function(err, newUser){
					if(err){
						if(config.debug == true){
							console.log({"error_ADD_user": err});
						}
						res.json({"success": false, "error": "An error occurred."});
					}else{
						if(err){
							if(config.debug == true){
								console.log({"error_ADD_user": err});
							}
							res.json({"success": false, "error": "An error occurred."});
						}else{
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
											res.json({"success": true});
										}else{
											res.json({"success": false, "error": "Can't initialize your private directory."});
										}
									});
								}
							});
						}
					}
				});
			}
		});
	});
}