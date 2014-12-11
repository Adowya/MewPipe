var mongoose = require('./bdd.js').mongoose;

tokenSchema = mongoose.Schema({
	key: {
		type: String,
		required: true
	},
	_user: {
		type: String,
		required: true,
		ref: 'user'
	},
	ttl: {
		type: Number,
		required: true
	}
});
tokenModel = mongoose.model('token', tokenSchema);

exports.token = tokenModel;