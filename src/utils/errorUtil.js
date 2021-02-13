const statusCodes = require('./errorCodes');

exports.bad_request = (msg) => ({
	statusCode: statusCodes.bad_request,
	msg: msg,
});

exports.unauthorised = (msg) => ({
	statusCode: statusCodes.unauthorized,
	msg: msg,
});

exports.forbidden = (msg) => ({
	statusCode: statusCodes.forbidden,
	msg: msg,
});

exports.conflict = (msg) => ({
	statusCode: statusCodes.conflict,
	msg: msg,
});

exports.not_found = (msg) => ({
	statusCode: statusCodes.not_found,
	msg: msg,
});

exports.internal_server_error = (msg) => ({
	statusCode: statusCodes.internal_server_error,
	msg: msg,
});
