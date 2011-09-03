'use strict';

var E = require('./e.sjs').E,
	e = new E(),
	Engine = require('./engine.js').Engine,
	engine = new Engine(
		'10.1.1.10', 'devcamp', 'devcamp', [
		'twitter1', 'twitter2', 'twitter3', 'twitter4'
	]);


e.get('/statuses/user_timeline.json', function (req, res) {
	if (req.get.screen_name) {
		var tweets = engine.getUsersTweets(req.get.screen_name);
		if (tweets) {
			res.json(tweets);
		}
		else {
			res.json([]);
		}
	}
	else {
		res.status(404);
	}
});

e.error404(function (req, res) {
	res.status(404, '404!');
	res.write('not found!');
});
