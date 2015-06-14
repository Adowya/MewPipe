module.exports.controller = function(app, router, config, modules, models, middlewares, sessions){

var hbjsPercent = {};

/**
* CONVERT VIDEO
**/
var convertVideo = function(videoPath, videoExt, videoId){
	modules.hbjs.spawn({ input: videoPath+"."+videoExt, output: videoPath+".mp4", preset: "Normal"})
	.on("error", function(err){
		if(config.debug){
			console.log(err);
		}
		res.json({"success": false, "error": "Can't convert video."});
	})
	.on("progress", function(progress){
		if(config.debug){
			console.log("Video converting: %s %, ETA: %s", progress.percentComplete, progress.eta);
		}
		hbjsPercent[videoId] = {
			percent: progress.percentComplete,
			eta: progress.eta
		};
		if(progress.percentComplete == 100){
			hbjsPercent[videoId] = undefined;
			models.Video.update({_id: videoId}, {ready: true}, function(){return});
			modules.fs.unlink(videoPath+"."+videoExt, function(){return});
			genrateThumbnails(videoPath+".mp4", videoId);
		}
	});
};


/**
* GENERATE THUMBNAILS
**/
var genrateThumbnails = function(videoName, videoId){
	var proc = modules.ffmpeg(videoName)
	.on('end', function(files) {
		return true;
	})
	.on('error', function(err) {
		return false;
	})
	.takeScreenshots({ filename: videoId+'.png', size: config.thumbnailsSize, count: 1, timemarks: [ '20%' ]}, config.thumbnailsDirectory); 
};


/**
* GET CONVERT PERCENT
**/
router.get('/videos/getConvertPercent/:vid', function(req, res){
	if(hbjsPercent[req.params.vid]){
		return res.json({"success": true, "data": hbjsPercent[req.params.vid]});
	}
	return res.json({"success": true, "data": {percent: 100, eta: "00h00m00s"}});
});


/**
* DOWNLOAD VIDEO
**/
router.get('/videos/download/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid}).exec(function(err, video){
		if(err){
			return res.json({"success": false, "error": "Can't found this video."});
		}
		var videoPath = config.videoDirectory+"/"+video._id+"."+video.ext;
		var videoName = video.name+"."+video.ext;
		res.download(videoPath, videoName);
	});
});


/**
* VIEW VIDEO
**/
router.get('/videos/play/:vid/:token', middlewares.checkViews, function(req, res){
	models.Video.findOne({_id: req.params.vid}).exec(function(err, video){
		if(err){
			return res.json({"success": false, "error": "Can't found this video."});
		}
		var videoPath = config.videoDirectory+"/"+video._id+"."+video.ext;
		var videoName = video.name+"."+video.ext;
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
		}else if(req.viewsIdentifierIp){
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
		res.download(videoPath, videoName);
	});
});


/**
* GET VIDEO THUMBNAILS
**/
router.get('/videos/thumbnails/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid}).exec(function(err, video){
		if(err){
			return res.json({"success": false, "error": "Can't found this video."});
		}
		var thumbnailPath = config.thumbnailsDirectory+"/"+video._id+".png";
		var thumbnailName = video.name+".png";
		if(!modules.fs.existsSync(config.thumbnailsDirectory+"/"+video._id+".png")){
			return res.download(config.rootDirectory+"/img/no-thumbnails.png", thumbnailName);
		}
		res.download(thumbnailPath, thumbnailName);
	});
});


/**
* READ VIDEO
**/
router.get('/videos/:vid', function(req, res){
	models.Video.findOne({_id: req.params.vid})
	.select("-__v -archived")
	.populate("_user", "-identifier -__v")
	.lean()
	.exec(function(err, video){
		if(!video){
			return res.json({"success": false, "error": "Can't found this file."});
		}
		models.View.find({_video: video._id})
		.exec(function(err, views){
			video.views = views.length;
			res.json({"success": true, "data": video});
		});
	});
});


/**
* UPLOAD FILE middlewares.checkAuth,
**/
router.post('/videos/upload', middlewares.checkAuth, middlewares.multipart, function(req, res) {
	if(!req.files.file){
		return res.json({ "success": false, "error": 'No video received' });
	}
	if(req.files.file.size > config.maxVideoSize){
		return res.json({"success": false, "error": "Invalid video size (max 500mb)."});
	}
	if(req.body.title == "undefined" || req.body.title == undefined || req.body.title.replace(/\s+/g, "") == ""){
		req.body.title = req.files.file.name.replace(/\.[^/.]+$/, "");
	}
	if(req.body.title == "/"){
		return res.json({"success": false, "error": "Can't use this name."});
	}
	var tmp_path = req.files.file.path;
	var ext = tmp_path.split('.').pop().toLowerCase();
	if(!modules._.contains(config.videoAllowedExt, ext)){
		return res.json({"success": false, "error": "Invalid video extension."});
	}
	var metadata = JSON.parse(req.body.data);
	var newVideo = new models.Video({
		_user: req.user._id,
		name: req.body.title,
		description: metadata.description,
		size: req.files.file.size,
		ext: "mp4",
		rights: metadata.rights,
		ready: false
	});
	newVideo.save(function(err, video) {
		if(err){
			return res.json({"success": false, "error": err});
		}
		video.path = "/"+video._id+"."+ext;
		video.pathNoExt = "/"+video._id;
		var target_path = config.videoDirectory+video.path;
		var size = req.files.file.size;
		modules.fs.rename(tmp_path, target_path, function(err) {
			if(err){
				return res.json({"success": false, "error": err});
			}
			modules.fs.unlink(tmp_path, function() {
				if(err){
					return res.json({"success": false, "error": err});
				}
				video.archived = undefined;
				video.__v = undefined;
				if(ext != "mp4"){
					convertVideo(config.videoDirectory+video.pathNoExt, ext, video._id)
				}else{
					models.Video.update({_id: video._id}, {ready: true}, function(){return});
					video.ready = true;
					genrateThumbnails(config.videoDirectory+video.pathNoExt+".mp4", video._id);
				}
				res.json({"success": true, "data": video});
			});
		});
	});
});


/**
* BROWSE VIDEO
**/
router.get('/videos', function(req, res) {
	models.Video.find({rights: "public"})
	.where("archived").ne(true)
	.where("ready").equals(true)
	.select("-__v -archived")
	.populate("_user", "-identifier -__v")
	.sort("-created")
	.lean()
	.exec(function(err, videos){
		if(err){
			return res.json({"success": false, "error": err});
		}
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
	});
});


/**
* SEARCH VIDEO param=> q: keywords, sort: ['views', 'created', 'name'], page: number
**/
router.post("/videos/search", function(req, res){
	if(typeof req.body.page == "undefined"){
		req.body.page = 0;
	}else{
		if(isNaN(req.body.page)){
			req.body.page = 0;
		}
	}
	if(typeof req.body.sort == "undefined"){
		req.body.sort = "-created";
	}
	if(req.body.sort == "-views" || req.body.sort == "-views"){
		var sortViews = true;
		req.body.sort = "-created";
	}
	if(typeof req.body.q == "undefined"){
		req.body.q = "";
	}
	var regExSearch = new RegExp(req.body.q, 'i');
	models.Video.find({rights: "public"})
	.where("archived").ne(true)
	.where("ready").equals(true)
	.populate("_user", "-identifier -__v")
	.limit(config.itemsPerPage)
	.skip(config.itemsPerPage * req.body.page)
	.sort(req.body.sort)
	.or([{'name': {$regex: regExSearch}},{'description': {$regex: regExSearch}}])
	.select("-__v -archived")
	.lean()
	.exec(function(err, videos){
		if(err){
			return res.json({"success": false, "error": "Une erreur est survenue."});
		}
		if(videos.length == 0){
			if(sortViews){
				modules._.sortBy(videos, '-views');
				return res.json({"success": true, "data": videos});
			}
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
	});
});


/**
* LAST VIDEOS
**/
router.get('/videos/last/:number', function(req, res) {
	if(isNaN(req.params.number)){
		return res.json({"success": false, "error": "Invalid parameter."});
	}
	models.Video.find({rights: "public"})
	.where("archived").ne(true)
	.where("ready").equals(true)
	.select("-__v -archived")
	.populate("_user", "-identifier -__v")
	.limit(req.params.number)
	.sort("-created")
	.lean()
	.exec(function(err, videos){
		if(err){
			return res.json({"success": false, "error": err});
		}
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
		for(var i=0; i<videos.length; i++){
			models.View.find({_video: videos[i]._id})
			.exec(function(i, err, views){
				pushNbViews(views.length, i);	
			}.bind(models.View, i));
		}
	});
});


/**
* VIDEO SUGGESTION
**/
router.get('/user/videos/suggestion', middlewares.checkAuth, function(req, res) {
	models.View.find({_user: req.user._id})
	.limit(10)
	.populate("_video")
	.exec(function(err, views){
		if(views.length == 0){
			return res.json({"success": true, "data": []});
		}
		var keywords = [];
		for(var i=0; i<views.length; i++){
			var currentKeywords = views[i]._video.name.replace(/\_/g,' ').replace(/\./g,' ').split(" ");
			for(var y=0; y<currentKeywords.length; y++){
				keywords.push(currentKeywords[y]);
			}
		}
		keywords = modules._.uniq(keywords);
		for(var i=0; i<keywords.length; i++){
			if(keywords[i].length <= 1){
				keywords.splice(i, 1);
				i--;
			}
		}
		var suggestedVideos = [];

		modules.async.each(keywords, function (keyword, callback){
			var regExSuggest = new RegExp(keyword, 'i');
			models.Video.find({rights: "public", name: { $regex: regExSuggest } })
			.where("archived").ne(true)
			.where("ready").equals(true)
			.populate("_user", "-identifier -__v")
			.select("-__v -archived")
			.lean()
			.exec(function(err, videos){
				if(videos){
					for(var i=0; i<videos.length; i++){
						suggestedVideos.push(videos[i]);
					}
				}
				callback();
			});

		}, function(err){
			var flags = [], uniqSuggestedVideos = [], l = suggestedVideos.length, i;
			for(i=0; i<l; i++){
				if(flags[suggestedVideos[i]._id]) continue;
				flags[suggestedVideos[i]._id] = true;
				uniqSuggestedVideos.push(suggestedVideos[i]);
			}
			suggestedVideos = uniqSuggestedVideos;

			if(!uniqSuggestedVideos){
				return res.json({"success": true, "data": []});
			}
			suggestedVideos = uniqSuggestedVideos;
			var videosViewed = [];
			for(var i=0; i<views.length; i++){
				videosViewed.push(String(views[i]._video._id));
			}
			var fullSuggestedVideos = suggestedVideos;
			for(var i=0; i<fullSuggestedVideos.length; i++){
				if(modules._.contains(videosViewed, String(fullSuggestedVideos[i]._id))){
					suggestedVideos.splice(i, 1);
					i--;
				}
			}
			if(suggestedVideos.length == 0){
				return res.json({"success": true, "data": []});
			}
			var	last = 0;
			var pushNbViews = function(count, i){
				suggestedVideos[i].views = count;
				last++;
				if(last >= suggestedVideos.length){
					suggestedVideos = modules._.sortBy(suggestedVideos, 'views');
					suggestedVideos = suggestedVideos.reverse();
					res.json({"success": true, "data": suggestedVideos});
				}
			};
			for(var i=0; i<suggestedVideos.length; i++){
				models.View.find({_video: suggestedVideos[i]._id})
				.exec(function(i, err, views){
					pushNbViews(views.length, i);	
				}.bind(models.View, i));
			}
			
		});
	});
});


/**
* VIDEO RELATED
**/
router.get('/videos/related/:vid', function(req, res) {
	models.Video.findOne({_id: req.params.vid})
	.exec(function(err, video){
		if(!video){
			return res.json({"success": true, "data": []});
		}
		var keywords = video.name.replace(/\_/g,' ').replace(/\./g,' ').split(" ");
		keywords = modules._.uniq(keywords);
		for(var i=0; i<keywords.length; i++){
			if(keywords[i].length <= 1){
				keywords.splice(i, 1);
				i--;
			}
		}
		var suggestedVideos = [];
		modules.async.each(keywords, function (keyword, callback){
			var regExSuggest = new RegExp(keyword, 'i');
			models.Video.find({rights: "public", name: { $regex: regExSuggest } })
			.where("archived").ne(true)
			.where("ready").equals(true)
			.populate("_user", "-identifier -__v")
			.select("-__v -archived")
			.lean()
			.exec(function(err, videos){
				if(videos){
					for(var i=0; i<videos.length; i++){
						suggestedVideos.push(videos[i]);
					}
				}
				callback();
			});

		}, function(err){
			var flags = [], uniqSuggestedVideos = [], l = suggestedVideos.length, i;
			for(i=0; i<l; i++){
				if(flags[suggestedVideos[i]._id]) continue;
				flags[suggestedVideos[i]._id] = true;
				uniqSuggestedVideos.push(suggestedVideos[i]);
			}
			suggestedVideos = uniqSuggestedVideos;

			if(!uniqSuggestedVideos){
				return res.json({"success": true, "data": []});
			}
			suggestedVideos = uniqSuggestedVideos;
			//
			var fullSuggestedVideos = suggestedVideos;
			for(var i=0; i<fullSuggestedVideos.length; i++){
				if(String(video._id) == String(fullSuggestedVideos[i]._id)){
					suggestedVideos.splice(i, 1);
					break;
				}
			}
			if(suggestedVideos.length == 0){
				return res.json({"success": true, "data": []});
			}
			//
			var	last = 0;
			var pushNbViews = function(count, i){
				suggestedVideos[i].views = count;
				last++;
				if(last >= suggestedVideos.length){
					suggestedVideos = modules._.sortBy(suggestedVideos, 'views');
					suggestedVideos = suggestedVideos.reverse();
					res.json({"success": true, "data": suggestedVideos});
				}
			};
			for(var i=0; i<suggestedVideos.length; i++){
				models.View.find({_video: suggestedVideos[i]._id})
				.exec(function(i, err, views){
					pushNbViews(views.length, i);	
				}.bind(models.View, i));
			}
			
		});
	});
});


/**
* READ USER'S VIDEOS
**/
router.get('/videos/user/all', middlewares.checkAuth, function(req, res) {
	models.Video.find({_user: req.user._id})
	.where("archived").ne(true)
	.populate("_user", "-identifier -__v")
	.select("-__v -archived")
	.sort("-created")
	.lean()
	.exec(function(err, videos){
		if(err){
			return res.json({"success": false, "error": err});
		}
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
	});
});


/**
* BROWSE VIDEO BY USER
**/
router.get('/videos/user/:uid', function(req, res) {
	models.Video.find({rights: "public", _user: req.params.uid})
	.where("archived").ne(true)
	.where("ready").equals(true)
	.populate("_user", "-identifier -__v")
	.select("-__v -archived")
	.lean()
	.exec(function(err, videos){
		if(err){
			return res.json({"success": false, "error": err});
		}
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
	});
});


/**
* UPDATE
**/
router.put("/videos/:vid", middlewares.checkAuth, function(req, res){
	if(req.body.name && req.body.description && req.body.rights){
		var editVideo = {
			name: req.body.name,
			description: req.body.description,
			rights: req.body.rights
		};
		models.Video.find({_id: req.params.vid})
		.select("-__v -archived")
		.where("archived").ne(true)
		.exec(function(err, video){
			if(err){
				return res.json({"success": false, "error": "Video not found."});
			}
			models.Video.update({_id: req.params.vid}, editVideo, function(err){
				if(err){
					if(config.debug){
						console.log({"error_PUT_video": err});
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
* DELETE VIDEO
**/
router.delete('/videos/:vid', middlewares.checkAuth, function(req, res){
	models.Video.findOne({_id: req.params.vid, _user: req.user._id})
	.exec(function(err, video){
		if(err){
			return res.json({"success": false, "error": "You can't remove this video."});
		}
		models.Video.remove({ _id: video._id }, function(err) {
			if(err){
				return res.json({"success": false, "error": err});
			}
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
		});
	});
});


/**
* ARCHIVE VIDEO
**/
router.get('/videos/archive/:vid', middlewares.checkAuth, function(req, res){
	models.Video.findOne({_id: req.params.vid, _user: req.user._id})
	.exec(function(err, video){
		if(err){
			return res.json({"success": false, "error": "You can't archive this video."});
		}
		models.Video.update({_id: video._id},{archived: true}, function(err){
			if(!err){
				return res.json({"success": true});
			}
			return res.json({"success": true, "error": "An error occured."});
		});
	});
});

};