const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
	userName: {
		type: String,
		required: true
	},
	emailId: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	socketId: {
		type: String,
	},
	isOnline: {
		type: Boolean,
	},
	lastSeen: {
		type: String,
	},
	directMessage: {
		type: Array,
		default: []
	},
	channels: {
		type: Array,
		default: []
	}
});

module.exports = mongoose.model('user', UserSchema);
