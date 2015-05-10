module.exports.controller = function(app, router, config, modules, models, middlewares, sessions){

/**
* DOWNLOAD VIDEO
**/
router.get('/videos/download/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid}).exec(function(err, video){
		if(video){
			var videoPath = config.videoDirectory+"/"+video._id+"."+video.ext;
			var videoName = video.name+"."+video.ext;
			res.download(videoPath, videoName);
		}else{
			res.json({"success": false, "error": "Can't found this video."});
		}
	});
});

/**
* VIEW VIDEO
**/
router.get('/videos/play/:vid', middlewares.checkViews, function(req, res){
	models.Video.findOne({_id: req.params.vid}).exec(function(err, video){
		if(video){
			var videoPath = config.videoDirectory+"/"+video._id+"."+video.ext;
			var videoName = video.name+"."+video.ext;
			res.download(videoPath, videoName);
			if(req.viewsIdentifierUser){
				models.View.findOne({_video: video._id, _user: req.viewsIdentifierUser})
				.exec(function(err, view){
					if(!view){
						var newView = new models.View({
							_user: req.viewsIdentifierUser,
							_video: video._id
						});
						newView.save(function(err, view) {
							return;
						});
					}
				});
			}
			if(req.viewsIdentifierIp){
				models.View.findOne({_video: video._id, ipAddr: req.viewsIdentifierIp})
				.exec(function(err, view){
					if(!view){
						var newView = new models.View({
							ipAddr: req.viewsIdentifierIp,
							_video: video._id
						});
						newView.save(function(err, view) {
							return;
						});
					}
				});
			}
		}else{
			res.json({"success": false, "error": "Can't found this video."});
		}
	});
});


/**
* GET VIDEO THUMBNAILS
**/
router.get('/videos/thumbnails/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid}).exec(function(err, video){
		if(video){
			var thumbnailPath = config.thumbnailsDirectory+"/"+video._id+".png";
			var thumbnailName = video.name+".png";
			res.download(thumbnailPath, thumbnailName);
		}else{
			res.json({"success": false, "error": "Can't found this video."});
		}
	});
});


/**
* READ VIDEO
**/
router.get('/videos/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid})
	.select("-__v -archived")
	.populate("_user", "-authId -__v")
	.lean()
	.exec(function(err, video){
		if(video){
			models.View.find({_video: video._id})
			.exec(function(err, views){
				video.views = views.length;
				res.json({"success": true, "data": video});
			});
		}else{
			res.json({"success": false, "error": "Can't found this file."});
		}
	});
});


/**
* UPLOAD FILE middlewares.checkAuth,
**/
router.post('/videos/upload', middlewares.checkAuth, middlewares.multipart, function(req, res) {
	if(req.files.file) {
		if(req.files.file.size <= config.maxVideoSize){
			if(req.body.name == "undefined" || req.body.name == undefined || req.body.name.replace(/\s+/g, "") == ""){
				req.body.name = req.files.file.name.replace(/\.[^/.]+$/, "");
			}
			if(req.body.name != "/"){
				var tmp_path = req.files.file.path;
				var ext = tmp_path.split('.').pop().toLowerCase();
				if(config.videoAllowedExt.indexOf(ext) > -1){
					var metadata = JSON.parse(req.body.data);
					var newVideo = new models.Video({
						_user: req.user._id,
						name: req.body.name,
						description: metadata.description,
						size: req.files.file.size,
						ext: ext,
						rights: metadata.rights
					});
					newVideo.save(function(err, video) {
						if(!err){
							video.path = "/"+video._id+"."+ext;
							var target_path = config.videoDirectory+video.path;
							var size = req.files.file.size;
							modules.fs.rename(tmp_path, target_path, function(err) {
								if(err){
									console.log(err);
									res.json({"success": false, "error": err});
								}else{
									var proc = modules.ffmpeg(config.videoDirectory+video.path)
									.on('end', function(files) {
										modules.fs.unlink(tmp_path, function() {
											if(err){
												res.json({"success": false, "error": err});
											}else{
												video.archived = undefined;
												video.__v = undefined;
												res.json({"success": true, "data": video});
											}
										});
									})
									.on('error', function(err) {
										res.json({"success": false, "error": "An error occured (can not generate video thumbnails)."});
									})
									.takeScreenshots({ filename: video._id+'.png', size: config.thumbnailsSize, count: 1, timemarks: [ '20%' ]}, config.thumbnailsDirectory);  
								}
							});
						}else{
							res.json({"success": false, "error": err.errors.description.message});
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
	}else{
		res.json({ "success": false, "error": 'No video received' });
	}
});


/**
* BROWSE VIDEO
**/
router.get('/videos', function(req, res) {
	models.Video.find({rights: "public"})
	.where("archived").ne(true)
	.select("-__v -archived")
	.populate("_user", "-authId -__v")
	.lean()
	.exec(function(err, videos){
		if(videos){
			if(videos.length == 0){
				res.json({"success": true, "data": videos});
			}
			var	last = 0;
			var pushNbViews = function(count, i){
				videos[i].views = count;
				last++;
				if(last >= videos.length){
					res.json({"success": true, "data": videos});
				}
			};
			for(var i=0; i < videos.length; i++){
				models.View.find({_video: videos[i]._id})
				.exec(function(i, err, views){
					pushNbViews(views.length, i);	
				}.bind(models.View, i));
			}
		}else{
			res.json({"success": false, "error": err});
		}
	});
});

/**
* LAST VIDEOS
**/
router.get('/videos/last/:number', function(req, res) {
	if(!isNaN(req.params.number)){
		models.Video.find({rights: "public"})
		.where("archived").ne(true)
		.select("-__v -archived")
		.populate("_user", "-authId -__v")
		.limit(req.params.number)
		.sort("-created")
		.lean()
		.exec(function(err, videos){
			if(videos){
				if(videos.length == 0){
					res.json({"success": true, "data": videos});
				}
				var	last = 0;
				var pushNbViews = function(count, i){
					videos[i].views = count;
					last++;
					if(last >= videos.length){
						res.json({"success": true, "data": videos});
					}
				};
				for(var i=0; i < videos.length; i++){
					models.View.find({_video: videos[i]._id})
					.exec(function(i, err, views){
						pushNbViews(views.length, i);	
					}.bind(models.View, i));
				}
			}else{
				res.json({"success": false, "error": err});
			}
		});
	}else{
		res.json({"success": false, "error": "Invalid parameter."});
	}
});

/**
* VIDEO SUGGESTION
**/
router.get('/user/videos/suggestion', middlewares.checkAuth, function(req, res) {
	models.View.find({_user: req.user._id})
	.populate("_video")
	.exec(function(err, views){
		console.log(views);
	});


	// models.Video.find({rights: "public"})
	// .where("archived").ne(true)
	// .select("-__v -archived")
	// .populate("_user", "-authId -__v")
	// .lean()
	// .exec(function(err, videos){
	// 	if(videos){
	// 		if(videos.length == 0){
	// 			res.json({"success": true, "data": videos});
	// 		}
	// 		var	last = 0;
	// 		var pushNbViews = function(count, i){
	// 			videos[i].views = count;
	// 			last++;
	// 			if(last >= videos.length){
	// 				res.json({"success": true, "data": videos});
	// 			}
	// 		};
	// 		for(var i=0; i < videos.length; i++){
	// 			models.View.find({_video: videos[i]._id})
	// 			.exec(function(i, err, views){
	// 				pushNbViews(views.length, i);	
	// 			}.bind(models.View, i));
	// 		}
	// 	}else{
	// 		res.json({"success": false, "error": err});
	// 	}
	// });
});

/**
* BROWSE VIDEO BY USER
**/
router.get('/videos/user/:uid', function(req, res) {
	models.Video.find({rights: "public", _user: req.params.uid})
	.where("archived").ne(true)
	.populate("_user", "-authId -__v")
	.select("-__v -archived")
	.lean()
	.exec(function(err, videos){
		if(!err){
			if(videos.length == 0){
				res.json({"success": true, "data": videos});
			}
			var	last = 0;
			var pushNbViews = function(count, i){
				videos[i].views = count;
				last++;
				if(last >= videos.length){
					res.json({"success": true, "data": videos});
				}
			};
			for(var i=0; i < videos.length; i++){
				models.View.find({_video: videos[i]._id})
				.exec(function(i, err, views){
					pushNbViews(views.length, i);	
				}.bind(models.View, i));
			}
		}else{
			res.json({"success": false, "error": err});
		}
	});
});


/**
* DELETE VIDEO
**/
router.get('/videos/delete/:vid', middlewares.checkAuth, function(req, res){
	models.Video.findOne({_id: req.params.vid, _user: req.user._id})
	.exec(function(err, video){
		if(video){
			models.Video.remove({ _id: video._id }, function(err) {
				if(err){
					res.json({"success": false, "error": err});
				}else{
					var videoPath = config.videoDirectory+"/"+video._id+"."+video.ext;
					var thumbnailPath = config.thumbnailsDirectory+"/"+video._id+".png";
					modules.fs.unlink(videoPath, function(){
						modules.fs.unlink(thumbnailPath, function(){
							return;
						});
					});
					models.View.remove({ _video: video._id }, function(err) {
						return;
					});
					res.json({"success": true});
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
router.get('/videos/archive/:vid', middlewares.checkAuth, function(req, res){
	models.Video.findOne({_id: req.params.vid, _user: req.user._id})
	.exec(function(err, video){
		if(video){
			models.Video.update({_id: video._id},{archived: true}, function(err){
				if(!err){
					res.json({"success": true});
				}else{
					res.json({"success": true, "error": "An error occured."});
				}
			});
		}else{
			res.json({"success": false, "error": "You can't archive this video."});
		}
	});
});

};