var DatabaseMySQL = require('./database_mysql.js').DatabaseMySQL;

var USERS = 'users';
var STATUSES = 'statuses';
var FOLLOWERS = 'followers';
var LIMIT = 20;


var Engine = function (host, user, passwd, dbs) {
	this._db = new DatabaseMySQL(host, user, passwd, dbs);
};

Engine.prototype.getUsersTweets = function (screen_name) {
	var user = this.getUser(screen_name);
	
	if (!user) return null;

	var res = this._db.query(
		user._dbname, 
		'SELECT * FROM statuses WHERE user_id = ? ORDER BY created_at LIMIT 20',
		[ user.id ]
	);

	return res;
};

Engine.prototype.getUser = function (screen_name) {
	var res = this._db.queryUnless(
		'SELECT * FROM users WHERE screen_name = "?"',
		[screen_name],
		function (res) {
			return res;
		}
	);
	
	if (res) {
		var dbname = res._dbname;
		res = res[0];
		res._dbname = dbname;
	}
	return res;
};

exports.Engine = Engine;
