const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");
const { validate } = require("../middleware/adminvalidate");
const Product = require("../model/product");
const Category = require("../model/category");
require("dotenv").config();

if (
	typeof process.env !== undefined &&
	process.env.NODE_ENV === "DEVELOPMENT"
) {
	router.get("/create", async function (req, res) {
		// Define these variables with some default or mock values for development purposes
		const name = "AdminName";
		const email = "admin@example.com";
		const password = "adminpassword"; // Use a strong password in a real scenario
		const role = "admin";

		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);

			await Admin.create({
				name,
				email,
				password: hash,
				role,
			});
			await user.save();

			const token = jwt.sign(
				{ email: "admin@example.com", admin: true },
				process.env.JWT_SECRET
			);
			res.cookie("token", token);
			res.send("Admin created successfully");
		} catch (error) {
			console.error(error);
			res.status(500).send("Server error");
		}
	});
}
router.get("/login", function (req, res) {
	res.render("admin_login");
});
router.post("/login", async function (req, res) {
	try {
		const { email, password } = req.body;
		let admin = await Admin.findOne({ email: email });
		if (!admin) return res.send("user not found ");
		let vaild = await bcrypt.compare(password, admin.password);
		if (vaild) {
			const token = jwt.sign(
				{ email: "admin@example.com", admin: true },
				process.env.JWT_SECRET
			);
			res.cookie("token", token);
			res.send("Admin login successfully");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
});

router.get("/dashboard", validate, async function (req, res) {
	let prodcount = await Product.countDocuments();
	let catecount = await Category.countDocuments();

	res.render("admin_dashboard", { prodcount, catecount });
});

router.get("/products", validate, async function (req, res) {
	const resultArray = await Product.aggregate([
		{
			$group: {
				_id: "$category",
				products: { $push: "$$ROOT" },
			},
		},
		{
			$project: {
				_id: 0,
				category: "$_id",
				products: 1,
			},
		},
	]);
	const resultObject = resultArray.reduce((acc, item) => {
		acc[item.category] = item.products;
		return acc;
	}, {});

	res.render("admin_products", { products: resultObject });
});

router.get("/logout", validate, function (req, res) {
	res.cookie("token", "");
	res.redirect("/admin/login");
});

module.exports = router;
