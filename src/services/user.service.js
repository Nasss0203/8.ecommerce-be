const { SuccessResponse } = require("../core/success.response");
const userModel = require("../models/user.model");
const createError = require("http-errors");
const { sendEmailToken } = require("./email.service");

const newUserService = async ({ email = null, captcha = null }) => {
	//1. Check email exists in dbs
	const user = await userModel.findOne({ email }).lean();

	//2. If exists
	if (user) {
		return createError(409, "Email already exists");
	}

	//3. Send token via email user
	const results = await sendEmailToken({
		email,
	});

	return {
		message: "Verify email user",
		metadata: {
			token: results,
		},
	};
};

module.exports = {
	newUserService,
};
