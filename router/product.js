const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const Category = require("../model/category");
const upload = require("../middleware/multer");
const { validate, isuserlogin } = require("../middleware/adminvalidate");
const Cart = require("../model/cart");
const Admin = require("../model/admin");

router.get("/", isuserlogin, async function (req, res) {
	let sometingItem = false;
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

	let cart = await Cart.findOne({ user: req.session.passport.user });
	if (cart && cart.product.length > 0) sometingItem = true;
	const rnproduct = await Product.aggregate([{ $sample: { size: 4 } }]);
	const resultObject = resultArray.reduce((acc, item) => {
		acc[item.category] = item.products;
		return acc;
	}, {});

	res.render("index", {
		products: resultObject,
		rnproduct,
		sometingItem,
		cartCount: cart.product.length,
	});
});

router.get(
	"/delete/:id",
	validate,
	upload.single("image"),
	async function (req, res) {
		if (req.user.admin) {
			let product = await Product.findOneAndDelete({ _id: req.params.id });
			return res.redirect("/admin/products");
		}
	}
);
// Corrected GET route
router.get("/update/:id", async function (req, res) {
	try {
		let product = await Product.findOne({ _id: req.params.id });
		if (!product) {
			return res.status(404).send("Product not found");
		}
		res.render("update", { product });
	} catch (error) {
		res.status(500).send("Server error");
	}
});

router.post("/update/:id", upload.single("image"), async function (req, res) {
	let { stock, image, wait, price, description, name } = req.body;

	let product = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		{ description, stock, image, wait, price, name },
		{ new: true }
	);
	await product.save();
	console.log(product);
	res.redirect("/admin/products");
});

router.post("/", upload.single("image"), async function (req, res) {
	let { name, description, stock, image, category, price, wait } = req.body;

	let iscategory = await Category.findOne({ name: category });

	if (!iscategory) {
		let createCategory = await Category.create({ name: category });
	}

	let product = await Product.create({
		name,
		description,
		price,
		category,
		stock,
		wait,
		image: req.file.buffer,
	});
	res.redirect("back");
});

router.post("/delete", validate, async function (req, res) {
	if (req.user.admin) {
		let product = await Product.findOneAndDelete({ _id: req.body.product_id });
		return res.redirect("/admin/products");
	}
});

module.exports = router;
