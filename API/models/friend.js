var mongoose = require('./bdd.js').mongoose;

friendSchema = mongoose.Schema({
	_userAsker: { 
		type: String,
		required: true,
		ref: 'user'
	},
	_userAnswerer: { 
		type: String,
		required: true,
		ref: 'user'
	},
	valid: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	deleted: {
		type: Boolean,
		default: false
	}
});
friendModel = mongoose.model('friend', friendSchema);

exports.friend = friendModel;
