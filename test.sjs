'use strict';

var E = require('./e.sjs').E,
	e = new E();


e.get('/timeline.json', function (req, res) {
	res.write(JSON.stringify(req.get));
});

e.post('/timeline.json', function (req, res) {
	res.write(JSON.stringify(req.post));
});


/*
var MySQL = require('mysql').MySQL;
var db = new MySQL().connect('10.1.1.10', 'devcamp', 'devcamp', 'twitter1');

var r = db.query('SHOW TABLES');
response.write(r.fetchArrays().toString());

/**
response.header({ 'Content-Type': 'text/html' });
e(JSON.stringify(request));
/**/

