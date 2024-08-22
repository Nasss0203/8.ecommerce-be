const { SuccessResponse } = require("../core/success.response");
const { newUserService } = require("../services/user.service");

class UserController {
	//new user
	newUser = async (req, res, next) => {
		const response = await newUserService({
			email: req.body.email,
		});
		new SuccessResponse(response).send(res);
	};

	//check user token via Email
	checkRegisterEmailToken = async () => {};
}

module.exports = new UserController();
