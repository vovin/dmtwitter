var ServerResponse = require('http').ServerResponse;

ServerResponse.prototype.json = function (obj) {
	this.header({
		'Content-Type': 'application/json'
	});
	this.write(JSON.stringify(obj));
	return this;
};

var E = function () {
};

E.prototype.get = function (path, callback) {
	if (_route(path, 'GET')) {
		request._handled = true;
		callback(request, response);
	}
};

E.prototype.post = function (path, callback) {
	if (_route(path, 'POST')) {
		request._handled = true;
		callback(request, response);
	}
};

E.prototype.error404 = function (callback) {
	if (!request._handled) {
		callback(request, response);
	}
};

var _route = function (path, method) {
	return request.headers().PATH_INFO === path && request.method === method;
};

exports.E = E;
