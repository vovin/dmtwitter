var DatabaseMySQL = require('./database_mysql.js').DatabaseMySQL;

var Engine = function (host, user, passwd, dbs) {
	this._db = new DatabaseMySQL();
};

Engine.prototype.getTweets = function (screen_name) {
};

exports.Engine = Engine;
