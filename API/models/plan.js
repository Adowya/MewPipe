var mongoose = require('./bdd.js').mongoose;

planSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	expireAfter: {
		type: Number,
		required: true
	},
	shareLimit: {
		type: Number,
		required: true
	},
	sizeLimit: {
		type: Number,
		required: true
	},
	bandwidthLimit: {
		type: Number,
		required: true
	},
	isDefault: {
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
planModel = mongoose.model('plan', planSchema);

exports.plan = planModel;