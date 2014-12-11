module.exports.controller = function(app, config, modules, models, middlewares){

/**
* DOWNLOAD FILE
**/
app.get('/download/:itemId', function(req, res){
	models.item.findOne({_id: req.params.itemId}).exec(function(err, item){
		if(item){
			if(item.type=='file'){
				var file = config.root_dir+"/STORAGE/files"+item.path;
				var ext = item.path.split('.').pop();
				if(item.name.split('.').pop() != ext){
					var filename = item.name+"."+ext;
				}else{
					var filename = item.name;
				}
				res.download(file, filename);
			}else{
				res.json({"success": false, "error": "Can't download this file."});
			}
		}else{
			res.json({"success": false, "error": "Can't found this file."});
		}
	});
});

/**
* DELETE ITEM
**/
app.put('/item/delete', middlewares.checkAuth, function(req, res){
	if(req.body.itemId){
		models.item.findOne({_id: req.body.itemId, _user: req.user._id}).exec(function(err, item){
			if(item){
				if(item.type=='file'){
					models.item.update({_id: item._id},{deleted: true}, function(err){
						var path = config.root_dir+"/STORAGE/files"+item.path;
						modules.fs.unlink(path, function(){
							res.json({"success": true});
						});
					});
				}else if(item.type=='dir'){
					if(item.name != "/"){
						models.item.find({_parentItem: item._id}).exec(function(err, items){
							if(items.length > 0){
								res.json({"success": false, "error": "Directory must be empty to be deleted."});
							}else{
								models.item.update({_id: item._id},{deleted: true}, function(err){
										res.json({"success": true});
								});
							}
						});
					}else{
						res.json({"success": false, "error": "Can't remove this directory."});
					}
				}
			}else if(item.type=='dir'){
				res.json({"success": false, "error": "You can't remove this file."});
			}
		});
	}
});

/**
* NEW FILE
**/
app.post('/item/new', middlewares.checkAuth, function(req, res){
	if(req.body.name && req.body.content){
		models.item.findOne({_user: req.user._id, name: "/"})
		.where("deleted").ne(true)
		.exec(function(err, checkItemSlash){
			if(!err){
				if(req.body.parentId){
					models.item.findOne({_id: req.body.parentId, _user: req.user._id})
					.where("deleted").ne(true)
					.exec(function(err, parentItem){
						var newItem = new models.item({
							_user: req.user._id,
							_parentItem: parentItem._id,
							type: 'file',
							name: req.body.name,
							path: null,
							size: null
						});
						newItem.save(function(err, item) {
							if(!err){
								var ext = "txt";
								item.path = "/"+req.user._id+"/"+item._id+"."+ext;
								var target_path = config.root_dir+"/STORAGE/files/"+req.user._id+"/"+item._id+"."+ext;
								var size = Math.floor(Math.random()*(4000-1500+1))+1500;

								models.item.update({_id: item._id},{path: item.path, size: size}, function(err){
									item.__v = undefined;
									item.deleted = undefined;
									item.size = size;
									modules.fs.writeFile(target_path, req.body.content, function(err) {
										if(!err){
											res.json({"success": true, "item": item});
										}else{
											res.json({"success": false, "error": err});
										}
									});
								});
							}else{
								res.json({"success": false, "error": err});
							}
						});
					});
				}else{
					var newItem = new models.item({
						_user: req.user._id,
						_parentItem: checkItemSlash._id,
						type: 'file',
						name: req.body.name,
						path: null,
						size: null
					});
					newItem.save(function(err, item) {
						if(!err){
							var ext = "txt";
							item.path = "/"+req.user._id+"/"+item._id+"."+ext;
							var target_path = config.root_dir+"/STORAGE/files/"+req.user._id+"/"+item._id+"."+ext;
							var size = Math.floor(Math.random()*(4000-1500+1))+1500;
							
							models.item.update({_id: item._id},{path: item.path, size: size}, function(err){
								item.__v = undefined;
								item.deleted = undefined;
								item.size = size;
								modules.fs.writeFile(target_path, req.body.content, function(err) {
									if(!err){
										res.json({"success": true, "item": item});
									}else{
										res.json({"success": false, "error": err});
									}
								});
							});
						}else{
							res.json({"success": false, "error": err});
						}
					});
				}
			}else{
				res.json({"success": false, "error": err});
			}
		});
	}else{
		res.json({"success": false, "error": "Missing params. (name, content)"});
	}
});

/**
* UPLOAD FILE
**/
app.post('/items/file', middlewares.checkAuth, function(req, res) {
	if (!req.files.file) {
		res.json({ "success": false, "error": 'No file received' });
	}
	
	if(req.body.name == "undefined" || req.body.name == undefined){
		req.body.name = req.files.file.name;
	}
	if(req.body.name != "/" && req.body.name != "mobile_upload"){
		if(!req.body.parentId){
			models.item.findOne({_user: req.user._id, name: "/"})
			.where("deleted").ne(true)
			.exec(function(err, checkItemSlash){
				if(err){
					res.json({"success": false, "error": err});
				}else if(checkItemSlash){
					var newItem = new models.item({
						_user: req.user._id,
						_parentItem: checkItemSlash._id,
						type: 'file',
						name: req.body.name,
						path: null,
						size: null
					});
					newItem.save(function(err, item) {
						if(!err){
							var tmp_path = req.files.file.path;
							var ext = tmp_path.split('.').pop();
							item.path = "/"+req.user._id+"/"+item._id+"."+ext;
							var target_path = config.root_dir+"/STORAGE/files/"+req.user._id+"/"+item._id+"."+ext;
							var size = req.files.file.size;
							modules.fs.rename(tmp_path, target_path, function(err) {
								if(err){
									res.json({"success": false, "error": err});
								}else{
									modules.fs.unlink(tmp_path, function() {
										if(err){
											res.json({"success": false, "error": err});
										}else{
											models.item.update({_id: item._id},{path: item.path, size: size}, function(err){
												item.__v = undefined;
												item.deleted = undefined;
												item.size = size;
												res.json({"success": true, "item": item});
											});
										}
									});
								}
							});
						}else{
							res.json({"success": false, "error": err});
						}
					});
				}else{
					res.json({"success": false, "error": "Can't found your private directory."});
				}
			});
		}else{
			models.item.findOne({_id: req.body.parentId})
			.where("deleted").ne(true)
			.exec(function(err, item){
				if(item) {
					var newItem = new models.item({
						_user: req.user._id,
						_parentItem: item._id,
						type: 'file',
						name: "no-name",
						path: null,
						size: null
					});
					newItem.save(function(err, item) {
						if(!err){
							var tmp_path = req.files.file.path;
							var ext = tmp_path.split('.').pop();
							item.path = "/"+req.user._id+"/"+item._id+"."+ext;
							var target_path = config.root_dir+"/STORAGE/files/"+req.user._id+"/"+item._id+"."+ext;
							var size = req.files.file.size;
							var filename = req.files.file.name;
							modules.fs.rename(tmp_path, target_path, function(err) {
								if(err){
									res.json({"success": false, "error": err});
								}else{
									modules.fs.unlink(tmp_path, function() {
										if(err){
											res.json({"success": false, "error": err});
										}else{
											models.item.update({_id: item._id},{path: item.path, size: size, name: filename}, function(err){
												item.__v = undefined;
												item.deleted = undefined;
												item.size = size;
												res.json({"success": true, "item": item});
											});
										}
									});
								}
							});
						}else{
							res.json({"success": false, "error": err});
						}
					});
				}else{
					res.json({"success": false, "error": "Invalid parentId."});
				}
			});
		}
	}else{
		res.json({"success": false, "error": "can't use this name."});
	}
});

/**
* ACCEPT FILE (MOBILE VERSION)
**/
app.post('/items/mobile/file', middlewares.checkAuth, function(req, res) {
	if (!req.files.file) {
		res.json({ "success": false, "error": 'No file received' });
		return;
	}

	if(req.body.name == "undefined" || req.body.name == undefined){
		req.body.name = req.files.file.name;
	}
	if(req.body.name != "/" && req.body.name != "mobile_upload"){
		models.item.findOne({_user: req.user._id, name: "mobile_upload"})
		.where("deleted").ne(true)
		.exec(function(err, mobileDir){
			if(err){
				res.json({"success": false, "error": err});
			}else if(mobileDir){
				var newItem = new models.item({
					_user: req.user._id,
					_parentItem: mobileDir._id,
					type: 'file',
					name: req.body.name,
					path: null,
					size: null
				});
				newItem.save(function(err, item) {
					if(!err){
						var tmp_path = req.files.file.path;
						var ext = tmp_path.split('.').pop();
						item.path = "/"+req.user._id+"/mobile_upload/"+item._id+"."+ext;
						var target_path = config.root_dir+"/STORAGE/files/"+req.user._id+"/mobile_upload/"+item._id+"."+ext;
						var size = req.files.file.size;
						modules.fs.rename(tmp_path, target_path, function(err) {
							if(err){
								res.json({"success": false, "error": err});
							}else{
								modules.fs.unlink(tmp_path, function() {
									if(err){
										res.json({"success": false, "error": err});
									}else{
										models.item.update({_id: item._id},{path: item.path, size: size}, function(err){
											item.__v = undefined;
											item.deleted = undefined;
											item.size = size;
											res.json({"success": true, "item": item});
										});
									}
								});
							}
						});
					}else{
						res.json({"success": false, "error": err});
					}
				});
			}else{
				var path = config.root_dir+"/STORAGE/files/"+req.user._id+"/mobile_upload";
				modules.fs.mkdir(path, function(err){
					if(err){
						res.json({"success": false, "error": err});
					}else{
						var newDir = new models.item({
							_user: req.user._id,
							_parentId: null,
							type: 'dir',
							name: "mobile_upload",
							path: "/"+req.user._id+"/mobile_upload",
							size: null
						});
						newDir.save(function(err, dir) {
							if(!err){
								var newItem = new models.item({
									_user: req.user._id,
									_parentItem: dir._id,
									type: 'file',
									name: req.body.name,
									path: null,
									size: null
								});
								newItem.save(function(err, item) {
									if(!err){
										var tmp_path = req.files.file.path;
										var ext = tmp_path.split('.').pop();
										item.path = "/"+req.user._id+"/mobile_upload/"+item._id+"."+ext;
										var target_path = config.root_dir+"/STORAGE/files/"+req.user._id+"/mobile_upload/"+item._id+"."+ext;
										var size = req.files.file.size;
										modules.fs.rename(tmp_path, target_path, function(err) {
											if(err){
												res.json({"success": false, "error": err});
											}else{
												modules.fs.unlink(tmp_path, function() {
													if(err){
														res.json({"success": false, "error": err});
													}else{
														models.item.update({_id: item._id},{path: item.path, size: size}, function(err){
															item.__v = undefined;
															item.deleted = undefined;
															item.size = size;
															res.json({"success": true, "item": item});
														});
													}
												});
											}
										});
									}else{
										res.json({"success": false, "error": err});
									}
								});
							}else{
								res.json({"success": false, "error": "Can't initialize your mobile directory."});
							}
						});
					}
				});
			}
		});
	}else{
		res.json({"success": false, "error": "Can't use this name."});
	}
});

/**
* CREATE DIRECTORY
**/
app.post('/items/dir', middlewares.checkAuth, function(req, res) {
	if(req.body.name){
		if(req.body.name != "/"){
			if(!req.body.parentId){
				models.item.findOne({_user: req.user._id, name: "/"})
				.where("deleted").ne(true)
				.exec(function(err, checkItemSlash){
					if(err){
						res.json({"success": false, "error": err});
					}else if(checkItemSlash){
						var newItem = new models.item({
							_user: req.user._id,
							_parentItem: checkItemSlash._id,
							type: "dir",
							name: req.body.name,
							path: null,
							size: 0
						});
						newItem.save(function(err, item) {
							if(err){
								res.json({"success": false, "error": err.toString() });
							}else{
								item.path = "/"+req.user._id+"/"+item._id;
								models.item.update({_id: item._id},{path: item.path}, function(err){
									item.__v = undefined;
									item.deleted = undefined;
									res.json({"success": true, "item": item});
								});
							}
						});
					}
				});
			}else{
				models.item.findOne({_id: req.body.parentId})
				.where("deleted").ne(true)
				.exec(function(err, item){
					if(item) {
						var newItem = new models.item({
							_user: req.user._id,
							_parentItem: req.body.parentId,
							type: "dir",
							name: req.body.name,
							path: req.body.path,
							size: 0
						});

						newItem.save(function(err, item) {
							if(err){
								res.json({"success": false, "error": err.toString() });
							}else{
								item.path = "/"+req.user._id+"/"+item._id;
								models.item.update({_id: item._id},{path: item.path}, function(err){
									item.__v = undefined;
									item.deleted = undefined;
									res.json({"success": true, "item": item});
								});
							}
						});
					}else{
						res.json({"success": false, "error": "Invalid parentId."});
					}
				});
			}
		}else{
			res.json({"success": false, "error": "can't use this name."});
		}
	}else{
		res.json({"success": false, "error": "Missing params. (name, parentId)"});
	}
});

/**
* BROWSE FILE
**/
app.post('/user/items', middlewares.checkAuth, function(req, res) {
	if(req.body.parentId){
		models.item.find({_user: req.user._id, _parentItem: req.body.parentId})
		.select("_id _user _parentItem name type size created path")
		.sort("type -created")
		.where("deleted").ne(true)
		.exec(function(err, items) {
			if(err){
				res.json({"success": false, "error": err});
			}else{
				res.json({"success": true, "items": items});
			}
		});
	}else{
		models.item.findOne({_user: req.user._id, name: "/"})
		.where("deleted").ne(true)
		.exec(function(err, checkItemSlash){
			if(err){
				res.json({"success": false, "error": err});
			}else if(checkItemSlash){
				models.item.find({_user: req.user._id, _parentItem: checkItemSlash._id})
				.select("_id _user _parentItem name type size created path")
				.sort("type -created")
				.where("deleted").ne(true)
				.exec(function(err, items) {
					if(err){
						res.json({"success": false, "error": err});
					}else{
						res.json({"success": true, "items": items});
					}
				});
			}else{
				res.json({"success": false, "error": "Can't found your / directory."});
			}
		});
	}

});

};