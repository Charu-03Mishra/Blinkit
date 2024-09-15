const Joi = require("joi");

// Define Joi schema for address validation
const uservalidation = (req, res, next) => {
	const addressValidationSchema = Joi.object({
		state: Joi.string().required(),
		city: Joi.string().required(),
		zip: Joi.number().required(),
		address: Joi.string().required(),
	});

	const userValidationSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		phone: Joi.number().required(),
		address: Joi.array().items(addressValidationSchema),
	});

	const { error } = userValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

// Define Joi schema for product validation
const productValidation = (data, res) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(100).required(), // Name is required and must be a string
		price: Joi.number().positive().precision(2).optional(), // Price should be a positive number with up to 2 decimal places
		stock: Joi.boolean().optional(), // Stock should be a number, optional
		category: Joi.string().optional(), // Category is optional and must be a string
		description: Joi.string().optional().allow(""), // Description is optional and can be an empty string
		image: Joi.string().optional(),
	});

	// Validate the body (without the image)
	const { error } = schema.validate(data);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

// Define Joi schema for category validation
const categoryValidation = (req, res, next) => {
	const categoryValidationSchema = Joi.object({
		name: Joi.string().required().min(3).max(30),
	});
	const { error } = categoryValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

// Define Joi schema for payment validation

const paymentValidation = (req, res, next) => {
	const paymentValidationSchema = Joi.object({
		order: Joi.string().required(),
		amount: Joi.number().positive().required(),
		method: Joi.string()
			.valid("Credit Card", "Debit Card", "PayPal", "Bank Transfer")
			.required(),
		status: Joi.string().valid("Pending", "Completed", "Failed").required(),
		TransactionId: Joi.string().required(),
	});
	const { error } = paymentValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

// Define Joi schema for order validation
const orderValidation = (req, res, next) => {
	const orderValidationSchema = Joi.object({
		user: Joi.string().required(),
		product: Joi.array().items(Joi.string().required()).min(1).required(),
		totalprice: Joi.number().positive().required(),
		address: Joi.string().required(),
		status: Joi.string()
			.valid("Pending", "Shipped", "Delivered", "Cancelled")
			.required(),
		payment: Joi.string().required(),
		delivery: Joi.string().required(),
	});
	const { error } = orderValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

// Define Joi schema for delivery validation
const deliveryValidation = (req, res, next) => {
	const deliveryValidationSchema = Joi.object({
		order: Joi.string().required(),
		deliveryBoy: Joi.string().min(3).max(50).required(),
		status: Joi.string()
			.valid("Pending", "Out for Delivery", "Delivered")
			.required(),
		trackingUrl: Joi.string().uri().optional(),
		estimatedDeliveryTime: Joi.number().positive().required(),
	});
	const { error } = deliveryValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

// Define Joi schema for cart validation
const cartValidation = (req, res, next) => {
	const cartValidationSchema = Joi.object({
		user: Joi.string().required(),
		product: Joi.array().items(Joi.string().required()).min(1).required(),
		totalprice: Joi.number().positive().required(),
	});
	const { error } = cartValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

// Define Joi schema for admin validation
const adminValidation = (req, res, next) => {
	const adminValidationSchema = Joi.object({
		name: Joi.string().min(2).max(50).required().trim(),
		email: Joi.string().email().required().trim().lowercase(),
		password: Joi.string().min(6).required(),
		role: Joi.string().valid("user", "admin", "moderator").optional(),
	});
	const { error } = adminValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	next();
};

module.exports = {
	uservalidation,
	productValidation,
	categoryValidation,
	paymentValidation,
	orderValidation,
	deliveryValidation,
	cartValidation,
	adminValidation,
};
