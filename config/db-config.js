const mysql = require('mysql2');

class dbConnection {

	queries = {

	}

	constructor(next) {
		this.db = mysql.createConnection({
			host: "myfilesddns.ddns.net",
			user: "pc",
			password: "Motocross2004!6cpbhh42ay5te",
			database: "minecraft"
		});
	}

	getDb() {
		return this.db;
	}

	Json(rawData) {
		return JSON.parse(JSON.stringify(rawData));
	}
}

module.exports = dbConnection;