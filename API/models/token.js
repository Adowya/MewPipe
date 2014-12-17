var mongoose = require('./bdd.js').mongoose;

tokenSchema = mongoose.Schema({
	key: {
		type: String,
		required: true
	},
	_user: {
		type: String,
		required: true,
		ref: 'User'
	},
	ttl: {
		type: Number,
		required: true
	}
});
tokenModel = mongoose.model('Token', tokenSchema);

exports.Token = tokenModel;