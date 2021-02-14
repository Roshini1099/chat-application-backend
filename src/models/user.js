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
	},
	profileImage: {
		type: String
	},
	phoneNumber: {
		type: String
	},
	status: {
		type: String
	}
});

module.exports = mongoose.model('user', UserSchema);
