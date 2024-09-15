const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 2,
			trim: true, // Trim whitespace
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [/.+\@.+\..+/, "Please enter a valid email"], // Regex for email validation
			trim: true, // Trim whitespace
			lowercase: true, // Convert email to lowercase
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			enum: ["user", "admin", "moderator"], // Only allow specific roles
			default: "user", // Default role is "user"
		},
	},
	{ timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
