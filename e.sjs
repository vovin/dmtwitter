var E = function () {
};

E.prototype.get = function (path, callback) {
	if (_route(path, 'GET')) {
		callback(request, response);
	}
};

E.prototype.post = function (path, callback) {
	if (_route(path, 'POST')) {
		callback(request, response);
	}
};

var _route = function (path, method) {
	return request.headers().PATH_INFO === path && request.method === method;
};

exports.E = E;
