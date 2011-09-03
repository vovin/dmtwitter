var DatabaseMySQL = require('./database_mysql.js').DatabaseMySQL;

var LIMIT = 20;


var Engine = function (host, user, passwd, dbs) {
	this._db = new DatabaseMySQL(host, user, passwd, dbs);
};

Engine.prototype.getUserTimeline = function (screen_name) {
	var user = this.getUser(screen_name);
	if (!user) return null;

	//response.write('AAA' + JSON.stringify(user));

	var res = this._db.query(
		user._dbname, 
		'SELECT UNIX_TIMESTAMP(created_at) AS created_at, text, id FROM statuses WHERE user_id = ? ORDER BY created_at DESC LIMIT ' + LIMIT,
		[ user.id ]
	);

	return formatUserTimeline(res);
};

Engine.prototype.getHomeTimeline = function (screen_name) {
	var user = this.getUser(screen_name);
	if (!user) return null;

	var followers_ids = this.getFollowersIDs(user).join(',');

	if (!followers_ids) return null;

	res = this._db.queryAll(
		'SELECT UNIX_TIMESTAMP(s.created_at) AS created_at, s.text, s.id, u.name, u.screen_name, u.id AS user_id from statuses s JOIN users u ON u.id = s.user_id WHERE u.id IN (?) ORDER BY s.created_at DESC LIMIT ' + LIMIT,
		[followers_ids]
	);

	res = formatHomeTimeline(mr4(res));

	//response.write(JSON.stringify(res));
	return res;
};

Engine.prototype.getUser = function (screen_name) {
	var res = this._db.queryUnless(
		'SELECT * FROM users WHERE screen_name = "?"',
		[ screen_name ],
		function (res) {
			return res[0];
		}
	);
	
	if (res && res[0]) {
		var dbname = res._dbname;
		res = res[0];
		res._dbname = dbname;
		return res;
	}
	return null;
};

Engine.prototype.getFollowersIDs = function (user) {
	var res = this._db.query(
		user._dbname,
		'SELECT * FROM followers WHERE user_id = ?',
		[ user.id ]
	);

	return res.map(function (f) {
		return f.follower_id;
	});
};

var mr4 = function (res) {
	var is = res.map(function () { return 0; }),
		tws_sum = res.reduce(function (acc, curr) { return acc + curr.length }, 0),
		r = [],
		min_j;

	for (var i = 0; i < LIMIT && i < tws_sum; ++i) {
		min_j = 0;
		r[i] = res.reduce(function (acc, curr, j) {
			var c = curr[is[j]];

			if (!c) return acc;
			if (!acc || c.created_at < acc.created_at) {
				min_j = j;
				return c;
			}
			return acc;
		}, res[min_j][is[min_j]]);

		is[min_j]++;
	}

	return r;
};

var formatHomeTimeline = function (res) {
	var r;
	for (var i = 0, l = res.length; i < l; ++i) {
		r = res[i];
		res[i] = {
			created_at: new Date(r.created_at * 1000),
			text: r.text,
			id: r.id,
			user: {
				name: r.name,
				id: r.user_id,
				screen_name: r.screen_name
			}
		};
	};
	return res;
};

var formatUserTimeline = function (res) {
	var r;
	for (var i = 0, l = res.length; i < l; ++i) {
		r = res[i];
		res[i] = {
			created_at: new Date(r.created_at * 1000),
			text: r.text,
			id: r.id,
		};
	};
	return res;
};

exports.Engine = Engine;
