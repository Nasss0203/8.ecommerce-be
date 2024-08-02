const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
	createDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: "Successful code discount",
			metadata: await DiscountService.createDiscountCode({
				...req.body,
				authId: req.user.userId,
			}),
		}).send(res);
	};

	getAllDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: "Successful code Found",
			metadata: await DiscountService.getAllDiscountCodesByShop({
				...req.query,
				authId: req.user.userId,
			}),
		}).send(res);
	};

	getDiscountAmount = async (req, res, next) => {
		new SuccessResponse({
			message: "Successful code Found",
			metadata: await DiscountService.getDiscountAmount({
				...req.body,
			}),
		}).send(res);
	};

	getAllDiscountCodesWithProduct = async (req, res, next) => {
		new SuccessResponse({
			message: "Successful code Found",
			metadata: await DiscountService.getAllDiscountCodesWithProduct({
				...req.query,
			}),
		}).send(res);
	};
}

module.exports = new DiscountController();
