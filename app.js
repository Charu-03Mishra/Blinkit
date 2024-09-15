const express = require("express");
const app = express();
const path = require("path");

const indexrouter = require("./router/googleauth");
const expresssession = require("express-session");
const authRouter = require("./router/admin");
const productRouter = require("./router/product");
const categoryRouter = require("./router/category");

const UserRouter = require("./router/user");
const CartRouter = require("./router/cart");

const cookieParser = require("cookie-parser");

const passport = require("passport");

require("dotenv").config();
require("./config/db");
require("./config/passportauth");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	expresssession({
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use("/auth", indexrouter);
app.use("/admin", authRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/users", UserRouter);
app.use("/cart", CartRouter);

app.listen(3000);
