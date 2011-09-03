'use strict';

var E = require('./e.sjs').E,
	e = new E();

e.get('/statuses/user_timeline.json', function (req, res) {
});

e.error404(function (req, res) {
	res.write('404!');
});
