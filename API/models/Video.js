var mongoose = require('./bdd.js').mongoose;

videoSchema = mongoose.Schema({
	_user: { 
		type: String,
		required: true,
		ref: 'User'
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	size: {
		type: Number,
		default: null
	},
	path: {
		type: String,
		default: null
	},
	rights: { 
		type: String,
		required: true,
		enum: ['public', 'private', 'link'],
		default: 'private'
	},
	created: {
		type: Date,
		default: Date.now
	},
	archived: {
		type: Boolean,
		default: false
	}
});

videoModel = mongoose.model('Video', videoSchema);

exports.Video = videoModel;