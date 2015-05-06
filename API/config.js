/**
* CONFIG
**/
var env = "DEV"; // DEV / PROD
var config = { 
	server: {
		port: 80,
		address: "192.168.1.13"
	},
	salt: "$2a$10$sU3LKpiKHhQfcEezTKuZnY",
	ttlToken: 7200, //1H
	debug: false,
	env: env,
	rootDirectory: __dirname,
	storageDirectory: __dirname+"/STORAGE"
};

// Video properties
config.videoDirectory = config.storageDirectory+"/videos";
config.thumbnailsDirectory = config.storageDirectory+"/thumbnails";
config.tmpDirectory = config.storageDirectory+"/.tmp";
config.videoAllowedExt = ["mp4", "ogg", "webm"];
config.maxVideoSize = 524288000;
config.thumbnailsSize = "300x300"; //Eg: 300x300, 300x?, ?x300

// Dev properties
if("DEV" == env){
	config.server.address = "localhost";
	config.server.port = 8080;
	config.debug = true;
}

exports.config = config;