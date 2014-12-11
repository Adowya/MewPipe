var mongoose = require('./bdd.js').mongoose;

shareSchema = mongoose.Schema({
	_user: { 
		type: String,
		required: true,
		ref: 'user'
	},
	_item: { 
		type: String,
		required: true,
		ref: 'item'
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
shareModel = mongoose.model('share', shareSchema);

exports.share = shareModel;