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
		user.dbname, 
		'SELECT * FROM statuses WHERE user_id = ? ORDER BY created_at LIMIT 20',
		[ user.res.id ]
	);
};

Engine.prototype.getUser = function (screen_name) {
	var res = this._db.queryUnless(
		'SELECT * FROM users WHERE screen_name = "?"',
		[screen_name],
		function (res) {
			return res;
		}
	);

	if (res) res.res = res.res[0];
	return res;
};

exports.Engine = Engine;
