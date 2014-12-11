var mongoose = require('./bdd.js').mongoose;

itemSchema = mongoose.Schema({
	_user: { 
		type: String,
		required: true,
		ref: 'user'
	},
	_parentItem: { 
		type: String,
		ref: 'item'
	},
	type: { 
		type: String,
		required: true,
		enum: ['dir', 'file']
	},
	name: {
		type: String,
		required: true
	},
	size: {
		type: Number
	},
	path: {
		type: String
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

itemModel = mongoose.model('item', itemSchema);

exports.item = itemModel;