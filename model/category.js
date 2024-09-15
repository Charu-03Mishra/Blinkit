const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true, // Name is required
			unique: true, // Name must be unique
			minlength: 3, // Minimum length of 3 characters
			maxlength: 30, // Maximum length of 30 characters
			trim: true, // Trims whitespace from the beginning and end of the string
		},
	},
	{ timestamps: true }
);

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
