const express = require("express");
const router = express.Router();
const { isuserlogin } = require("../middleware/adminvalidate");
const Cart = require("../model/cart");
const Product = require("../model/product");

router.get("/", isuserlogin, async function (req, res) {
	try {
		let cart = await Cart.findOne({ user: req.session.passport.user }).populate(
			"product"
		);
		let cartDataStructure = {};
		cart.product.forEach((product) => {
			let key = product._id.toString();
			if (cartDataStructure[key]) {
				cartDataStructure[key].quantity += 1;
			} else {
				cartDataStructure[key] = {
					...product._doc,
					quantity: 1,
				};
				console.log(cartDataStructure[key]);
			}
		});
		let finalarray = Object.values(cartDataStructure);

		let finalPrice;

		if (cart.product.length === 0) {
			// If no items in the cart, set price to 0
			finalPrice = 0;
		} else {
			// If items are in the cart, calculate the total price + 30
			finalPrice = cart.totalprice + 34;
		}
		let totalprice = cart.totalprice;
		console.log(totalprice);

		res.render("cart", {
			cart: finalarray,
			finalPrice: finalPrice,
			totalprice,
		});
	} catch (error) {
		res.send(error.message);
	}
});
router.get("/add/:id", isuserlogin, async function (req, res) {
	try {
		let cart = await Cart.findOne({ user: req.session.passport.user });
		let product = await Product.findOne({ _id: req.params.id });
		if (!cart) {
			cart = await Cart.create({
				user: req.session.passport.user,
				product: [req.params.id],
				totalprice: Number(product.price),
			});
		} else {
			cart.product.push(req.params.id);
			cart.totalprice = Number(cart.totalprice) + Number(product.price);
			await cart.save();
		}
		res.redirect("back");
	} catch (error) {
		res.send(error.message);
	}
});
router.get("/remove/:id", isuserlogin, async function (req, res) {
	try {
		let cart = await Cart.findOne({ user: req.session.passport.user });
		let product = await Product.findOne({ _id: req.params.id });
		if (!cart) {
			res.send("no cart is here");
		} else {
			let prodId = cart.product.indexOf(req.params.id);
			cart.product.splice(prodId, 1);
			cart.totalprice = Number(cart.totalprice) - Number(product.price);
			await cart.save();
		}
		res.redirect("back");
	} catch (error) {
		res.send(error.message);
	}
});

router.get("/remove/:id", isuserlogin, async function (req, res) {
	try {
		let cart = await Cart.findOne({ user: req.session.passport.user });
		if (!cart) return res.send("something is wrong");
		let index = cart.product.indexOf(req.params.id);
		console.log(index);
		if (index !== -1) {
			cart.product.splice(index, 1);
		} else {
			res.send("item is not in the cart");
		}
		await cart.save();
		res.redirect("back");
	} catch (error) {
		res.send(error.message);
	}
});

module.exports = router;
