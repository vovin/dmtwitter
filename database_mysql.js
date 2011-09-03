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
	//response.write(query);
	return this._dbs[dbname].query(query).fetchObjects();
};

DatabaseMySQL.prototype.queryAll = function (query, params) {
	var that = this;
	return this._dbs.map(function (dbname) {
		return { res: that.query(dbname, query, params), dbname: dbname };
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
		return { res: res, dbname: this._dbnames[i-1] };
	else
		return null;
};

exports.DatabaseMySQL = DatabaseMySQL;
