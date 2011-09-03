var MySQL = require('mysql').MySQL;

var DatabaseMySQL = function (host, user, passwd, dbs) {
	this._dbs = {};
	this._dbnames = dbs;

	var that = this;

	dbs.forEach(function (dbname) {
		that._dbs[dbname] = new MySQL().connect(host, user, passwd, dbname);
	});
};

DatabaseMySQL.prototype.query = function (dbname, query, params) {
	var i = 0;
	query = query.replace(/\?/g, function () {
		return params[i++];
	});
	return this._dbs[dbname].query(query).fetchObjects();
};

DatabaseMySQL.prototype.queryAll = function (query, params) {
	var that = this;
	return this._dbs.map(function (dbname) {
		var res = that.query(dbname, query, params);
		res._dbname = dbname;
		return res;
	});
};

DatabaseMySQL.prototype.queryUnless = function (query, params, check) {
	var res = null,
		i = 0;

	do {
		res = this.query(this._dbnames[i], query, params);
		i++;
	}
	while (!check(res) && i < this._dbs.length);
	
	if (res)
		res._dbname = this._dbnames[i - 1];

	return res;
};

exports.DatabaseMySQL = DatabaseMySQL;
