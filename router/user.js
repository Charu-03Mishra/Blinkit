const express = require("express");
const router = express.Router();

router.get("/login", function (req, res) {
	res.render("user_login");
});
router.get("/profile", function (req, res) {
	res.send("profile");
});

router.get("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) return next(err);
		req.session.destroy((err) => {
			if (err) return next(err);
			res.clearCookie("connect.sid", { path: "/" }); // specify path and other options
			res.redirect("/users/login");
		});
	});
});

module.exports = router;
