const express = require("express");
const router = express.Router();
const { validate } = require("../middleware/adminvalidate");
const Category = require("../model/category");

router.post("/create", validate, async function (req, res) {
	let category = await Category.create({ name: req.body.name });
	res.redirect("back");
});

module.exports = router;
