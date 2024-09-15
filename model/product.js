const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Product name is required"],
		},
		price: {
			type: Number,
		},
		stock: {
			type: Number,
			default: true,
		},
		category: {
			type: String,
		},
		description: {
			type: String,
			maxlength: 500,
		},
		wait: {
			type: String,
		},
		image: {
			type: Buffer,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;
