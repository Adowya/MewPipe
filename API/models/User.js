var mongoose = require('./bdd.js').mongoose;

userSchema = mongoose.Schema({
	authId: {
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
		type: String,
		required: true
	},
	birthdate: {
		type: String
	},

});
userModel = mongoose.model('User', userSchema);

exports.User = userModel;