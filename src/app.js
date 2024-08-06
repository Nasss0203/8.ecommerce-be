require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cors = require("cors");

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
	}),
);

//init db
require("./database/init.mongo");

//init route
app.use("/", require("./routes/index"));

//handling error
app.use((res, req, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

//cron
require("./utils/cron.js");

app.use((error, req, res, next) => {
	const statusCode = error.status || 500;
	return res.status(statusCode).json({
		status: "Error",
		code: statusCode,
		stack: error.stack, //debug
		message: error.message || "Internal Server Error",
	});
});

module.exports = app;
