const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
	state: {
		type: String,
		required: true,
		minlength: 2,
	},
	city: {
		type: String,
		required: true,
		minlength: 2,
	},
	zip: {
		type: Number,
		required: true,
		min: 10000,
		max: 99999,
	},
	address: {
		type: String,
		required: true,
		minlength: 5,
	},
});

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 2,
		},
		email: {
			type: String,
			required: true,
			unique: true, // ensures email is unique
			match: [/.+\@.+\..+/, "Please enter a valid email"], // regex to validate email format
		},
		password: {
			type: String,

			minlength: 6,
		},
		phone: {
			type: Number,

			min: 1000000000, // Minimum value for a 10-digit phone number
			max: 9999999999, // Maximum value for a 10-digit phone number
		},
		address: [addressSchema],
	},
	{ timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
