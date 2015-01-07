var mongoose = require('./bdd.js').mongoose;

viewSchema = mongoose.Schema({
	_user: { 
		type: String,
		ref: 'User'
	},
	_video: { 
		type: String,
		required: true,
		ref: 'Video'
	},
	ipAddr: { 
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});
viewModel = mongoose.model('View', viewSchema);

exports.View = viewModel;