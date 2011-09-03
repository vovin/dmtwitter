'use strict';

var e = function (c) {
	response.write(c);
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

if (request.headers().PATH_INFO === '/timeline.json' && request.method === 'GET') {
	response.write('ok');
}

