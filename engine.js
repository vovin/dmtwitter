var DatabaseMySQL = require('./database_mysql.js').DatabaseMySQL;

var LIMIT = 20;


var Engine = function (host, user, passwd, dbs) {
	this._db = new DatabaseMySQL(host, user, passwd, dbs);
};

Engine.prototype.getUsersTweets = function (screen_name) {
	var user = this.getUser(screen_name);
	
	if (!user) return null;

	//response.write('AAA' + JSON.stringify(user));

	var res = this._db.query(
		user._dbname, 
		'SELECT * FROM statuses WHERE user_id = ? ORDER BY created_at LIMIT ' + LIMIT,
		[ user.id ]
	);

	return res;
};

Engine.prototype.getUser = function (screen_name) {
	var res = this._db.queryUnless(
		'SELECT * FROM users WHERE screen_name = "?"',
		[screen_name],
		function (res) {
			return res[0];
		}
	);
	
	if (res && res[0]) {
		var dbname = res._dbname;
		res = res[0];
		res._dbname = dbname;
	}
	return res;
};

exports.Engine = Engine;
