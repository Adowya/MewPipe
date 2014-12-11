var mongoose = require('./bdd.js').mongoose;

userSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	_plan: {
		type: String,
		required: true,
		ref: 'plan'
	},
	subscriptionDate: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	deleted: {
		type: Boolean,
		default: false
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
});
userModel = mongoose.model('user', userSchema);

exports.user = userModel;