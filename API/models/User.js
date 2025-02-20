var mongoose = require('./bdd.js').mongoose;

userSchema = mongoose.Schema({
	identifier: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	authProvider: {
		type: String,
		required: true
	},
	birthdate: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});
userModel = mongoose.model('User', userSchema);

exports.User = userModel;