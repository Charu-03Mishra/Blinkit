const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURL);

const db = mongoose.connection;

module.exports = db;
