module.exports.controller = function(app, router, config, modules, models, middlewares){

/**
* DOWNLOAD VIDEO
**/
router.get('/video/download/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid}).exec(function(err, video){
		if(video){
			var file = config.root_dir+"/STORAGE/videos"+video.path;
			var ext = video.path.split('.').pop();
			if(video.name.split('.').pop() != ext){
				var filename = video.name+"."+ext;
			}else{
				var filename = video.name;
			}
			res.download(file, filename);
		}else{
			res.json({"success": false, "error": "Can't found this file."});
		}
	});
});


/**
* READ VIDEO
**/
router.get('/video/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid})
	.select("_id _user name type size created path description")
	.populate("_user", "_id firstname lastname email")
	.exec(function(err, video){
		if(video){
			res.json({"success": true, "data": video});
		}else{
			res.json({"success": false, "error": "Can't found this file."});
		}
	});
});


/**
* UPLOAD FILE middlewares.checkAuth,
**/
router.post('/video', middlewares.multipart, function(req, res) {
	req.user = {};
	req.user._id = req.body._user || "5490c694d67fda9045b12424";
	if (!req.files.file) {
		res.json({ "success": false, "error": 'No video received' });
		return;
	}
	if(req.files.file.size <= 500000000){
		if(req.body.name == "undefined" || req.body.name == undefined){
			req.body.name = req.files.file.name;
		}
		if(req.body.name != "/"){
			var allowedExt = ["avi", "AVI", "mp4", "MP4", "mov", "MOV", "mkv", "MKV"];
			var tmp_path = req.files.file.path;
			var ext = tmp_path.split('.').pop();
			if(allowedExt.indexOf(ext) > -1){
				var newVideo = new models.Video({
					_user: req.user._id,
					name: req.body.name,
					description: req.body.description,
					rights: req.body.rights
				});
				newVideo.save(function(err, video) {
					if(!err){
						video.path = "/"+req.user._id+"/"+video._id+"."+ext;
						var target_path = config.root_dir+"/STORAGE/videos/"+newVideo._user+"/"+video._id+"."+ext;
						var size = req.files.file.size;
						console.log(target_path);
						modules.fs.rename(tmp_path, target_path, function(err) {
							if(err){
								res.json({"success": false, "error": err});
							}else{
								var proc = modules.ffmpeg(config.root_dir+"/STORAGE/videos/"+video.path)
								.on('end', function(files) {
									console.log('screenshots were saved');
								})
								.on('error', function(err) {
									console.log('an error happened: ' + err.message);
								})
								.takeScreenshots({  filename: video._id+'.png', size: "300x200", count: 1, timemarks: [ '20%' ]}, config.root_dir+"/STORAGE/videos/"+video._user);
								modules.fs.unlink(tmp_path, function() {
									if(err){
										res.json({"success": false, "error": err});
									}else{
										models.Video.update({_id: video._id},{path: video.path, size: size}, function(err){
											video.size = size;
											res.json({"success": true, "data": video});
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
				res.json({"success": false, "error": "Invalid video extension."});
			}
		}else{
			res.json({"success": false, "error": "Can't use this name."});
		}
	}else{
		res.json({"success": false, "error": "Invalid video size (max 500mb)."});
	}
});


/**
* BROWSE VIDEO
**/
router.get('/videos', function(req, res) {
	models.Video.find({_user: req.user._id, name: "/"})
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
});

/**
* DELETE VIDEO
**/
router.get('/video/delete/:vid', function(req, res){
	models.Video.findOne({_id: req.body.itemId, _user: req.user._id}).exec(function(err, video){
		if(video){
			models.Video.update({_id: video._id},{deleted: true}, function(err){
				var path = config.root_dir+"/STORAGE/videos"+video.path;
				modules.fs.unlink(path, function(){
					res.json({"success": true});
				});
			});
			models.Video.remove({ _id: video._id }, function(err) {
				if(err){
					res.json({"success": false, "error": err});
				}else{
					var path = config.root_dir+"/STORAGE/videos"+video.path;
					modules.fs.unlink(path, function(){
						res.json({"success": true});
					});
				}
			});
		}else{
			res.json({"success": false, "error": "You can't remove this video."});
		}
	});
});

/**
* ARCHIVE VIDEO
**/
router.get('/video/delete/:vid', function(req, res){
	models.Video.findOne({_id: req.body.itemId, _user: req.user._id}).exec(function(err, video){
		if(video){
			models.Video.update({_id: video._id},{deleted: true}, function(err){
				var path = config.root_dir+"/STORAGE/videos"+video.path;
				modules.fs.unlink(path, function(){
					res.json({"success": true});
				});
			});
		}else if(video.type=='dir'){
			res.json({"success": false, "error": "You can't remove this video."});
		}
	});
});

};