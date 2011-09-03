'use strict';

var e = function (c) {
	response.write(c);
};

var route = function (path, method) {
	return request.headers().PATH_INFO === path && request.method === method;
};

/*
var MySQL = require('mysql').MySQL;
var db = new MySQL().connect('10.1.1.10', 'devcamp', 'devcamp', 'twitter1');

var r = db.query('SHOW TABLES');
response.write(r.fetchArrays().toString());

/**
response.header({ 'Content-Type': 'text/html' });
e(JSON.stringify(request));
/**/

if (route('/timeline.json', 'GET')) {
	response.write('ok');
}

