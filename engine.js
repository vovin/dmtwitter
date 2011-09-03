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
		'SELECT UNIX_TIMESTAMP(s.created_at) AS created_at, s.text, s.id, s.user_id ' +
		'FROM statuses s WHERE s.user_id IN (?) ORDER BY s.created_at DESC LIMIT ' + LIMIT,
		[followers_ids]		
	);

	var res2 = this._db.queryAll(
		'SELECT * FROM users WHERE id IN (?)',
		[followers_ids]
	);
	
	var users = [],
		r;
	for (var i = 0, li = res2.length; i < li; ++i) {
		r = res2[i];
		for (var j = 0, lj = r.length; j < lj; ++j) {
			users[+r[j].id] = r[j];
		}
	}



	res = formatHomeTimeline(mr4(res), users);

	//response.write(JSON.stringify(res));
	//response.write(JSON.stringify(users));
	return res;
};

Engine.prototype.getUser = function (screen_name) {
	var res = this._db.queryUnless(
		'select "twitter1" as "_dbname",id,name,screen_name,created_at from twitter1.users where screen_name="?" union all select "twitter2" as "_dbname",id,name,screen_name,created_at from twitter2.users where screen_name="?" union all select "twitter3" as "_dbname",id,name,screen_name,created_at from twitter3.users where screen_name="?" union all select "twitter4" as "_dbname",id,name,screen_name,created_at from twitter4.users where screen_name="?" LIMIT 1;',
		[ screen_name, screen_name, screen_name, screen_name ],
		function (res) {
			return res[0];
		}
	);
	
	if (res && res[0]) {
		res = res[0];
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

Engine.prototype.addTweet = function (screen_name, text) {
	var user = this.getUser(screen_name);

	if (!user) return null;

	var res = this._db.queryInsert(
		user._dbname,
		'INSERT INTO statuses (user_id, text, created_at) VALUES (?, "?", NOW())',
		[ user.id, text ]
	);

	var tw = this._db.query(
		user._dbname,
		'SELECT id, UNIX_TIMESTAMP(created_at) AS created_at FROM statuses WHERE id = ?',
		[ this._db.insertID(user._dbname) ]
	)[0];
	
	tw.created_at = new Date(tw.created_at * 1000);
	return tw;
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

var formatHomeTimeline = function (res, users) {
	var r, u;

	for (var i = 0, l = res.length; i < l; ++i) {
		r = res[i];
		u = users[r.user_id];
		res[i] = {
			created_at: new Date(r.created_at * 1000),
			text: r.text,
			id: r.id,
			user: {
				name: u.name,
				id: u.id,
				screen_name: u.screen_name
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
