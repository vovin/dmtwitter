'use strict';

var E = require('./e.sjs').E,
	e = new E('10.1.1.10', 'devcamp', 'devcamp', [
		'twitter1', 'twitter2', 'twitter3', 'twitter4'
	]),
	engine = new (require('./engine.js').Engine)();


e.get('/statuses/user_timeline.json', function (req, res) {
	if (req.get.screen_name) {
		var tweets = engine.getTweets(req.get.screen_name);
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
});
