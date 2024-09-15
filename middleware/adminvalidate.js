const jwt = require("jsonwebtoken");
require("dotenv").config();

async function validate(req, res, next) {
	try {
		let token = req.cookies.token;
		if (!token) return res.send("you need login first");
		let data = await jwt.verify(token, process.env.JWT_SECRET);
		req.user = data;
		next();
	} catch (error) {
		res.send("something wrong");
	}
}

async function isuserlogin(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/users/login");
}
module.exports = { validate, isuserlogin };
