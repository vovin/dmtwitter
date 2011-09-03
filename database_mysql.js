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
	query = genQuery(query, params);
	//response.write(dbname + ': ' + query);
	return this._dbs[dbname].query(query).fetchObjects();
};

DatabaseMySQL.prototype.queryInsert = function (dbname, query, params) {
	query = genQuery(query, params);
	//response.write(dbname + ': ' + query);
	return this._dbs[dbname].query(query);
};

DatabaseMySQL.prototype.queryAll = function (query, params) {
	var that = this;
	return this._dbnames.map(function (dbname) {
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
	while (!check(res) && i < this._dbnames.length);
	
	if (res)
		res._dbname = this._dbnames[i - 1];

	return res;
};

DatabaseMySQL.prototype.insertID = function (dbname) {
	return this._dbs[dbname].insertId();
};

var genQuery = function (query, params) {
	var i = 0;
	return query.replace(/\?/g, function () {
		return params[i++];
	});
};


exports.DatabaseMySQL = DatabaseMySQL;
