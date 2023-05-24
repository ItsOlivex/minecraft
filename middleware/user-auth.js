const dbConnection = require("../config/db-config");
const validator = require('validator');
const db = new dbConnection();

let authenticate = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	if (validator.isEmail(email) && password.length >= 8) {
		db.getDb().query("SELECT * FROM Users WHERE email = ? AND password = ?", [email, password], (err, rawUser) => {
			if (err) throw err;
			if (rawUser.length > 0) {
				const user = db.Json(rawUser[0]);
				req.session.id_user = user.id_user;
				req.session.name = user.name;
				req.session.email = user.email;
				req.session.permission = user.permission;
				req.session.darkMode = user.darkMode === 0 ? '' : 'dark';
				next();
			} else {
				res.send("User not found");
			}
		});	
	} else {
		res.send("Credentials error")
	}
}

let checkSession = (req, res, next) => {
	if (req.session.email) {
		next();
	} else {
		res.redirect('/login');
	}
}

let logout = (req, res, next) =>  {
	req.session.destroy();
	next();
}

module.exports = {
	authenticate,
	checkSession,
	logout
}