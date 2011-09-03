'use strict';

var E = require('./e.sjs').E,
	e = new E(),
	Engine = require('./engine.js').Engine,
	engine = new Engine(
		'localhost', 'devcamp', 'devcamp', [
		'twitter1', 'twitter2', 'twitter3', 'twitter4'
	]);


e.get('/statuses/user_timeline.json', function (req, res) {
	if (req.get.screen_name) {
		var tweets = engine.getUserTimeline(req.get.screen_name);
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

e.get('/statuses/home_timeline.json', function (req, res) {
	if (req.get.screen_name) {
		var tweets = engine.getHomeTimeline(req.get.screen_name);
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

var postTweet = function (req, res) {
	var screen_name = (req.get.screen_name || req.post.screen_name)
	var text = (req.get.text || req.post.text);

	if (screen_name) {
		res.json(engine.addTweet(screen_name, text));
	}
	else {
		res.status(404);
	}
};
e.get('/statuses/update.json', postTweet);
e.post('/statuses/update.json', postTweet);


e.error404(function (req, res) {
	res.status(404, '404!');
	res.write('not found!');
});
