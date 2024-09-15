const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true, // User reference is required
		},
		product: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "product",
				required: true, // Product reference is required
			},
		],
		totalprice: {
			type: Number,
			required: true, // Total price is required
		},
	},
	{ timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
